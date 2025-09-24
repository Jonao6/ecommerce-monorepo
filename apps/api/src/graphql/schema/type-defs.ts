import { DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const allTypeDefs: DocumentNode = gql`
  scalar DateTime
  scalar Decimal

  type Category {
    id: ID!
    name: String!
    createdAt: String!
    products: [Product!]!
  }

  type Product {
    id: ID!
    name: String!
    price: Decimal!
    description: String
    url: String
    image: String
    colors: [String!]
    sizes: [Int!]
    category: Category!
    createdAt: DateTime!
  }

  type User {
    id: ID!
    email: String!
    createdAt: String!
    addresses: [Address!]!
    orders: [Order!]!
  }

  type Address {
    id: ID!
    user: User!
    street: String!
    city: String!
    state: String!
    postalCode: String!
    country: String!
    createdAt: String!
  }

  type OrderItem {
    id: ID!
    product: Product!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    user: User!
    address: Address!
    items: [OrderItem!]!
    totalAmount: Float!
    status: OrderStatus!
    createdAt: String!
    payment: Payment
    delivery: Delivery
  }

  type Payment {
    id: ID!
    order: Order!
    paymentMethod: String!
    amount: Float!
    status: PaymentStatus!
    paidAt: String
  }

  type Delivery {
    id: ID!
    order: Order!
    status: DeliveryStatus!
    trackingNumber: String
    deliveredAt: String
  }

  type PaymentIntentResponse {
    clientSecret: String!
  }

  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
  }

  enum DeliveryStatus {
    PREPARING
    SHIPPED
    IN_TRANSIT
    DELIVERED
    RETURNED
  }

  input CreateProductInput {
    name: String!
    price: Int!
    description: String
    categoryId: ID!
    url: String
    image: String
    colors: [String!]
    sizes: [Int!]
  }

  input CreateOrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input CreateOrderInput {
    userId: ID!
    addressId: ID!
    items: [CreateOrderItemInput!]!
  }

  input CreatePaymentIntentInput {
    orderId: ID!
  }
  type Query {
    # Categories
    categories: [Category!]!
    category(id: ID!): Category

    # Products
    products(limit: Int, offset: Int): [Product!]!
    product(id: ID!): Product
    productsByCategory(categoryId: ID!): [Product!]!

    # Users
    users: [User!]!
    user(id: ID!): User

    # Orders
    orders: [Order!]!
    order(id: ID!): Order
    userOrders(userId: ID!): [Order!]!
  }

  type Mutation {
    # Categories
    createCategory(name: String!): Category!

    # Products
    createProduct(input: CreateProductInput!): Product
    updateProduct(id: ID!, input: CreateProductInput!): Product!

    # Users
    createUser(email: String!, password: String!): User!

    # Orders
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!

    createPaymentIntent(
      input: CreatePaymentIntentInput!
    ): PaymentIntentResponse!
  }
`;
