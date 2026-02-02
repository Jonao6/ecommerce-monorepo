import { prisma } from "../../lib/index.js"
import Stripe from "stripe"
import { Resolvers } from "../types.js"
import { GraphQLError } from "graphql"
import { gerenateIdempotencyKey, requireAuth, validateOwnership } from "../../utils/auth.js"
import { validateId, validatePrice } from "../../utils/validation.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const paymentResolvers: Resolvers = {
  Mutation: {
    createPaymentIntent: async (_, { input }, context) => {
      const user = requireAuth(context);
      
      if (context.applyRateLimit) {
        await context.applyRateLimit('PAYMENT');
      }
      
      const { orderId } = input
      
      const validOrderId = validateId(orderId, "orderId");
      
      const order = await context.prisma.order.findUnique({
        where: { id: Number(validOrderId) },
      })

      if (!order) {
        throw new GraphQLError("Order not found", {
          extensions: { code: "ORDER_NOT_FOUND" }
        });
      }

      validateOwnership(context, order.userId);
      const idempotencyKey = gerenateIdempotencyKey(order.id)
      const amountInCents = Math.round(Number(order.totalAmount) * 100)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "brl",
        automatic_payment_methods: { enabled: true },
        metadata: { orderId: orderId.toString() },
      },
      {
        idempotencyKey: idempotencyKey,
      }
    )
      if (!paymentIntent.client_secret) {
        throw new GraphQLError("Failed to create payment intent", {
          extensions: { code: "PAYMENT_INTENT_FAILED" }
        });
      }
      return {
        clientSecret: paymentIntent.client_secret,
      }
    },
  },
  Payment: {
    order: (parent) => {
      return prisma.order.findUniqueOrThrow({ where: { id: parent.orderId } })
    },
  },
}
