import { prisma } from "../../lib/index.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const paymentResolvers = {
    Mutation: {
        createPaymentIntent: async (_, { orderId }, { prisma }) => {
            const order = await prisma.order.findUnique({
                where: { id: parseInt(orderId) },
            });
            if (!order) {
                throw new Error("Pedido não encontrado");
            }
            const amountInCents = Math.round(parseFloat(order.totalAmount) * 100);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: "brl",
                metadata: {
                    orderId: order.id.toString(),
                },
            });
            return {
                clientSecret: paymentIntent.client_secret,
            };
        },
    },
    Payment: {
        order: (parent) => prisma.order.findUnique({ where: { id: parent.orderId } }),
    },
};
//# sourceMappingURL=payment.resolvers.js.map