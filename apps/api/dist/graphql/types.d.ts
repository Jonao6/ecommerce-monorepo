import { Address, Category, Delivery, Order, OrderItem, Payment, Product, User } from "../lib/index.js";
export interface GQLCategory extends Category {
    products: Product[];
}
export interface GQLProduct extends Product {
    category: Category;
}
export interface GQLUser extends User {
    addresses: Address[];
    orders: Order[];
}
export interface GQLAddress extends Address {
    user: User;
}
export interface GQLOrder extends Order {
    user: User;
    address: Address;
    items: GQLOrderItem[];
    payment?: Payment | null;
    delivery?: Delivery | null;
}
export interface GQLOrderItem extends OrderItem {
    product: Product;
}
export interface GQLPayment extends Payment {
    order: Order;
}
export interface GQLDelivery extends Delivery {
    order: Order;
}
export interface CreateProductInput {
    name: string;
    price: number;
    description?: string;
    categoryId: string;
}
export interface CreateOrderItemInput {
    productId: string;
    quantity: number;
}
export interface CreateOrderInput {
    userId: string;
    addressId: string;
    items: CreateOrderItemInput[];
}
export declare enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum DeliveryStatus {
    PREPARING = "PREPARING",
    SHIPPED = "SHIPPED",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    RETURNED = "RETURNED"
}
//# sourceMappingURL=types.d.ts.map