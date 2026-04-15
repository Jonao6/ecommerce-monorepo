import jwt, { JwtPayload } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { prisma } from "../lib/index.js"
import type { Context as HonoContext} from 'hono';
import { Role as UserRole } from "../utils/rbac.js";
import type { RateLimitInfo } from "../utils/rateLimit.js";
import { RATE_LIMITS } from "../utils/rateLimit.js";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";

export type UserPayload = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export interface ServerContext {
  c: HonoContext
  req: Request;
  res: Response;
  prisma: typeof prisma;
  user: UserPayload | null;
  setCookie: (name: string, value: string, options?: Record<string, any>) => void
  clearCookie: (name: string) => void
  getCookie: (name: string) => string | undefined
  applyRateLimit?: (type?: keyof typeof RATE_LIMITS) => Promise<RateLimitInfo>;
  RateLimitUtils?: {
    getMetrics: () => Record<string, any>;
    clearRateLimit: (identifier: string) => Promise<void>;
    getRateLimitInfo: (identifier: string, windowMs: number) => Promise<RateLimitInfo | null>;
  };
}

function verifyToken(token: string): UserPayload {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded.id || !decoded.email) {
      throw new Error("Invalid token payload");
    }
    return decoded as UserPayload;
  } catch (error) {
    throw new GraphQLError("Invalid or expired token", {
      extensions: { code: "INVALID_TOKEN" }
    });
  }
}

export const context = async ({ c }: { c: HonoContext }) => {
  let user: UserPayload | null = null;

  const authHeader = c.req.header('authorization') || "";

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      user = verifyToken(token);
    } catch {
      user = null;
    }
  }

  if (!user) {
    const token = getCookie(c, 'accessToken');

    if (token) {
      try {
        user = verifyToken(token);
      } catch {
        user = null;
      }
    }
  }

  return {
    c,
    req: c.req.raw,
    res: c.res,
     setCookie: (name: string, value: string, options?: CookieOptions) => {
      setCookie(c, name, value, options);
    },

    clearCookie: (name: string) => {
      deleteCookie(c, name);
    },

    getCookie: (name: string) => {
      return getCookie(c, name);
    },
    prisma,
    user,
  };
};