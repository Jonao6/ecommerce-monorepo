import { getRedisClient } from "../redis/client.js"
import { GraphQLError } from "graphql"
import { SLIDING_WINDOW_LUA } from "./lua/slidingWindow.js"
import { FIXED_WINDOW_LUA } from "./lua/fixedWindow.js"

export interface RateLimitOptions {
  windowMs: number
  maxRequests: number
  identifier?: string
  slidingWindow?: boolean
  keyPrefix?: string
}

export interface RateLimitInfo {
  limit: number
  current: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

export class RateLimitError extends GraphQLError {
  constructor(
    message: string,
    public info: RateLimitInfo,
  ) {
    super(message, {
      extensions: {
        code: "RATE_LIMIT_EXCEEDED",
        rateLimitInfo: info,
      },
    })
  }
}

class SimpleSlidingWindowLimiter {
  async checkLimit(
    key: string,
    windowMs: number,
    maxRequests: number,
  ): Promise<{ allowed: boolean; count: number; resetTime: number }> {
    const redis = await getRedisClient()
    const now = Date.now()
    const member = `${now}:${crypto.randomUUID()}`

    try {
      const [allowed, count, resetTime] = (await redis.eval(
        SLIDING_WINDOW_LUA,
        {
          keys: [key],
          arguments: [
            String(now),
            String(windowMs),
            String(maxRequests),
            member,
          ],
        },
      )) as [number, number, number]

      return { allowed: allowed === 1, count, resetTime }
    } catch (error) {
      console.warn(
        "Sliding window failed, falling back to fixed window:",
        error,
      )
      return this.checkFixedWindowLua(key, windowMs, maxRequests)
    }
  }

  private async checkFixedWindowLua(
    key: string,
    windowMs: number,
    maxRequests: number,
  ): Promise<{ allowed: boolean; count: number; resetTime: number }> {
    const now = Date.now()
    const windowStart = Math.floor(now / windowMs) * windowMs
    const windowKey = `${key}:${windowStart}`

    const redis = await getRedisClient()

    try {
      const [allowed, count, resetTime] = (await redis.eval(FIXED_WINDOW_LUA, {
        keys: [windowKey],
        arguments: [String(maxRequests), String(windowMs), String(now)],
      })) as [number, number, number, number]

      return {
        allowed: allowed === 1,
        count,
        resetTime,
      }
    } catch (error) {
      console.warn("Fixed window limiter (Lua) error:", error)
      return { allowed: true, count: 0, resetTime: now + windowMs }
    }
  }
}

class RateLimitMetrics {
  private static metrics = new Map<
    string,
    {
      totalRequests: number
      blockedRequests: number
      averageResponseTime: number
      lastUpdated: number
    }
  >()

  static recordRequest(
    key: string,
    blocked: boolean,
    responseTime: number,
  ): void {
    const existing = this.metrics.get(key) || {
      totalRequests: 0,
      blockedRequests: 0,
      averageResponseTime: 0,
      lastUpdated: Date.now(),
    }

    existing.totalRequests++
    if (blocked) {
      existing.blockedRequests++
    }

    existing.averageResponseTime =
      (existing.averageResponseTime + responseTime) / 2
    existing.lastUpdated = Date.now()

    this.metrics.set(key, existing)
  }

  static getMetrics(key: string) {
    return this.metrics.get(key)
  }

  static getAllMetrics() {
    return Object.fromEntries(this.metrics)
  }

  static cleanupOldMetrics(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now()
    for (const [key, metric] of this.metrics.entries()) {
      if (now - metric.lastUpdated > maxAge) {
        this.metrics.delete(key)
      }
    }
  }
}

export async function rateLimit(
  context: any,
  options: RateLimitOptions,
): Promise<RateLimitInfo> {
  const startTime = Date.now()
  const identifier = options.identifier || context.req?.ip || "unknown"
  const keyPrefix = options.keyPrefix || "rate_limit"
  const key = `${keyPrefix}:${identifier}:${options.windowMs}`

  try {
    const limiter = new SimpleSlidingWindowLimiter()
    const result = await limiter.checkLimit(
      key,
      options.windowMs,
      options.maxRequests,
    )

    const responseTime = Date.now() - startTime
    RateLimitMetrics.recordRequest(key, !result.allowed, responseTime)

    const rateLimitInfo: RateLimitInfo = {
      limit: options.maxRequests,
      current: result.count,
      remaining: Math.max(0, options.maxRequests - result.count),
      resetTime: result.resetTime,
      retryAfter: !result.allowed
        ? Math.ceil((result.resetTime - Date.now()) / 1000)
        : undefined,
    }

    if (!result.allowed) {
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${rateLimitInfo.retryAfter} seconds.`,
        rateLimitInfo,
      )
    }

    return rateLimitInfo
  } catch (error) {
    const responseTime = Date.now() - startTime

    if (error instanceof RateLimitError) {
      throw error
    }

    console.warn(`Rate limiting failed for key ${key}:`, error)
    RateLimitMetrics.recordRequest(key + ":error", false, responseTime)

    return {
      limit: options.maxRequests,
      current: 0,
      remaining: options.maxRequests,
      resetTime: Date.now() + options.windowMs,
    }
  }
}

export const RATE_LIMITS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    slidingWindow: true,
    keyPrefix: "auth_limit",
  },
  GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    slidingWindow: true,
    keyPrefix: "api_limit",
  },
  SENSITIVE: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    slidingWindow: true,
    keyPrefix: "sensitive_limit",
  },
  PAYMENT: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    slidingWindow: true,
    keyPrefix: "payment_limit",
  },
} as const

export async function applyRateLimit(
  context: any,
  operationType: keyof typeof RATE_LIMITS = "GENERAL",
): Promise<RateLimitInfo> {
  return await rateLimit(context, RATE_LIMITS[operationType])
}

async function scanDel(
  redis: any,
  pattern: string,
  scanCount = 200,
  delBatchSize = 500
): Promise<number> {
  let cursor = "0";
  let deleted = 0;

  do {
    let keys: string[] = [];

    try {
      const res = await redis.scan(cursor, "MATCH", pattern, "COUNT", String(scanCount));
      cursor = res[0];
      keys = res[1];
    } catch {
      const res = await redis.scan(cursor, { MATCH: pattern, COUNT: scanCount });
      cursor = String(res.cursor ?? res[0] ?? "0");
      keys = res.keys ?? res[1] ?? [];
    }

    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i += delBatchSize) {
        const chunk = keys.slice(i, i + delBatchSize);
        const n = await redis.del(chunk);
        deleted += typeof n === "number" ? n : chunk.length;
      }
    }
  } while (cursor !== "0");

  return deleted;
}

export const RateLimitUtils = {
  getMetrics: RateLimitMetrics.getMetrics,
  getAllMetrics: RateLimitMetrics.getAllMetrics,
  cleanupMetrics: RateLimitMetrics.cleanupOldMetrics,

  async clearRateLimit(identifier: string, prefix: string = "rate_limit"): Promise<void> {
  try {
    const redis = await getRedisClient();
    const pattern = `${prefix}:${identifier}:*`;

    await scanDel(redis, pattern);

  } catch (error) {
    console.warn("Failed to clear rate limit:", error);
  }
},

  async getRateLimitInfo(
    identifier: string,
    windowMs: number,
    prefix: string = "rate_limit",
  ): Promise<RateLimitInfo | null> {
    try {
      const key = `${prefix}:${identifier}:${windowMs}`
      const redis = await getRedisClient()

      const windowStart = Math.floor(Date.now() / windowMs) * windowMs
      const windowKey = `${key}:${windowStart}`
      const count = await redis.get(windowKey)

      if (count) {
        const current = parseInt(count)
        return {
          limit: 100,
          current,
          remaining: Math.max(0, 100 - current),
          resetTime: windowStart + windowMs,
        }
      }

      return null
    } catch (error) {
      console.warn("Failed to get rate limit info:", error)
      return null
    }
  },
}

setInterval(
  () => {
    RateLimitMetrics.cleanupOldMetrics()
  },
  60 * 60 * 1000,
)
