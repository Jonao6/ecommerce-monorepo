import { prisma } from "../../lib/index.js";
export const productResolvers = {
    Query: {
        products: (_, { limit, offset }) => {
            return prisma.product.findMany({
                take: limit || undefined,
                skip: offset || 0,
                orderBy: { createdAt: "desc" },
            });
        },
        product: (_, { id }) => prisma.product.findUnique({ where: { id: id } }),
        productsByCategory: (_, { categoryId }) => prisma.product.findMany({ where: { categoryId: parseInt(categoryId) } }),
    },
    Mutation: {
        createProduct: (_, { input }) => prisma.product.create({
            data: {
                name: input.name,
                price: input.price,
                description: input.description,
                categoryId: parseInt(input.categoryId),
            },
        }),
        updateProduct: (_, { id, input }) => prisma.product.update({
            where: { id: id },
            data: input,
        }),
    },
    Product: {
        category: (parent) => prisma.category.findUnique({ where: { id: parent.categoryId } }),
    },
};
//# sourceMappingURL=product.resolvers.js.map