import { prisma } from "../../lib/index.js";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
export const userResolvers = {
    Query: {
        users: () => prisma.user.findMany(),
        user: (_, { id }) => prisma.user.findUnique({ where: { id: parseInt(id) } }),
    },
    Mutation: {
        createUser: async (_, { email, password }) => {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            return prisma.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                },
            });
        },
    },
    User: {
        addresses: (parent) => prisma.address.findMany({ where: { userId: parent.id } }),
        orders: (parent) => prisma.order.findMany({ where: { userId: parent.id } }),
    },
    Address: {
        user: (parent) => prisma.user.findUnique({ where: { id: parent.userId } }),
    },
};
//# sourceMappingURL=user.resolvers.js.map