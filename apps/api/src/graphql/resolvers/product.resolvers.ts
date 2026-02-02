import { GraphQLError } from "graphql"
import { prisma } from "../../lib/index.js"
import { Resolvers } from "../types.js"
import { removeNulls } from "@/utils/cleanInput.js"
import { requireAdmin } from "../../utils/auth.js"
import {
  validateStringLength,
  validatePrice,
  validateColor,
  validateSize,
  sanitizeHtml,
  validateId,
} from "../../utils/validation.js"
export const productResolvers: Resolvers = {
  Query: {
    products: async (_, { limit, offset }) => {
      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          skip: offset,
          take: limit,
          include: { category: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.count(),
      ])
      const currentPage = Math.floor(offset / limit) + 1
      const totalPages = Math.ceil(totalCount / limit)
      const hasNextPage = offset + limit < totalCount
      const hasPreviousPage = offset > 0

      return {
        products,
        totalCount,
        hasNextPage,
        totalPages,
        hasPreviousPage,
        currentPage,
      }
    },
    product: (_, { id }) => prisma.product.findUnique({ where: { id: id } }),
    productsByCategory: (_, { categoryId }) =>
      prisma.product.findMany({ where: { categoryId: parseInt(categoryId) } }),
    productsBySearch: async (_, { term }) =>
      await prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                search: term,
              },
            },
            {
              description: {
                search: term,
              },
            },
          ],
        },
      }),
  },

  Mutation: {
    createProduct: async (_, { input }, context) => {
      requireAdmin(context)

      const sanitizedName = sanitizeHtml(input.name)
      const validName = validateStringLength(sanitizedName, 1, 200, "name")

      const validPrice = validatePrice(input.price)

      let validDescription: string | undefined
      if (input.description) {
        const sanitizedDescription = sanitizeHtml(input.description)
        validDescription = validateStringLength(
          sanitizedDescription,
          0,
          2000,
          "description",
        )
      }

      const validCategoryId = validateId(input.categoryId, "categoryId")

      const category = await prisma.category.findUnique({
        where: { id: validCategoryId },
      })

      if (!category) {
        throw new GraphQLError("Category not found", {
          extensions: { code: "CATEGORY_NOT_FOUND" },
        })
      }

      if (input.colors) {
        input.colors.forEach((color: string, index: number) => {
          if (!validateColor(color)) {
            throw new GraphQLError(
              `Invalid color at index ${index}: ${color}`,
              {
                extensions: { code: "INVALID_COLOR" },
              },
            )
          }
        })
      }

      if (input.sizes) {
        input.sizes.forEach((size: number, index: number) => {
          validateSize(size)
        })
      }

      return prisma.product.create({
        data: {
          name: validName,
          price: validPrice,
          description: validDescription || null,
          categoryId: validCategoryId,
          colors: input.colors || [],
          sizes: input.sizes || [],
        },
      })
    },
    updateProduct: async (_, { id, input }, context) => {
      requireAdmin(context)

      if (!input.categoryId)
        throw new GraphQLError("MISS_FIELD: CategoryId is required", {
          extensions: { code: "MISSING_CATEGORY" },
        })

      const category = await prisma.category.findUnique({
        where: { id: parseInt(input.categoryId) },
      })

      if (!category) {
        throw new GraphQLError("Category not found", {
          extensions: { code: "CATEGORY_NOT_FOUND" },
        })
      }

      const product = await prisma.product.findUnique({
        where: { id },
      })

      if (!product) {
        throw new GraphQLError("Product not found", {
          extensions: { code: "PRODUCT_NOT_FOUND" },
        })
      }

      const { categoryId, ...rest } = input
      const dataCleaned = removeNulls(rest)

      return prisma.product.update({
        where: { id },
        data: { ...dataCleaned, categoryId: parseInt(categoryId as string) },
      })
    },
    deleteProduct: async (_, { id }, context) => {
      requireAdmin(context)

      const product = await prisma.product.findUnique({
        where: { id },
      })

      if (!product) {
        throw new GraphQLError("Product not found", {
          extensions: { code: "PRODUCT_NOT_FOUND" },
        })
      }

      await prisma.product.delete({
        where: { id },
      })

      return true
    },
  },
  Product: {
    category: (parent) =>
      prisma.category.findUniqueOrThrow({ where: { id: parent.categoryId } }),
  },
}
