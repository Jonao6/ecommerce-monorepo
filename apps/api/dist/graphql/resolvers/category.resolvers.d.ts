export declare const categoryResolvers: {
    Query: {
        categories: () => import("prisma/generated/client/index.js").Prisma.PrismaPromise<{
            id: number;
            createdAt: Date;
            name: string;
        }[]>;
        category: (_: unknown, { id }: {
            id: any;
        }) => import("prisma/generated/client/index.js").Prisma.Prisma__CategoryClient<{
            id: number;
            createdAt: Date;
            name: string;
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
    };
    Mutation: {
        createCategory: (_: unknown, { name }: {
            name: any;
        }) => import("prisma/generated/client/index.js").Prisma.Prisma__CategoryClient<{
            id: number;
            createdAt: Date;
            name: string;
        }, never, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
    };
    Category: {
        products: (parent: any) => import("prisma/generated/client/index.js").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            name: string;
            price: import("prisma/generated/client/runtime/library.js").Decimal;
            description: string | null;
            url: string | null;
            image: string | null;
            colors: import("prisma/generated/client/runtime/library.js").JsonValue | null;
            sizes: import("prisma/generated/client/runtime/library.js").JsonValue | null;
            categoryId: number;
        }[]>;
    };
};
//# sourceMappingURL=category.resolvers.d.ts.map