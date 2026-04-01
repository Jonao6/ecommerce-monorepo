import { GraphQLError } from 'graphql';
import { PrismaClient, Order } from '../../prisma/generated/client/client.js';
import type { IOrderRepository, IOrderItemRepository, IPaymentRepository } from '../interfaces/index.js';
import type { OrderItemInput, CreateOrderInput } from '../interfaces/repository.interface.js';

interface ProductBasic {
  id: string;
  price: number;
}

export class OrderService {
  constructor(
    private prisma: PrismaClient,
    private orderRepository: IOrderRepository,
    private orderItemRepository: IOrderItemRepository,
    private paymentRepository: IPaymentRepository
  ) {}

  async createOrder(userId: string, input: { addressId?: string; items: OrderItemInput[] }): Promise<Order> {
    this.validateOrderInput(input.items);

    const productIds = input.items.map((item) => item.productId);
    const products = await this.getProducts(productIds);

    this.validateProductsExist(productIds, products);

    const totalAmount = this.calculateTotal(products, input.items);

    const orderData: CreateOrderInput = {
      userId,
      addressId: input.addressId ? parseInt(input.addressId) : undefined,
      items: input.items,
      totalAmount,
    };

    const order = await this.orderRepository.create(orderData);

    const orderItems = input.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    await this.orderRepository.addItems(order.id, orderItems);

    await this.paymentRepository.create({
      orderId: order.id,
      paymentMethod: 'card',
      paymentStatus: 'pending',
      amount: totalAmount,
    });

    return this.orderRepository.findById(order.id) as Promise<Order>;
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    return this.orderRepository.updateStatus(orderId, status);
  }

  async updateOrderAddress(orderId: number, addressId: number): Promise<Order> {
    return this.orderRepository.updateAddress(orderId, addressId);
  }

  private validateOrderInput(items: OrderItemInput[]): void {
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

    items.forEach((item, index) => {
      if (!item.productId) {
        throw new GraphQLError(`Invalid product ID at index ${index}`, {
          extensions: { code: 'INVALID_PRODUCT_ID' },
        });
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new GraphQLError(`Invalid quantity at index ${index}`, {
          extensions: { code: 'INVALID_QUANTITY' },
        });
      }
    });
  }

  private async getProducts(productIds: string[]): Promise<ProductBasic[]> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });
    
    return products.map(p => ({
      id: p.id,
      price: Number(p.price)
    }));
  }

  private validateProductsExist(productIds: string[], products: ProductBasic[]): void {
    const foundIds = products.map((p) => p.id);
    const missingProducts = productIds.filter((id) => !foundIds.includes(id));

    if (missingProducts.length > 0) {
      throw new GraphQLError('One or more products not found', {
        extensions: { code: 'PRODUCTS_NOT_FOUND' },
      });
    }
  }

  private calculateTotal(products: ProductBasic[], items: OrderItemInput[]): number {
    return products.reduce((sum, product) => {
      const quantity = items.find((i) => i.productId === product.id)?.quantity || 0;
      return sum + product.price * quantity;
    }, 0);
  }
}
