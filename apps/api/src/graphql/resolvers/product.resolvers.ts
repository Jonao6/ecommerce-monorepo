import { prisma } from "../../lib/index.js";

export const productResolvers = {
  Query: {
    products: async (_, { limit, offset }: { limit: number; offset: number }) => {
      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          skip: offset,
          take: limit,
          include: { category: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.count(),
      ])
      const currentPage = Math.floor(offset / limit) + 1;
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = (offset + limit) < totalCount;
      const hasPreviousPage = offset > 0;
      
      return { 
        products,
        totalCount,
        hasNextPage,
        totalPages,
        hasPreviousPage,
        currentPage
      }
    },
    product: (_, { id }) =>
      prisma.product.findUnique({ where: { id: id } }),
    productsByCategory: (_, { categoryId }) =>
      prisma.product.findMany({ where: { categoryId: parseInt(categoryId) } }),
  },
  Mutation: {
    createProduct: (_, { input }) =>
      prisma.product.create({
        data: {
          name: input.name,
          price: input.price,
          description: input.description,
          categoryId: parseInt(input.categoryId),
        },
      }),
    updateProduct: (_, { id, input }) =>
      prisma.product.update({
        where: { id: id },
        data: input,
      }),
  },
  Product: {
    category: (parent) =>
      prisma.category.findUnique({ where: { id: parent.categoryId } }),
  },
};
