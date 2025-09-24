import { prisma } from "../../lib/index.js";

export const categoryResolvers = {
  Query: {
    categories: () => prisma.category.findMany(),
    category: (_: unknown, { id }) =>
      prisma.category.findUnique({ where: { id: parseInt(id) } }),
  },
  Mutation: {
    createCategory: (_: unknown, { name }) =>
      prisma.category.create({ data: { name } }),
  },
  Category: {
    products: (parent) =>
      prisma.product.findMany({ where: { categoryId: parent.id } }),
  },
};
