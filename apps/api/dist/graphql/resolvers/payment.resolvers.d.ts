export declare const paymentResolvers: {
    Mutation: {
        createPaymentIntent: (_: any, { orderId }: {
            orderId: any;
        }, { prisma }: {
            prisma: any;
        }) => Promise<{
            clientSecret: string;
        }>;
    };
    Payment: {
        order: (parent: any) => import("prisma/generated/client/index.js").Prisma.Prisma__OrderClient<{
            id: number;
            userId: number;
            status: import("prisma/generated/client/index.js").$Enums.OrderStatus;
            addressId: number;
            totalAmount: import("prisma/generated/client/runtime/library.js").Decimal;
            createdAt: Date;
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
    };
};
//# sourceMappingURL=payment.resolvers.d.ts.map