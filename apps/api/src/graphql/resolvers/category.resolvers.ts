import { prisma } from "../../lib/index.js"

export const categoryResolvers = {
  Query: {
    categories: () => prisma.category.findMany(),
    category: (_: unknown, { name }) =>
      prisma.category.findUnique({ where: { name } }),
  },
  Mutation: {
    createCategory: (_: unknown, { name }) =>
      prisma.category.create({ data: { name } }),
  },
  Category: {
    products: (parent) =>
      prisma.product.findMany({ where: { categoryId: parent.id } }),
  },
}
