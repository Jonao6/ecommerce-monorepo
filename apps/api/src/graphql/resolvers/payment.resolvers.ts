import { prisma } from "../../lib/index.js"
import { Resolvers } from "../types.js"
import { GraphQLError } from "graphql"
import { requireAuth, validateOwnership } from "../../utils/auth.js"
import { validateId } from "../../utils/validation.js"
import { PaymentService } from "../../services/payment.service.js"
import { PrismaOrderRepository } from "../../lib/repositories/prisma-order.repository.js"
import { PrismaPaymentRepository } from "../../lib/repositories/prisma-payment.repository.js"

const orderRepository = new PrismaOrderRepository(prisma)
const paymentRepository = new PrismaPaymentRepository(prisma)
const paymentService = new PaymentService(orderRepository, paymentRepository)

export const paymentResolvers: Resolvers = {
  Mutation: {
    createPaymentIntent: async (_, { input }, context) => {
      requireAuth(context);
      
      if (context.applyRateLimit) {
        await context.applyRateLimit('PAYMENT');
      }
      
      const { orderId } = input
      
      const validOrderId = validateId(orderId, "orderId");
      
      const order = await orderRepository.findById(Number(validOrderId))

      if (!order) {
        throw new GraphQLError("Order not found", {
          extensions: { code: "ORDER_NOT_FOUND" }
        });
      }

      validateOwnership(context, order.userId);
      
      return paymentService.createPaymentIntent(order.id)
    },
  },
  Payment: {
    order: async (parent) => {
      const result = await prisma.order.findUnique({ where: { id: parent.orderId } })
      return result as any
    },
  },
}
