import { prisma } from "../../lib/index.js"
import { Resolvers } from "../types.js"
import { GraphQLError } from "graphql"
import { requireAdmin } from "../../utils/auth.js"

export const categoryResolvers: Resolvers = {
  Query: {
    categories: () => prisma.category.findMany(),
    category: (_: unknown, { name }) =>
      prisma.category.findUnique({ where: { name } }),
  },
  Mutation: {
    createCategory: async (_: unknown, { name }, context) => {
      requireAdmin(context);
      return prisma.category.create({ data: { name } });
    },
    updateCategory: async (_: unknown, { id, name }, context) => {
      requireAdmin(context);
      
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!category) {
        throw new GraphQLError("Category not found", {
          extensions: { code: "CATEGORY_NOT_FOUND" }
        });
      }
      
      return prisma.category.update({
        where: { id: parseInt(id) },
        data: { name }
      });
    },
    deleteCategory: async (_: unknown, { id }, context) => {
      requireAdmin(context);
      
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!category) {
        throw new GraphQLError("Category not found", {
          extensions: { code: "CATEGORY_NOT_FOUND" }
        });
      }
      
      const productsCount = await prisma.product.count({
        where: { categoryId: parseInt(id) }
      });
      
      if (productsCount > 0) {
        throw new GraphQLError("Cannot delete category with existing products", {
          extensions: { code: "CATEGORY_HAS_PRODUCTS" }
        });
      }
      
      await prisma.category.delete({
        where: { id: parseInt(id) }
      });
      
      return true;
    },
  },
  Category: {
    products: (parent) =>
      prisma.product.findMany({ where: { categoryId: parent.id } }),
  },
}
