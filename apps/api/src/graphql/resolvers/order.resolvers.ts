import { GraphQLError } from "graphql"
import { prisma } from "../../lib/index.js"
import { Resolvers } from "../types.js"
import { requireAuth, requireAdmin, validateOwnership } from "../../utils/auth.js"
import { 
  validateId, 
  validateQuantity, 
  validatePrice, 
  validateObjectId,
  validateColor,
  validateSize 
} from "../../utils/validation.js"

export const orderResolvers: Resolvers = {
  Query: {
    adminOrders: async (_, __, context) => {
      requireAdmin(context);
      return prisma.order.findMany({
        include: {
          user: true,
          items: true,
          address: true,
        },
      });
    },
    order: async (_, { id }, context) => {
      const user = requireAuth(context);
      const order = await context.prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: { items: true, user: true },
      });
      
      if (!order) {
        throw new GraphQLError("Order not found", {
          extensions: { code: "NOT_FOUND" }
        });
      }

      validateOwnership(context, order.userId);
      
      return order;
    },
    userOrders: async (_, __, context) => {
      const user = requireAuth(context);
      validateOwnership(context, user.id);
      
      return context.prisma.order.findMany({
        where: { userId: user.id },
        include: { items: true },
      });
    },
  },
  Mutation: {
    createOrder: async (_, { input }, context) => {
      const user = requireAuth(context);
      const { addressId, items } = input

      validateOwnership(context, user.id);

      if (!items || items.length === 0) {
        throw new GraphQLError("Order must contain at least one item", {
          extensions: { code: "EMPTY_ORDER" }
        });
      }

      if (items.length > 50) {
        throw new GraphQLError("Order cannot contain more than 50 items", {
          extensions: { code: "ORDER_TOO_LARGE" }
        });
      }

      items.forEach((item: any, index: number) => {
        if (!validateObjectId(item.productId)) {
          throw new GraphQLError(`Invalid product ID at index ${index}`, {
            extensions: { code: "INVALID_PRODUCT_ID" }
          });
        }
        
        validateQuantity(item.quantity);
        
        if (item.color && !validateColor(item.color)) {
          throw new GraphQLError(`Invalid color at index ${index}: ${item.color}`, {
            extensions: { code: "INVALID_COLOR" }
          });
        }
        
        if (item.size) {
          validateSize(item.size);
        }
      });

      const productIds = items.map((item) => item.productId)
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true },
      })

      const missingProducts = productIds.filter(id => !products.find(p => p.id === id))
      if (missingProducts.length > 0) {
        throw new GraphQLError("One or more products not found", {
          extensions: { code: "PRODUCTS_NOT_FOUND" }
        });
      }

      const totalAmount = products.reduce((sum, product) => {
        const quantity =
          items.find((i) => i.productId === product.id)?.quantity || 0
        return sum + Number(product.price) * quantity
      }, 0)

      validatePrice(totalAmount);

      if (addressId) {
        const validAddressId = validateId(addressId, "addressId");
        const address = await prisma.address.findUnique({
          where: { id: validAddressId }
        });
        
        if (!address) {
          throw new GraphQLError("Address not found", {
            extensions: { code: "ADDRESS_NOT_FOUND" }
          });
        }
        
        validateOwnership(context, address.userId);
      }

      const order = await prisma.order.create({
        data: {
          ...(addressId && {
            address: { connect: { id: parseInt(addressId) } },
          }),
          totalAmount,
          user: {
            connect: { id: user.id },
          },
        },
      })
      await Promise.all(
        items.map(async (item) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product)
            throw new GraphQLError("Product not found", {
              extensions: { code: "PRODUCT_NOT_FOUND" }
            });

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
      })
      return prisma.order.findUniqueOrThrow({
        where: { id: order.id },
        include: { items: true },
      })
    },
    updateOrderStatus: async (_, { id, input }, context) => {
      requireAdmin(context);
      return prisma.order.update({
        where: { id: parseInt(id) },
        data: { status: input.status! },
      });
    },
    updateOrderAddress: async (_, { id, input }, context) => {
      const user = requireAuth(context);
      
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!order) {
        throw new GraphQLError("Order not found", {
          extensions: { code: "NOT_FOUND" }
        });
      }

      validateOwnership(context, order.userId);

      const address = await prisma.address.findUnique({
        where: { id: parseInt(input.addressId!) }
      });
      
      if (!address) {
        throw new GraphQLError("Address not found", {
          extensions: { code: "ADDRESS_NOT_FOUND" }
        });
      }
      
      validateOwnership(context, address.userId);

      return prisma.order.update({
        where: { id: parseInt(id) },
        data: { address: { connect: { id: parseInt(input.addressId!) } } },
      });
    },
  },
  Order: {
    user: (parent) => {
      return prisma.user.findUniqueOrThrow({ where: { id: parent.userId } })
    },
    address: async (parent) => {
      if (!parent.addressId) {
        throw new GraphQLError(
          `Inconsistência: Pedido ${parent.id} sem addressId.`
        )
      }

      const address = await prisma.address.findUnique({
        where: { id: parent.addressId },
      })
      if (!address) {
        throw new GraphQLError(
          `Endereço não encontrado para o pedido ${parent.id}`
        )
      }
      return address
    },
    items: (parent) => {
      return prisma.orderItem.findMany({ where: { orderId: parent.id } })
    },
    payment: (parent) => {
      return prisma.payment.findUnique({ where: { orderId: parent.id } })
    },
    delivery: (parent) => {
      return prisma.delivery.findUnique({ where: { orderId: parent.id } })
    },
  },
  OrderItem: {
    product: (parent) => {
      return prisma.product.findUniqueOrThrow({
        where: { id: parent.productId },
      })
    },
  },
}
