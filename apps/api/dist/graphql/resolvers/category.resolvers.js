import { prisma } from "../../lib/index.js";
export const categoryResolvers = {
    Query: {
        categories: () => prisma.category.findMany(),
        category: (_, { id }) => prisma.category.findUnique({ where: { id: parseInt(id) } }),
    },
    Mutation: {
        createCategory: (_, { name }) => prisma.category.create({ data: { name } }),
    },
    Category: {
        products: (parent) => prisma.product.findMany({ where: { categoryId: parent.id } }),
    },
};
//# sourceMappingURL=category.resolvers.js.map