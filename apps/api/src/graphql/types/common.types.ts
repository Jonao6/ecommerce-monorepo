export const CommonTypes = `
  scalar DateTime
  scalar Decimal
  
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
    street: String!
    streetNumber: String!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
    postalCode: String!
    country: String!
    user: User!
  }
  
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
    image: String
    url: String
    colors: [String!]
    sizes: [Int!]
    category: Category!
    categoryId: ID
    createdAt: DateTime!
  }
  
  type ProductsResponse {
    products: [Product!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }
  
  type Order {
    id: ID!
    status: OrderStatus!
    totalAmount: Float!
    createdAt: String!
    user: User!
    address: Address!
    items: [OrderItem!]!
    payment: Payment
    delivery: Delivery
  }
  
  type OrderItem {
    id: ID!
    quantity: Int!
    price: Float!
    product: Product!
  }
  
  type Payment {
    id: ID!
    amount: Float!
    paymentMethod: String!
    paymentStatus: PaymentStatus!
    paidAt: String
    order: Order!
  }
  
  type Delivery {
    id: ID!
    status: DeliveryStatus!
    trackingNumber: String
    deliveredAt: String
    order: Order!
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
`;

export const InputTypes = `
  input CreateUserInput {
    email: String!
    password: String!
    name: String!
  }
  
  input UpdateUserInput {
    email: String
    name: String
  }
  
  input LoginInput {
    email: String!
    password: String!
  }
  
  input CreateAddressInput {
    street: String!
    streetNumber: String!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
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
  
  input CreateProductInput {
    name: String!
    price: Int!
    description: String
    categoryId: ID!
    colors: [String!]
    sizes: [Int!]
    image: String
    url: String
  }
  
  input UpdateProductInput {
    name: String
    price: Int
    description: String
    categoryId: ID
    colors: [String!]
    sizes: [Int!]
    image: String
    url: String
  }
  
  input CreateOrderInput {
    addressId: ID
    items: [CreateOrderItemInput!]!
    totalAmount: Decimal!
  }
  
  input CreateOrderItemInput {
    productId: ID!
    quantity: Int!
    color: String
    size: Int
  }
  
  input UpdateOrderInput {
    status: OrderStatus
    addressId: ID
  }
  
  input CreatePaymentIntentInput {
    orderId: ID!
    amount: Int!
  }
`;
