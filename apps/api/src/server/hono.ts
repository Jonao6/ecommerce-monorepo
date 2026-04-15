import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { getCookie, setCookie } from "hono/cookie"
import { createYoga, createSchema } from "graphql-yoga"
import { GraphQLError } from "graphql"
import jwt from "jsonwebtoken"
import Stripe from "stripe"
import { resolvers } from "../graphql/resolvers/index.js"
import { typeDefs } from "../graphql/schema/index.js"
import { prisma } from "../lib/index.js"
import { getRedisClient } from "../redis/client.js"
import {
  RATE_LIMITS,
  applyRateLimit,
  RateLimitUtils,
  type RateLimitInfo,
} from "../utils/rateLimit.js"

const app = new Hono()
const PORT = process.env.PORT || 4000
let _stripe: Stripe | null = null

function getCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies: Record<string, string> = {}
  cookieHeader.split(";").forEach((cookie) => {
    const [key, value] = cookie.trim().split("=")
    if (key && value) {
      cookies[key] = decodeURIComponent(value)
    }
  })
  return cookies
}

const getStripe = (): Stripe => {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      typescript: true,
    })
  }
  return _stripe
}

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:4000"] : []),
].filter(Boolean)

app.use("*", logger())

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return "*"
      if (allowedOrigins.includes(origin)) return origin
      return "*"
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: [
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
    ],
  }),
)

app.use("*", async (c, next) => {
  const timestamp = new Date().toISOString()
  const ip =
    c.req.header("x-forwarded-for") ||
    c.req.header("cf-connecting-ip") ||
    "unknown"
  const userAgent = c.req.header("user-agent") || "unknown"
  const path = c.req.path

  if (
    path.includes("..") ||
    path.includes("<script>") ||
    path.toLowerCase().includes("select")
  ) {
    console.warn(
      `SUSPICIOUS REQUEST DETECTED: ${timestamp} - ${c.req.method} ${path} - IP: ${ip} - User-Agent: ${userAgent}`,
    )
  }

  await next()
})

app.post("/webhook", async (c) => {
  const sig = c.req.header("stripe-signature")
  const body = await c.req.arrayBuffer()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      Buffer.from(body),
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err: any) {
    c.status(400)
    return c.json({ error: `Webhook Error: ${err.message}` })
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object
    const orderId = Number(paymentIntent.metadata.orderId)

    try {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: { status: "processing" },
        }),
        prisma.payment.update({
          where: { orderId: orderId },
          data: { paymentStatus: "paid", paidAt: new Date() },
        }),
      ])
      console.log(`Pedido ${orderId} atualizado`)
    } catch (dbError) {
      console.error(`Erro ao atualizar o pedido ${orderId} no banco:`, dbError)
    }
  }

  return c.json({ received: true })
})

app.get("/me", async (c) => {
  try {
    const rateLimitInfo = await applyRateLimit(
      { req: { ip: c.req.header("x-forwarded-for") || "unknown" } },
      "AUTH",
    )
    c.header("X-RateLimit-Limit", rateLimitInfo.limit.toString())
    c.header("X-RateLimit-Remaining", rateLimitInfo.remaining.toString())
    c.header(
      "X-RateLimit-Reset",
      Math.ceil(rateLimitInfo.resetTime / 1000).toString(),
    )
  } catch (error: any) {
    if (error?.message?.includes("Rate limit exceeded")) {
      c.status(429)
      return c.json({
        error: error.message,
        retryAfter:
          error.info?.retryAfter || error.extensions?.rateLimitInfo?.retryAfter,
        rateLimitInfo: error.info || error.extensions?.rateLimitInfo,
      })
    }
  }

  const accessToken = getCookie(c, "accessToken")
  const refreshToken = getCookie(c, "refreshToken")

  const generateNewAccessToken = async () => {
    if (!refreshToken) return null
    const redis = await getRedisClient()
    const userId = await redis.get(`refresh_${refreshToken}`)
    if (!userId || typeof userId !== "string") return null

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return null

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    )

    setCookie(c, "accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60,
      sameSite: "none",
      path: "/",
    })

    return user
  }

  const sanitizeUser = (user: any) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  if (!accessToken) {
    const user = await generateNewAccessToken()
    if (!user) {
      c.status(401)
      return c.json({ ok: false })
    }
    return c.json({ ok: true, user: sanitizeUser(user) })
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!)
    return c.json({ ok: true, user: decoded })
  } catch {
    const user = await generateNewAccessToken()
    if (!user) {
      c.status(401)
      return c.json({ ok: false })
    }
    return c.json({ ok: true, user: sanitizeUser(user) })
  }
})

app.get("/health", (c) => c.json({ status: "ok" }))

app.get("/admin/rate-limit-metrics", async (c) => {
  const adminKey = c.req.header("x-admin-key")
  if (adminKey !== process.env.ADMIN_API_KEY) {
    c.status(403)
    return c.json({ error: "Unauthorized" })
  }

  try {
    const metrics = RateLimitUtils.getAllMetrics()
    return c.json({
      metrics,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    c.status(500)
    return c.json({ error: "Failed to fetch metrics" })
  }
})

app.post("/admin/clear-rate-limit", async (c) => {
  const adminKey = c.req.header("x-admin-key")
  if (adminKey !== process.env.ADMIN_API_KEY) {
    c.status(403)
    return c.json({ error: "Unauthorized" })
  }

  const { identifier } = await c.req.json()
  if (!identifier) {
    c.status(400)
    return c.json({ error: "Identifier is required" })
  }

  try {
    await RateLimitUtils.clearRateLimit(identifier)
    return c.json({ message: `Rate limit cleared for ${identifier}` })
  } catch (error) {
    c.status(500)
    return c.json({ error: "Failed to clear rate limit" })
  }
})

type UserPayload = {
  id: string
  email: string
  name?: string
  role: string
  iat: number
  exp: number
}

function verifyToken(token: string): UserPayload {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload
    if (!decoded.id || !decoded.email) {
      throw new GraphQLError("Invalid token payload", {
        extensions: { code: "INVALID_TOKEN" },
      })
    }
    return decoded
  } catch (error: any) {
    throw new GraphQLError("Invalid or expired token", {
      extensions: { code: "INVALID_TOKEN" },
    })
  }
}

const yoga: any = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }) as any,
  graphqlEndpoint: "/graphql",
  context: async ({ request }: { request: Request }) => {
    let user: UserPayload | null = null

    const authHeader = request.headers.get("authorization") || ""
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1]
      try {
        user = verifyToken(token)
      } catch {
        user = null
      }
    }

    if (!user) {
      const cookies = getCookies(request)
      const accessToken = cookies["accessToken"]
      if (accessToken) {
        try {
          user = verifyToken(accessToken)
        } catch {
          user = null
        }
      }
    }

    return {
      req: request,
      prisma,
      user,
      async applyRateLimit(
        type: keyof typeof RATE_LIMITS = "GENERAL",
      ): Promise<RateLimitInfo> {
        const headers = request.headers
        const identifier = headers.get("x-forwarded-for") || "unknown"
        return await applyRateLimit({ req: { ip: identifier } }, type)
      },
      RateLimitUtils: {
        getMetrics: () => RateLimitUtils.getMetrics,
        clearRateLimit: (identifier: string) =>
          RateLimitUtils.clearRateLimit(identifier),
        getRateLimitInfo: (identifier: string, windowMs: number) =>
          RateLimitUtils.getRateLimitInfo(identifier, windowMs),
      },
    }
  },
})

app.use("/graphql", async (c, next) => {
  try {
    const rateLimitInfo = await applyRateLimit(
      { req: { ip: c.req.header("x-forwarded-for") || "unknown" } },
      "GENERAL",
    )

    c.header("X-RateLimit-Limit", rateLimitInfo.limit.toString())
    c.header("X-RateLimit-Remaining", rateLimitInfo.remaining.toString())
    c.header(
      "X-RateLimit-Reset",
      Math.ceil(rateLimitInfo.resetTime / 1000).toString(),
    )
  } catch (error: any) {
    if (error?.message?.includes("Rate limit exceeded")) {
      c.status(429)
      return c.json({
        error: error.message,
        retryAfter:
          error.info?.retryAfter || error.extensions?.rateLimitInfo?.retryAfter,
        rateLimitInfo: error.info || error.extensions?.rateLimitInfo,
      })
    }
  }
  await next()
})

app.all("/graphql", async (c) => {
  const url = new URL(c.req.url)
  const request = new Request(url.toString(), {
    method: c.req.method,
    headers: c.req.header(),
    body: ["GET", "HEAD"].includes(c.req.method)
      ? undefined
      : await c.req.text(),
  })

  const response = await (yoga as any).handleRequest(request)

  const responseHeaders: Record<string, string> = {}
  response.headers.forEach((value: string, key: string) => {
    responseHeaders[key] = value
  })

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
})

console.log(`Server starting on http://localhost:${PORT}`)
console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`)
console.log(`Stripe webhook: http://localhost:${PORT}/webhook`)

serve({
  fetch: app.fetch,
  port: Number(PORT),
})

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, disconnecting Prisma...")
  await prisma.$disconnect()
  process.exit(0)
})
