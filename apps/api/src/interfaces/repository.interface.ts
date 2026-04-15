import type { User, Address, Order, OrderItem, Payment, Category, Product } from '../../prisma/generated/client/client.js';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserInput & { passwordHash: string }): Promise<User>;
  update(id: string, data: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<User>;
}

export interface CreateAddressInput {
  street: string;
  streetNumber: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  userId: string;
}

export interface IAddressRepository {
  findById(id: number): Promise<Address | null>;
  findByUserId(userId: string): Promise<Address[]>;
  create(data: CreateAddressInput): Promise<Address>;
  update(id: number, data: Partial<CreateAddressInput>): Promise<Address>;
  delete(id: number): Promise<Address>;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  color?: string;
  size?: number;
}

export interface CreateOrderInput {
  userId: string;
  addressId?: number;
  items: OrderItemInput[];
  totalAmount: number;
}

export interface IOrderRepository {
  findById(id: number): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  create(data: CreateOrderInput): Promise<Order>;
  updateStatus(id: number, status: string): Promise<Order>;
  updateAddress(id: number, addressId: number): Promise<Order>;
  addItems(orderId: number, items: { productId: string; quantity: number; price: number }[]): Promise<void>;
}

export interface IOrderItemRepository {
  findByOrderId(orderId: number): Promise<OrderItem[]>;
  create(data: { orderId: number; productId: string; quantity: number; price: number }): Promise<OrderItem>;
}

export interface CreatePaymentInput {
  orderId: number;
  paymentMethod: string;
  paymentStatus: string;
  amount: number;
}

export interface IPaymentRepository {
  findByOrderId(orderId: number): Promise<Payment | null>;
  create(data: CreatePaymentInput): Promise<Payment>;
  updateStatus(id: number, status: string, paidAt?: string): Promise<Payment>;
}

export interface ICategoryRepository {
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  create(name: string): Promise<Category>;
  delete(id: number): Promise<Category>;
}

export interface CreateProductInput {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  colors?: string[];
  sizes?: number[];
  image?: string;
  url?: string;
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(limit: number, offset: number): Promise<{ products: Product[]; total: number }>;
  findByCategoryId(categoryId: number): Promise<Product[]>;
  findBySearch(term: string): Promise<Product[]>;
  create(data: CreateProductInput): Promise<Product>;
  update(id: string, data: Partial<CreateProductInput>): Promise<Product>;
  delete(id: string): Promise<Product>;
}
