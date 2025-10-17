import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@as-integrations/express5"
import cors from "cors"
import express from "express"
import Stripe from "stripe"
import { prisma } from "../lib/index.js"
import { resolvers } from "../graphql/resolvers/index.js"
import { typeDefs } from "../graphql/schema/index.js"
import { context } from "./context.js"
import { getRedisClient } from "@/redis/client.js"
import jwt from "jsonwebtoken"

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
          sig,
          process.env.STRIPE_WEBHOOK_SECRET_LOCAL
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
            dbError
          )
        }
      }

      res.json({ received: true })
    }
  )
  
async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  })

  await apolloServer.start()
  app.use(cors<cors.CorsRequest>({
    origin: "http://localhost:3000",
    credentials: true
  }))

  app.post("/refresh", async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.status(401).send({ ok: false })

    const redis = await getRedisClient()
    const userId = redis.get(`refresh_${refreshToken}`)

    if (!userId || typeof userId !== "string") {
      return res.status(401).send({ ok: false })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    )

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    return res.send({ ok: true })
  })

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apolloServer, {
      context,
    })
  )

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
  })

  app.listen(PORT, () => {
    console.log(`running in http://localhost:${PORT}/graphql`)
    console.log(
      `stripe webhook running in http://localhost:${PORT}/webhook`
    )
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
