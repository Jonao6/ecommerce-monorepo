import { GraphQLError } from 'graphql';
import Stripe from 'stripe';
import type { IOrderRepository, IPaymentRepository } from '../interfaces/index.js';

export class PaymentService {
  private stripe: Stripe;

  constructor(
    private orderRepository: IOrderRepository,
    private paymentRepository: IPaymentRepository
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil' as any,
    });
  }

  async createPaymentIntent(orderId: number): Promise<{ clientSecret: string }> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new GraphQLError('Order not found', {
        extensions: { code: 'ORDER_NOT_FOUND' },
      });
    }

    const amountInCents = Math.round(Number(order.totalAmount) * 100);

    const idempotencyKey = this.generateIdempotencyKey(orderId);

    const paymentIntent = await this.stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: 'brl',
        automatic_payment_methods: { enabled: true },
        metadata: { orderId: orderId.toString() },
      },
      {
        idempotencyKey,
      }
    );

    if (!paymentIntent.client_secret) {
      throw new GraphQLError('Failed to create payment intent', {
        extensions: { code: 'PAYMENT_INTENT_FAILED' },
      });
    }

    return { clientSecret: paymentIntent.client_secret };
  }

  async processPayment(orderId: string, paymentMethod: string): Promise<void> {
    const order = await this.orderRepository.findById(parseInt(orderId));

    if (!order) {
      throw new GraphQLError('Order not found', {
        extensions: { code: 'ORDER_NOT_FOUND' },
      });
    }

    await this.paymentRepository.updateStatus(order.id, 'paid', new Date().toISOString());
  }

  private generateIdempotencyKey(orderId: number): string {
    const uuid = crypto.randomUUID();
    return `order_${orderId}_${uuid}`;
  }
}
