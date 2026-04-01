export const MutationTypes = `
  type Mutation {
    # Auth
    getUser(input: LoginInput!): AuthPayload!
    createUser(input: CreateUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    logout: Boolean!
    
    # Products
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    
    # Orders
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, input: UpdateOrderInput!): Order!
    updateOrderAddress(id: ID!, input: UpdateOrderInput!): Order!
    
    # Payments
    createPaymentIntent(input: CreatePaymentIntentInput!): PaymentIntentResponse!
    processPayment(orderId: ID!, paymentMethod: String!): Payment!
    
    # Categories
    createCategory(name: String!): Category!
    deleteCategory(id: ID!): Boolean!
    
    # Addresses
    createAddress(input: CreateAddressInput!): Address!
    updateAddress(id: ID!, input: UpdateAddressInput!): Address!
    deleteAddress(id: ID!): Boolean!
  }
`;

export const MutationResolvers = {
  Mutation: {}
};
