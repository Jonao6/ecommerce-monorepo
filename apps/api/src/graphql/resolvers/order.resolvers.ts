import { prisma } from "../../lib/index.js"

export const orderResolvers = {
  Query: {
    orders: () => prisma.order.findMany(),
    order: (_, { id }) =>
      prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: { items: true },
      }),
    userOrders: (_, { userId }: { userId: string }) =>
      prisma.order.findMany({
        where: { userId: userId },
        include: { items: true },
      }),
  },
  Mutation: {
    createOrder: async (_, { input }) => {
      const { userId, addressId, items } = input

      const productIds = items.map((item) => item.productId)
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true },
      })

      const totalAmount = products.reduce((sum, product) => {
        const quantity =
          items.find((i) => i.productId === product.id)?.quantity || 0
        return sum + Number(product.price) * quantity
      }, 0)

      const order = await prisma.order.create({
        data: {
          ...(addressId && { address: { connect: { id: addressId } } }),
          totalAmount,
          user: {
            connect: { id: userId },
          },
        },
      })
      await Promise.all(
        items.map(async (item) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product)
            throw new Error(`Produto ${item.productId} não encontrado`)

          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            },
          })
        })
      )
      await prisma.payment.create({
      data: {
        orderId: order.id,
        paymentMethod: "card",
        paymentStatus: "pending",
        amount: totalAmount,
    },
  });
      return prisma.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      })
    },
    updateOrderStatus: (_, { id, status }) =>
      prisma.order.update({
        where: { id: parseInt(id) },
        data: { status },
      }),
    updateOrderAddress: (_, { id, addressId }) =>
      prisma.order.update({
        where: { id: parseInt(id) },
        data: { addressId },
      }),
  },
  Order: {
    user: (parent) => prisma.user.findUnique({ where: { id: parent.userId } }),
    address: (parent) =>
      prisma.address.findUnique({ where: { id: parent.addressId } }),
    items: (parent) =>
      prisma.orderItem.findMany({ where: { orderId: parent.id } }),
    payment: (parent) =>
      prisma.payment.findUnique({ where: { orderId: parent.id } }),
    delivery: (parent) =>
      prisma.delivery.findUnique({ where: { orderId: parent.id } }),
  },
  OrderItem: {
    product: (parent) =>
      prisma.product.findUnique({ where: { id: parent.productId } }),
  },
}
