export declare const productResolvers: {
    Query: {
        products: (_: any, { limit, offset }: {
            limit: number;
            offset: number;
        }) => import("prisma/generated/client/index.js").Prisma.PrismaPromise<{
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
        product: (_: any, { id }: {
            id: any;
        }) => import("prisma/generated/client/index.js").Prisma.Prisma__ProductClient<{
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
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
        productsByCategory: (_: any, { categoryId }: {
            categoryId: any;
        }) => import("prisma/generated/client/index.js").Prisma.PrismaPromise<{
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
    Mutation: {
        createProduct: (_: any, { input }: {
            input: any;
        }) => import("prisma/generated/client/index.js").Prisma.Prisma__ProductClient<{
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
        }, never, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
        updateProduct: (_: any, { id, input }: {
            id: any;
            input: any;
        }) => import("prisma/generated/client/index.js").Prisma.Prisma__ProductClient<{
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
        }, never, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
    };
    Product: {
        category: (parent: any) => import("prisma/generated/client/index.js").Prisma.Prisma__CategoryClient<{
            id: number;
            createdAt: Date;
            name: string;
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
    };
};
//# sourceMappingURL=product.resolvers.d.ts.map