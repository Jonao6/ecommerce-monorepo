import { PrismaClient } from "../../prisma/generated/client/client.js";

const extendedPrisma = new PrismaClient();
type ExtendedPrismaClient = typeof extendedPrisma;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: ExtendedPrismaClient;
};

export const prisma: ExtendedPrismaClient =
  globalForPrisma.prisma ?? extendedPrisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}