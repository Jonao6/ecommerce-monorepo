export declare const orderResolvers: {
    Query: {
        orders: () => import("prisma/generated/client/index.js").Prisma.PrismaPromise<{
            id: number;
            userId: number;
            status: import("prisma/generated/client/index.js").$Enums.OrderStatus;
            addressId: number;
            totalAmount: import("prisma/generated/client/runtime/library.js").Decimal;
            createdAt: Date;
        }[]>;
        order: (_: any, { id }: {
            id: any;
        }) => import("prisma/generated/client/index.js").Prisma.Prisma__OrderClient<{
            items: {
                id: number;
                orderId: number;
                productId: string;
                quantity: number;
                price: import("prisma/generated/client/runtime/library.js").Decimal;
            }[];
        } & {
            id: number;
            userId: number;
            status: import("prisma/generated/client/index.js").$Enums.OrderStatus;
            addressId: number;
            totalAmount: import("prisma/generated/client/runtime/library.js").Decimal;
            createdAt: Date;
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
        userOrders: (_: any, { userId }: {
            userId: any;
        }) => import("prisma/generated/client/index.js").Prisma.PrismaPromise<({
            items: {
                id: number;
                orderId: number;
                productId: string;
                quantity: number;
                price: import("prisma/generated/client/runtime/library.js").Decimal;
            }[];
        } & {
            id: number;
            userId: number;
            status: import("prisma/generated/client/index.js").$Enums.OrderStatus;
            addressId: number;
            totalAmount: import("prisma/generated/client/runtime/library.js").Decimal;
            createdAt: Date;
        })[]>;
    };
    Mutation: {
        createOrder: (_: any, { input }: {
            input: any;
        }) => Promise<{
            items: {
                id: number;
                orderId: number;
                productId: string;
                quantity: number;
                price: import("prisma/generated/client/runtime/library.js").Decimal;
            }[];
        } & {
            id: number;
            userId: number;
            status: import("prisma/generated/client/index.js").$Enums.OrderStatus;
            addressId: number;
            totalAmount: import("prisma/generated/client/runtime/library.js").Decimal;
            createdAt: Date;
        }>;
        updateOrderStatus: (_: any, { id, status }: {
            id: any;
            status: any;
        }) => import("prisma/generated/client/index.js").Prisma.Prisma__OrderClient<{
            id: number;
            userId: number;
            status: import("prisma/generated/client/index.js").$Enums.OrderStatus;
            addressId: number;
            totalAmount: import("prisma/generated/client/runtime/library.js").Decimal;
            createdAt: Date;
        }, never, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
    };
    Order: {
        user: (parent: any) => import("prisma/generated/client/index.js").Prisma.Prisma__UserClient<{
            id: number;
            createdAt: Date;
            email: string;
            passwordHash: string;
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
        address: (parent: any) => import("prisma/generated/client/index.js").Prisma.Prisma__AddressClient<{
            id: number;
            userId: number;
            createdAt: Date;
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
        items: (parent: any) => import("prisma/generated/client/index.js").Prisma.PrismaPromise<{
            id: number;
            orderId: number;
            productId: string;
            quantity: number;
            price: import("prisma/generated/client/runtime/library.js").Decimal;
        }[]>;
        payment: (parent: any) => import("prisma/generated/client/index.js").Prisma.Prisma__PaymentClient<{
            id: number;
            orderId: number;
            paymentMethod: string;
            amount: import("prisma/generated/client/runtime/library.js").Decimal;
            paymentStatus: import("prisma/generated/client/index.js").$Enums.PaymentStatus;
            paidAt: Date | null;
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
        delivery: (parent: any) => import("prisma/generated/client/index.js").Prisma.Prisma__DeliveryClient<{
            id: number;
            orderId: number;
            deliveryStatus: import("prisma/generated/client/index.js").$Enums.DeliveryStatus;
            trackingNumber: string | null;
            deliveredAt: Date | null;
        }, null, import("prisma/generated/client/runtime/library.js").DefaultArgs, import("prisma/generated/client/index.js").Prisma.PrismaClientOptions>;
    };
    OrderItem: {
        product: (parent: any) => import("prisma/generated/client/index.js").Prisma.Prisma__ProductClient<{
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
    };
};
//# sourceMappingURL=order.resolvers.d.ts.map