import type { CodegenConfig } from '@graphql-codegen/cli';
 
const config: CodegenConfig = {
  schema: './src/graphql/schema/schema.graphql',
  generates: {
    './src/graphql/types.ts': {
      config: {
        useIndexSignature: true,
        importExtension: '.js',
        mappers: {
          User: '../../prisma/generated/client/client#User as UserModel',
          Product: '../../prisma/generated/client/client#Product as ProductModel',
          Order: '../../prisma/generated/client/client#Order as OrderModel',
          Payment: '../../prisma/generated/client/client#Payment as PaymentModel',
          Category: '../../prisma/generated/client/client#Category as CategoryModel',
          Address: '../../prisma/generated/client/client#Address as AddressModel',
          OrderItem: '../../prisma/generated/client/client#OrderItem as OrderItemModel',
          Delivery: '../../prisma/generated/client/client#Delivery as DeliveryModel',
        },
        contextType: '../server/context#Context',
        scalars: {
          DateTime: 'Date | string',
          Decimal: 'number'
        },
        inputMaybeValue: 'T | null | undefined',
        enumsAsTypes: true
      },
      plugins: ['typescript', 'typescript-resolvers', 'typescript-operations', 'typed-document-node'],
    },
  },
};
export default config;