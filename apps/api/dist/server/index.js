import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";
import Stripe from "stripe";
import { prisma } from "../lib/index.js";
import { resolvers } from "../graphql/resolvers/index.js";
import { typeDefs } from "../graphql/schema/index.js";
const app = express();
const PORT = process.env.PORT || 4000;
let _stripe = null;
const getStripe = () => {
    if (!_stripe) {
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            typescript: true,
        });
    }
    return _stripe;
};
async function startServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    app.use(cors());
    app.post("/webhook/stripe", express.raw({ type: "application/json" }), async (req, res) => {
        const sig = req.headers["stripe-signature"];
        let event;
        try {
            event = getStripe().webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            const orderId = parseInt(paymentIntent.metadata.orderId);
            try {
                await prisma.$transaction([
                    prisma.order.update({
                        where: { id: orderId },
                        data: { status: "pending" },
                    }),
                    prisma.payment.update({
                        where: { orderId: orderId },
                        data: { paymentStatus: "paid", paidAt: new Date() },
                    }),
                ]);
                console.log(`Pedido ${orderId} atualizado`);
            }
            catch (dbError) {
                console.error(`Erro ao atualizar o pedido ${orderId} no banco:`, dbError);
            }
        }
        res.json({ received: true });
    });
    app.use("/graphql", express.json(), expressMiddleware(apolloServer, {
        context: async () => ({ prisma }),
    }));
    app.get("/health", (req, res) => {
        res.status(200).json({ status: "ok" });
    });
    app.listen(PORT, () => {
        console.log(`running in http://localhost:${PORT}/graphql`);
        console.log(`stripe webhook running in http://localhost:${PORT}/webhook/stripe`);
    });
}
startServer()
    .catch((e) => {
    console.error("error init:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=index.js.map