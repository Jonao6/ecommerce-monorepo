import { gql } from "graphql-tag"

export const allTypeDefs = gql`
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

  type ProductsResponse {
    products: [Product!]!
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    addresses: [Address!]!
    orders: [Order!]!
  }

  type AuthPayload {
    message: String!
    user: User!
  }

  type Address {
    id: ID!
    user: User!
    street: String!
    streetNumber: String!
    city: String!
    complements: String!
    neighbor: String!
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
    paymentStatus: PaymentStatus!
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
    pending
    processing
    shipped
    delivered
    cancelled
  }

  enum PaymentStatus {
    pending
    paid
    failed
  }

  enum DeliveryStatus {
    preparing
    shipped
    in_transit
    delivered
    returned
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

  input UpdateProductInput {
    name: String
    price: Int
    description: String
    categoryId: ID
    url: String
    image: String
    colors: [String!]
    sizes: [Int!]
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateAddressInput {
    userId: ID!
    street: String!
    streetNumber: String!
    city: String!
    complements: String!
    state: String!
    neighbor: String!
    postalCode: String!
    country: String!
  }

  input UpdateAddressInput {
    street: String
    city: String
    state: String
    postalCode: String
    country: String
  }

  input CreateOrderItemInput {
    productId: ID!
    color: String!
    size: Int!
    quantity: Int!
  }

  input CreateOrderInput {
    userId: ID!
    addressId: ID
    items: [CreateOrderItemInput!]!
    totalAmount: Decimal!
  }

  input UpdateOrderInput {
    status: OrderStatus
    addressId: ID
  }

  input CreatePaymentIntentInput {
    orderId: ID!
    amount: Int!
  }

  type Query {
    # Categories
    categories: [Category!]!
    category(name: String!): Category

    # Products
    products(limit: Int, offset: Int): ProductsResponse!
    product(id: ID!): Product
    productsByCategory(categoryId: ID!): [Product!]!

    # Users
    users: [User!]!
    user(email: String!): User
    me: User

    # Addresses
    addresses: [Address!]!
    address(id: ID!): Address
    userAddresses(userId: ID!): [Address!]!

    # Orders
    orders: [Order!]!
    order(id: ID!): Order
    userOrders(userId: ID!): [Order!]!
  }

  type Mutation {
    # Categories
    createCategory(name: String!): Category!
    updateCategory(id: ID!, name: String!): Category!
    deleteCategory(id: ID!): Boolean!

    # Products
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!

    # Users
    createUser(input: CreateUserInput!): User!
    getUser(input: LoginInput!): AuthPayload!
    logout: Boolean!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!

    # Addresses
    createAddress(input: CreateAddressInput!): Address!
    updateAddress(id: ID!, input: UpdateAddressInput!): Address!
    deleteAddress(id: ID!): Boolean!

    # Orders
    createOrder(input: CreateOrderInput!): Order!
    updateOrderAddress(id: ID!, input: UpdateOrderInput!): Order!
    updateOrderStatus(id: ID!, input: UpdateOrderInput!): Order!
    deleteOrder(id: ID!): Boolean!

    # Payments
    createPaymentIntent(input: CreatePaymentIntentInput!): PaymentIntentResponse!
    processPayment(orderId: ID!, paymentMethod: String!): Payment!
  }
`