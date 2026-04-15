import type { PrismaClient, Payment } from '../../../prisma/generated/client/client.js';
import type { IPaymentRepository, CreatePaymentInput } from '../../interfaces/index.js';

export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaClient) {}

  async findByOrderId(orderId: number): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { orderId },
    });
  }

  async create(data: CreatePaymentInput): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus as any,
        amount: data.amount,
      },
    });
  }

  async updateStatus(id: number, status: string, paidAt?: string): Promise<Payment> {
    return this.prisma.payment.update({
      where: { orderId: id },
      data: {
        paymentStatus: status as any,
        ...(paidAt && { paidAt }),
      },
    });
  }
}
