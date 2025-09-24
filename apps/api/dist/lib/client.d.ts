import { PrismaClient } from "../../prisma/generated/client/client.js";
declare const extendedPrisma: PrismaClient<import("prisma/generated/client/index.js").Prisma.PrismaClientOptions, import("prisma/generated/client/index.js").Prisma.LogLevel, import("prisma/generated/client/runtime/library.js").DefaultArgs>;
type ExtendedPrismaClient = typeof extendedPrisma;
export declare const prisma: ExtendedPrismaClient;
export {};
//# sourceMappingURL=client.d.ts.map