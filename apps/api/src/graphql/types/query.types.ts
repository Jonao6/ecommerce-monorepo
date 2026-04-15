export const QueryTypes = `
  type Query {
    me: User
    user(email: String!): User
    adminUsers: [User!]!
    
    products(limit: Int!, offset: Int!): ProductsResponse!
    product(id: ID!): Product
    productsByCategory(categoryId: ID!): [Product!]!
    productsBySearch(term: String!): [Product!]!
    
    categories: [Category!]!
    category(name: String!): Category
    
    order(id: ID!): Order
    userOrders: [Order!]!
    adminOrders: [Order!]!
    
    address(id: ID!): Address
    userAddresses: [Address!]!
    adminAddresses: [Address!]!
  }
`;

export const QueryResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      const { requireAuth } = await import('../../utils/auth.js');
      return requireAuth(context);
    },
  }
};
