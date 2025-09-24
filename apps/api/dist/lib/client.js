import { PrismaClient } from "../../prisma/generated/client/client.js";
const extendedPrisma = new PrismaClient();
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? extendedPrisma;
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
//# sourceMappingURL=client.js.map