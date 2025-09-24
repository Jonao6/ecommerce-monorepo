export declare const userResolvers: {
    Query: {
        users: () => import("prisma/generated/client/index.js").Prisma.PrismaPromise<{
            id: number;
            createdAt: Date;
            email: string;
            passwordHash: string;
        }[]>;
        user: (_: any, { id }: {
            id: any;
        }) => import("prisma/generated/client/index.js").Prisma.Prisma__UserClient<{
            id: number;
            createdAt: Date;
            email: string;
            passwordHash: string;
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
    };
    Mutation: {
        createUser: (_: any, { email, password }: {
            email: any;
            password: any;
        }) => Promise<{
            id: number;
            createdAt: Date;
            email: string;
            passwordHash: string;
        }>;
    };
    User: {
        addresses: (parent: any) => import("prisma/generated/client/index.js").Prisma.PrismaPromise<{
            id: number;
            userId: number;
            createdAt: Date;
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        }[]>;
        orders: (parent: any) => import("prisma/generated/client/index.js").Prisma.PrismaPromise<{
            id: number;
            userId: number;
            status: import("prisma/generated/client/index.js").$Enums.OrderStatus;
            addressId: number;
            totalAmount: import("prisma/generated/client/runtime/library.js").Decimal;
            createdAt: Date;
        }[]>;
    };
    Address: {
        user: (parent: any) => import("prisma/generated/client/index.js").Prisma.Prisma__UserClient<{
            id: number;
            createdAt: Date;
            email: string;
            passwordHash: string;
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
    };
};
//# sourceMappingURL=user.resolvers.d.ts.map