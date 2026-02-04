import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@as-integrations/express5"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import jwt from "jsonwebtoken"
import Stripe from "stripe"
import { resolvers } from "../graphql/resolvers/index.js"
import { typeDefs } from "../graphql/schema/index.js"
import { prisma } from "../lib/index.js"
import { getRedisClient } from "../redis/client.js"
import type { Context } from "./context.js"
import { context } from "./context.js"
import {
  applyRateLimit,
  RATE_LIMITS,
  RateLimitUtils,
} from "../utils/rateLimit.js"

const app = express()
const PORT = process.env.PORT || 4000
let _stripe: Stripe | null = null

const getStripe = (): Stripe => {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      typescript: true,
    })
  }
  return _stripe
}
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"]
    let event: Stripe.Event
    try {
      event = getStripe().webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET_LOCAL!,
      )
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`)
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
        console.error(
          `Erro ao atualizar o pedido ${orderId} no banco:`,
          dbError,
        )
      }
    }

    res.json({ received: true })
  },
)

async function startServer() {
  const apolloServer = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  })

  await apolloServer.start()
  app.use(cookieParser())
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:4000"]
      : []),
  ].filter(Boolean)

  app.use(
    cors<cors.CorsRequest>({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true)

        if (allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error("Not allowed by CORS"), false)
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: [
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
      ],
    }),
  )
  app.get("/me", async (req, res) => {
    try {
      const rateLimitInfo = await applyRateLimit({ req, res }, "AUTH")

      res.set({
        "X-RateLimit-Limit": rateLimitInfo.limit.toString(),
        "X-RateLimit-Remaining": rateLimitInfo.remaining.toString(),
        "X-RateLimit-Reset": Math.ceil(
          rateLimitInfo.resetTime / 1000,
        ).toString(),
      })
    } catch (error: any) {
      if (error?.message?.includes("Rate limit exceeded")) {
        return res.status(429).json({
          error: error.message || "Rate limit exceeded",
          retryAfter:
            typeof error?.info?.retryAfter === "number"
              ? error.info.retryAfter
              : typeof error?.extensions?.rateLimitInfo?.retryAfter === "number"
                ? error.extensions.rateLimitInfo.retryAfter
                : 0,
        })
      }
    }

    const { accessToken, refreshToken } = req.cookies

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

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
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
      if (!user) return res.status(401).send({ ok: false })
      return res.send({ ok: true, user: sanitizeUser(user) })
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!)
      return res.send({ ok: true, user: decoded })
    } catch (err) {
      const user = await generateNewAccessToken()
      if (!user) return res.status(401).send({ ok: false })
      return res.send({ ok: true, user: sanitizeUser(user) })
    }
  })

  app.use(
    "/graphql",
    express.json(),
    async (req, res, next) => {
      try {
        const rateLimitInfo = await applyRateLimit({ req, res }, "GENERAL")

        res.set({
          "X-RateLimit-Limit": rateLimitInfo.limit.toString(),
          "X-RateLimit-Remaining": rateLimitInfo.remaining.toString(),
          "X-RateLimit-Reset": Math.ceil(
            rateLimitInfo.resetTime / 1000,
          ).toString(),
        })

        next()
      } catch (error: any) {
        if (error?.message?.includes("Rate limit exceeded")) {
          return res.status(429).json({
            error: error.message,
            retryAfter:
              error.info?.retryAfter ||
              error.extensions?.rateLimitInfo?.retryAfter,
            rateLimitInfo: error.info || error.extensions?.rateLimitInfo,
          })
        } else {
          res.status(429).json({ error: "Rate limit exceeded" })
        }
      }
    },
    expressMiddleware(apolloServer, {
      context: async ({ req, res }: { req: any; res: any }) => {
        const ctx = await context({ req, res })
        return {
          ...ctx,
          applyRateLimit: (type: keyof typeof RATE_LIMITS = "GENERAL") =>
            applyRateLimit(ctx, type),
          RateLimitUtils: {
            getMetrics: () => RateLimitUtils.getAllMetrics(),
            clearRateLimit: (identifier: string) =>
              RateLimitUtils.clearRateLimit(identifier),
            getRateLimitInfo: (identifier: string, windowMs: number) =>
              RateLimitUtils.getRateLimitInfo(identifier, windowMs),
          },
        }
      },
    }),
  )

  app.use((req, res, next) => {
    const timestamp = new Date().toISOString()
    const ip = req.ip || req.socket.remoteAddress || "unknown"
    const userAgent = req.get("User-Agent") || "unknown"

    console.log(
      `${timestamp} - ${req.method} ${req.path} - IP: ${ip} - User-Agent: ${userAgent}`,
    )

    if (
      req.path.includes("..") ||
      req.path.includes("<script>") ||
      req.path.includes("SELECT")
    ) {
      console.warn(
        `SUSPICIOUS REQUEST DETECTED: ${timestamp} - ${req.method} ${req.path} - IP: ${ip} - User-Agent: ${userAgent}`,
      )
    }

    next()
  })

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
  })

  app.get("/admin/rate-limit-metrics", async (req, res) => {
    const adminKey = req.headers["x-admin-key"]
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    try {
      const metrics = RateLimitUtils.getAllMetrics()
      res.json({
        metrics,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" })
    }
  })

  app.post("/admin/clear-rate-limit", express.json(), async (req, res) => {
    const adminKey = req.headers["x-admin-key"]
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const { identifier } = req.body
    if (!identifier) {
      return res.status(400).json({ error: "Identifier is required" })
    }

    try {
      await RateLimitUtils.clearRateLimit(identifier)
      res.json({ message: `Rate limit cleared for ${identifier}` })
    } catch (error) {
      res.status(500).json({ error: "Failed to clear rate limit" })
    }
  })

  app.listen(PORT, () => {
    console.log(`running in http://localhost:${PORT}/graphql`)
    console.log(`stripe webhook running in http://localhost:${PORT}/webhook`)
  })
}

startServer()
  .catch((e) => {
    console.error("error init:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
