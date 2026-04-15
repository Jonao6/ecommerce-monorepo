import type { PrismaClient, Order } from '../../../prisma/generated/client/client.js';
import type { IOrderRepository, CreateOrderInput } from '../../interfaces/index.js';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, user: true },
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
    });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: { user: true, items: true, address: true },
    });
  }

  async create(data: CreateOrderInput): Promise<Order> {
    const orderData: any = {
      userId: data.userId,
      totalAmount: data.totalAmount,
    };

    if (data.addressId) {
      orderData.addressId = data.addressId;
    }

    return this.prisma.order.create({
      data: orderData,
    });
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async updateAddress(id: number, addressId: number): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { address: { connect: { id: addressId } } },
    });
  }

  async addItems(orderId: number, items: { productId: string; quantity: number; price: number }[]): Promise<void> {
    await this.prisma.orderItem.createMany({
      data: items.map((item) => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
}
