import { prisma } from "../../lib/index.js";
export const orderResolvers = {
    Query: {
        orders: () => prisma.order.findMany(),
        order: (_, { id }) => prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: { items: true },
        }),
        userOrders: (_, { userId }) => prisma.order.findMany({
            where: { userId: parseInt(userId) },
            include: { items: true },
        }),
    },
    Mutation: {
        createOrder: async (_, { input }) => {
            const { userId, addressId, items } = input;
            const productPrices = await Promise.all(items.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                });
                return Number(product.price) * item.quantity;
            }));
            const totalAmount = productPrices.reduce((sum, price) => sum + price, 0);
            const order = await prisma.order.create({
                data: {
                    userId: parseInt(userId),
                    addressId: parseInt(addressId),
                    totalAmount,
                    status: "pending",
                },
            });
            await Promise.all(items.map((item) => prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                },
            })));
            return prisma.order.findUnique({
                where: { id: order.id },
                include: { items: true },
            });
        },
        updateOrderStatus: (_, { id, status }) => prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
        }),
    },
    Order: {
        user: (parent) => prisma.user.findUnique({ where: { id: parent.userId } }),
        address: (parent) => prisma.address.findUnique({ where: { id: parent.addressId } }),
        items: (parent) => prisma.orderItem.findMany({ where: { orderId: parent.id } }),
        payment: (parent) => prisma.payment.findUnique({ where: { orderId: parent.id } }),
        delivery: (parent) => prisma.delivery.findUnique({ where: { orderId: parent.id } }),
    },
    OrderItem: {
        product: (parent) => prisma.product.findUnique({ where: { id: parent.productId } }),
    },
};
//# sourceMappingURL=order.resolvers.js.map