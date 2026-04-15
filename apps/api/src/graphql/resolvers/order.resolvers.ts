import { GraphQLError } from 'graphql';
import { prisma } from '../../lib/index.js';
import { Resolvers } from '../types.js';
import { requireAuth, requireAdmin, validateOwnership } from '../../utils/auth.js';
import { validateId, validateQuantity, validatePrice, validateObjectId, validateColor, validateSize } from '../../utils/validation.js';
import { OrderService } from '../../services/order.service.js';
import { PrismaOrderRepository } from '../../lib/repositories/prisma-order.repository.js';
import { PrismaPaymentRepository } from '../../lib/repositories/prisma-payment.repository.js';
import { Loaders } from '../../lib/loaders.js';

const orderRepository = new PrismaOrderRepository(prisma);
const paymentRepository = new PrismaPaymentRepository(prisma);
const orderService = new OrderService(prisma, orderRepository, {} as any, paymentRepository);

export const orderResolvers: Resolvers = {
  Query: {
    adminOrders: async (_, __, context) => {
      requireAdmin(context);
      return context.prisma.order.findMany({
        include: {
          user: true,
          items: { include: { product: true } },
          address: true,
          payment: true,
          delivery: true,
        },
      }) as any;
    },
    order: async (_, { id }, context) => {
      const user = requireAuth(context);
      const order = await context.prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: true,
          items: { include: { product: true } },
          address: true,
          payment: true,
          delivery: true,
        },
      });
      
      if (!order) {
        throw new GraphQLError('Order not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      validateOwnership(context, order.userId);
      
      return order as any;
    },
    userOrders: async (_, __, context) => {
      const user = requireAuth(context);
      validateOwnership(context, user.id);
      
      return context.prisma.order.findMany({
        where: { userId: user.id },
        include: {
          user: true,
          items: { include: { product: true } },
          address: true,
          payment: true,
          delivery: true,
        },
      }) as any;
    },
  },
  Mutation: {
    createOrder: async (_, { input }, context) => {
      const user = requireAuth(context);
      const { addressId, items } = input;

      validateOwnership(context, user.id);

      if (!items || items.length === 0) {
        throw new GraphQLError('Order must contain at least one item', {
          extensions: { code: 'EMPTY_ORDER' },
        });
      }

      if (items.length > 50) {
        throw new GraphQLError('Order cannot contain more than 50 items', {
          extensions: { code: 'ORDER_TOO_LARGE' },
        });
      }

      items.forEach((item: any, index: number) => {
        if (!validateObjectId(item.productId)) {
          throw new GraphQLError(`Invalid product ID at index ${index}`, {
            extensions: { code: 'INVALID_PRODUCT_ID' },
          });
        }
        
        validateQuantity(item.quantity);
        
        if (item.color && !validateColor(item.color)) {
          throw new GraphQLError(`Invalid color at index ${index}: ${item.color}`, {
            extensions: { code: 'INVALID_COLOR' },
          });
        }
        
        if (item.size) {
          validateSize(item.size);
        }
      });

      if (addressId) {
        const validAddressId = validateId(addressId, 'addressId');
        const address = await prisma.address.findUnique({
          where: { id: validAddressId },
        });
        
        if (!address) {
          throw new GraphQLError('Address not found', {
            extensions: { code: 'ADDRESS_NOT_FOUND' },
          });
        }
        
        validateOwnership(context, address.userId);
      }

      const result = await orderService.createOrder(user.id, {
        addressId: addressId ?? undefined,
        items: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
      });

      return context.prisma.order.findUnique({
        where: { id: result.id },
        include: {
          user: true,
          items: { include: { product: true } },
          address: true,
          payment: true,
          delivery: true,
        },
      }) as any;
    },
    updateOrderStatus: async (_, { id, input }, context) => {
      requireAdmin(context);
      const result = await orderService.updateOrderStatus(parseInt(id), input.status!);
      return context.prisma.order.findUnique({
        where: { id: result.id },
        include: {
          user: true,
          items: { include: { product: true } },
          address: true,
          payment: true,
          delivery: true,
        },
      }) as any;
    },
    updateOrderAddress: async (_, { id, input }, context) => {
      const user = requireAuth(context);
      
      const order = await context.prisma.order.findUnique({
        where: { id: parseInt(id) },
      });
      
      if (!order) {
        throw new GraphQLError('Order not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      validateOwnership(context, order.userId);

      const address = await prisma.address.findUnique({
        where: { id: parseInt(input.addressId!) },
      });
      
      if (!address) {
        throw new GraphQLError('Address not found', {
          extensions: { code: 'ADDRESS_NOT_FOUND' },
        });
      }
      
      validateOwnership(context, address.userId);

      const result = await orderService.updateOrderAddress(parseInt(id), parseInt(input.addressId!));
      return context.prisma.order.findUnique({
        where: { id: result.id },
        include: {
          user: true,
          items: { include: { product: true } },
          address: true,
          payment: true,
          delivery: true,
        },
      }) as any;
    },
  },
  Order: {
    user: async (parent, _, context) => {
      if ((parent as any).user) return (parent as any).user;
      const loaders = Loaders.getInstance();
      return loaders.userLoader.load(parent.userId);
    },
    address: async (parent, _, context) => {
      if ((parent as any).address) return (parent as any).address;
      if (!parent.addressId) return null;
      const loaders = Loaders.getInstance();
      return loaders.addressLoader.load(parent.addressId);
    },
    items: async (parent, _, context) => {
      if ((parent as any).items) return (parent as any).items;
      return context.prisma.orderItem.findMany({ 
        where: { orderId: parent.id },
        include: { product: true },
      });
    },
    payment: async (parent, _, context) => {
      if ((parent as any).payment) return (parent as any).payment;
      return context.prisma.payment.findUnique({ where: { orderId: parent.id } });
    },
    delivery: async (parent, _, context) => {
      if ((parent as any).delivery) return (parent as any).delivery;
      return context.prisma.delivery.findUnique({ where: { orderId: parent.id } });
    },
  },
  OrderItem: {
    product: async (parent, _, context) => {
      if ((parent as any).product) return (parent as any).product;
      const loaders = Loaders.getInstance();
      return loaders.productLoader.load(parent.productId);
    },
  },
};
