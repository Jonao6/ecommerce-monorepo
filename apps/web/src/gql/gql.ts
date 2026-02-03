/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
	'\n\tmutation CreateUser($input: CreateUserInput!) {\n\t\tcreateUser(input: $input) {\n\t\t\tname\n\t\t\temail\n\t\t\tcreatedAt\n\t\t}\n\t}\n': typeof types.CreateUserDocument;
	'\n\tmutation GetUser($input: LoginInput!) {\n\t\tgetUser(input: $input) {\n\t\t\tmessage\n\t\t\tuser {\n\t\t\t\tname\n\t\t\t\temail\n\t\t\t}\n\t\t}\n\t}\n': typeof types.GetUserDocument;
	'\n\tquery Me {\n\t\tme {\n\t\t\tid\n\t\t}\n\t}\n': typeof types.MeDocument;
	'\n\tmutation UpdateAddress($updateAddressId: ID!, $input: UpdateAddressInput!) {\n\t\tupdateAddress(id: $updateAddressId, input: $input) {\n\t\t\tcreatedAt\n\t\t\tid\n\t\t\tuser {\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n': typeof types.UpdateAddressDocument;
	'\n\tmutation CreateAddress($input: CreateAddressInput!) {\n\t\tcreateAddress(input: $input) {\n\t\t\tcreatedAt\n\t\t\tid\n\t\t}\n\t}\n': typeof types.CreateAddressDocument;
	'\n\tmutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {\n\t\tcreatePaymentIntent(input: $input) {\n\t\t\tclientSecret\n\t\t}\n\t}\n': typeof types.CreatePaymentIntentDocument;
	'\n\tmutation CreateOrder($input: CreateOrderInput!) {\n\t\tcreateOrder(input: $input) {\n\t\t\tid\n\t\t\tstatus\n\t\t\tcreatedAt\n\t\t}\n\t}\n': typeof types.CreateOrderDocument;
	'\n\tquery Order($orderId: ID!) {\n\t\torder(id: $orderId) {\n\t\t\tpayment {\n\t\t\t\tpaymentStatus\n\t\t\t}\n\t\t}\n\t}\n': typeof types.OrderDocument;
	'\n\tmutation DeleteAddress($deleteAddressId: ID!) {\n\t\tdeleteAddress(id: $deleteAddressId)\n\t}\n': typeof types.DeleteAddressDocument;
	'\n\tquery UserAddresses {\n\t\tuserAddresses{\n\t\t\tcity\n\t\t\tcomplements\n\t\t\tcountry\n\t\t\tcreatedAt\n\t\t\tid\n\t\t\tneighbor\n\t\t\tpostalCode\n\t\t\tstate\n\t\t\tstreet\n\t\t\tstreetNumber\n\t\t}\n\t}\n': typeof types.UserAddressesDocument;
	'\n\tquery UserOrders {\n\t\tuserOrders {\n\t\t\tid\n\t\t\tstatus\n\t\t\ttotalAmount\n\t\t\tpayment {\n\t\t\t\tpaymentMethod\n\t\t\t\tpaymentStatus\n\t\t\t\tpaidAt\n\t\t\t}\n\t\t\tdelivery {\n\t\t\t\tstatus\n\t\t\t}\n\t\t}\n\t}\n': typeof types.UserOrdersDocument;
	'\n\tquery Categories {\n\t\tcategories {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t}\n': typeof types.CategoriesDocument;
	'\n\tquery Category($name: String!) {\n\t\tcategory(name: $name) {\n\t\t\tproducts {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\tdescription\n\t\t\t\timage\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n': typeof types.CategoryDocument;
	'\n\tquery GetProducts($id: ID!) {\n\t\tproduct(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\timage\n\t\t\tprice\n\t\t\tcolors\n\t\t\tsizes\n\t\t\tdescription\n\t\t\tcategory {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tcreatedAt\n\t\t}\n\t}\n': typeof types.GetProductsDocument;
	'\n\tquery HomeProducts($limit: Int, $offset: Int) {\n\t\tproducts(limit: $limit, offset: $offset) {\n\t\t\tproducts {\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcreatedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\timage\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\turl\n\t\t\t}\n\t\t}\n\t}\n': typeof types.HomeProductsDocument;
	'\n\tmutation Mutation {\n\t\tlogout\n\t}\n': typeof types.MutationDocument;
	'\n\tquery Products($limit: Int, $offset: Int) {\n\t\tproducts(limit: $limit, offset: $offset) {\n\t\t\tcurrentPage\n\t\t\thasNextPage\n\t\t\thasPreviousPage\n\t\t\ttotalCount\n\t\t\ttotalPages\n\t\t\tproducts {\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcolors\n\t\t\t\tcreatedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\timage\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\tsizes\n\t\t\t\turl\n\t\t\t}\n\t\t}\n\t}\n': typeof types.ProductsDocument;
	'\n\tquery ProductsBySearch($term: String!) {\n\t\tproductsBySearch(term: $term) {\n\t\t\tprice\n\t\t\tname\n\t\t\timage\n\t\t\tid\n\t\t\tcategory {\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n': typeof types.ProductsBySearchDocument;
};
const documents: Documents = {
	'\n\tmutation CreateUser($input: CreateUserInput!) {\n\t\tcreateUser(input: $input) {\n\t\t\tname\n\t\t\temail\n\t\t\tcreatedAt\n\t\t}\n\t}\n':
		types.CreateUserDocument,
	'\n\tmutation GetUser($input: LoginInput!) {\n\t\tgetUser(input: $input) {\n\t\t\tmessage\n\t\t\tuser {\n\t\t\t\tname\n\t\t\t\temail\n\t\t\t}\n\t\t}\n\t}\n':
		types.GetUserDocument,
	'\n\tquery Me {\n\t\tme {\n\t\t\tid\n\t\t}\n\t}\n': types.MeDocument,
	'\n\tmutation UpdateAddress($updateAddressId: ID!, $input: UpdateAddressInput!) {\n\t\tupdateAddress(id: $updateAddressId, input: $input) {\n\t\t\tcreatedAt\n\t\t\tid\n\t\t\tuser {\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n':
		types.UpdateAddressDocument,
	'\n\tmutation CreateAddress($input: CreateAddressInput!) {\n\t\tcreateAddress(input: $input) {\n\t\t\tcreatedAt\n\t\t\tid\n\t\t}\n\t}\n':
		types.CreateAddressDocument,
	'\n\tmutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {\n\t\tcreatePaymentIntent(input: $input) {\n\t\t\tclientSecret\n\t\t}\n\t}\n':
		types.CreatePaymentIntentDocument,
	'\n\tmutation CreateOrder($input: CreateOrderInput!) {\n\t\tcreateOrder(input: $input) {\n\t\t\tid\n\t\t\tstatus\n\t\t\tcreatedAt\n\t\t}\n\t}\n':
		types.CreateOrderDocument,
	'\n\tquery Order($orderId: ID!) {\n\t\torder(id: $orderId) {\n\t\t\tpayment {\n\t\t\t\tpaymentStatus\n\t\t\t}\n\t\t}\n\t}\n':
		types.OrderDocument,
	'\n\tmutation DeleteAddress($deleteAddressId: ID!) {\n\t\tdeleteAddress(id: $deleteAddressId)\n\t}\n':
		types.DeleteAddressDocument,
	'\n\tquery UserAddresses {\n\t\tuserAddresses{\n\t\t\tcity\n\t\t\tcomplements\n\t\t\tcountry\n\t\t\tcreatedAt\n\t\t\tid\n\t\t\tneighbor\n\t\t\tpostalCode\n\t\t\tstate\n\t\t\tstreet\n\t\t\tstreetNumber\n\t\t}\n\t}\n':
		types.UserAddressesDocument,
	'\n\tquery UserOrders {\n\t\tuserOrders {\n\t\t\tid\n\t\t\tstatus\n\t\t\ttotalAmount\n\t\t\tpayment {\n\t\t\t\tpaymentMethod\n\t\t\t\tpaymentStatus\n\t\t\t\tpaidAt\n\t\t\t}\n\t\t\tdelivery {\n\t\t\t\tstatus\n\t\t\t}\n\t\t}\n\t}\n':
		types.UserOrdersDocument,
	'\n\tquery Categories {\n\t\tcategories {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t}\n':
		types.CategoriesDocument,
	'\n\tquery Category($name: String!) {\n\t\tcategory(name: $name) {\n\t\t\tproducts {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\tdescription\n\t\t\t\timage\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n':
		types.CategoryDocument,
	'\n\tquery GetProducts($id: ID!) {\n\t\tproduct(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\timage\n\t\t\tprice\n\t\t\tcolors\n\t\t\tsizes\n\t\t\tdescription\n\t\t\tcategory {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tcreatedAt\n\t\t}\n\t}\n':
		types.GetProductsDocument,
	'\n\tquery HomeProducts($limit: Int, $offset: Int) {\n\t\tproducts(limit: $limit, offset: $offset) {\n\t\t\tproducts {\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcreatedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\timage\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\turl\n\t\t\t}\n\t\t}\n\t}\n':
		types.HomeProductsDocument,
	'\n\tmutation Mutation {\n\t\tlogout\n\t}\n': types.MutationDocument,
	'\n\tquery Products($limit: Int, $offset: Int) {\n\t\tproducts(limit: $limit, offset: $offset) {\n\t\t\tcurrentPage\n\t\t\thasNextPage\n\t\t\thasPreviousPage\n\t\t\ttotalCount\n\t\t\ttotalPages\n\t\t\tproducts {\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcolors\n\t\t\t\tcreatedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\timage\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\tsizes\n\t\t\t\turl\n\t\t\t}\n\t\t}\n\t}\n':
		types.ProductsDocument,
	'\n\tquery ProductsBySearch($term: String!) {\n\t\tproductsBySearch(term: $term) {\n\t\t\tprice\n\t\t\tname\n\t\t\timage\n\t\t\tid\n\t\t\tcategory {\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n':
		types.ProductsBySearchDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tmutation CreateUser($input: CreateUserInput!) {\n\t\tcreateUser(input: $input) {\n\t\t\tname\n\t\t\temail\n\t\t\tcreatedAt\n\t\t}\n\t}\n',
): (typeof documents)['\n\tmutation CreateUser($input: CreateUserInput!) {\n\t\tcreateUser(input: $input) {\n\t\t\tname\n\t\t\temail\n\t\t\tcreatedAt\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tmutation GetUser($input: LoginInput!) {\n\t\tgetUser(input: $input) {\n\t\t\tmessage\n\t\t\tuser {\n\t\t\t\tname\n\t\t\t\temail\n\t\t\t}\n\t\t}\n\t}\n',
): (typeof documents)['\n\tmutation GetUser($input: LoginInput!) {\n\t\tgetUser(input: $input) {\n\t\t\tmessage\n\t\t\tuser {\n\t\t\t\tname\n\t\t\t\temail\n\t\t\t}\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tquery Me {\n\t\tme {\n\t\t\tid\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery Me {\n\t\tme {\n\t\t\tid\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tmutation UpdateAddress($updateAddressId: ID!, $input: UpdateAddressInput!) {\n\t\tupdateAddress(id: $updateAddressId, input: $input) {\n\t\t\tcreatedAt\n\t\t\tid\n\t\t\tuser {\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n',
): (typeof documents)['\n\tmutation UpdateAddress($updateAddressId: ID!, $input: UpdateAddressInput!) {\n\t\tupdateAddress(id: $updateAddressId, input: $input) {\n\t\t\tcreatedAt\n\t\t\tid\n\t\t\tuser {\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tmutation CreateAddress($input: CreateAddressInput!) {\n\t\tcreateAddress(input: $input) {\n\t\t\tcreatedAt\n\t\t\tid\n\t\t}\n\t}\n',
): (typeof documents)['\n\tmutation CreateAddress($input: CreateAddressInput!) {\n\t\tcreateAddress(input: $input) {\n\t\t\tcreatedAt\n\t\t\tid\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tmutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {\n\t\tcreatePaymentIntent(input: $input) {\n\t\t\tclientSecret\n\t\t}\n\t}\n',
): (typeof documents)['\n\tmutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {\n\t\tcreatePaymentIntent(input: $input) {\n\t\t\tclientSecret\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tmutation CreateOrder($input: CreateOrderInput!) {\n\t\tcreateOrder(input: $input) {\n\t\t\tid\n\t\t\tstatus\n\t\t\tcreatedAt\n\t\t}\n\t}\n',
): (typeof documents)['\n\tmutation CreateOrder($input: CreateOrderInput!) {\n\t\tcreateOrder(input: $input) {\n\t\t\tid\n\t\t\tstatus\n\t\t\tcreatedAt\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tquery Order($orderId: ID!) {\n\t\torder(id: $orderId) {\n\t\t\tpayment {\n\t\t\t\tpaymentStatus\n\t\t\t}\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery Order($orderId: ID!) {\n\t\torder(id: $orderId) {\n\t\t\tpayment {\n\t\t\t\tpaymentStatus\n\t\t\t}\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tmutation DeleteAddress($deleteAddressId: ID!) {\n\t\tdeleteAddress(id: $deleteAddressId)\n\t}\n',
): (typeof documents)['\n\tmutation DeleteAddress($deleteAddressId: ID!) {\n\t\tdeleteAddress(id: $deleteAddressId)\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tquery UserAddresses {\n\t\tuserAddresses{\n\t\t\tcity\n\t\t\tcomplements\n\t\t\tcountry\n\t\t\tcreatedAt\n\t\t\tid\n\t\t\tneighbor\n\t\t\tpostalCode\n\t\t\tstate\n\t\t\tstreet\n\t\t\tstreetNumber\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery UserAddresses {\n\t\tuserAddresses{\n\t\t\tcity\n\t\t\tcomplements\n\t\t\tcountry\n\t\t\tcreatedAt\n\t\t\tid\n\t\t\tneighbor\n\t\t\tpostalCode\n\t\t\tstate\n\t\t\tstreet\n\t\t\tstreetNumber\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tquery UserOrders {\n\t\tuserOrders {\n\t\t\tid\n\t\t\tstatus\n\t\t\ttotalAmount\n\t\t\tpayment {\n\t\t\t\tpaymentMethod\n\t\t\t\tpaymentStatus\n\t\t\t\tpaidAt\n\t\t\t}\n\t\t\tdelivery {\n\t\t\t\tstatus\n\t\t\t}\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery UserOrders {\n\t\tuserOrders {\n\t\t\tid\n\t\t\tstatus\n\t\t\ttotalAmount\n\t\t\tpayment {\n\t\t\t\tpaymentMethod\n\t\t\t\tpaymentStatus\n\t\t\t\tpaidAt\n\t\t\t}\n\t\t\tdelivery {\n\t\t\t\tstatus\n\t\t\t}\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tquery Categories {\n\t\tcategories {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery Categories {\n\t\tcategories {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tquery Category($name: String!) {\n\t\tcategory(name: $name) {\n\t\t\tproducts {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\tdescription\n\t\t\t\timage\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery Category($name: String!) {\n\t\tcategory(name: $name) {\n\t\t\tproducts {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\tdescription\n\t\t\t\timage\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tquery GetProducts($id: ID!) {\n\t\tproduct(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\timage\n\t\t\tprice\n\t\t\tcolors\n\t\t\tsizes\n\t\t\tdescription\n\t\t\tcategory {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tcreatedAt\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery GetProducts($id: ID!) {\n\t\tproduct(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\timage\n\t\t\tprice\n\t\t\tcolors\n\t\t\tsizes\n\t\t\tdescription\n\t\t\tcategory {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tcreatedAt\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tquery HomeProducts($limit: Int, $offset: Int) {\n\t\tproducts(limit: $limit, offset: $offset) {\n\t\t\tproducts {\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcreatedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\timage\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\turl\n\t\t\t}\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery HomeProducts($limit: Int, $offset: Int) {\n\t\tproducts(limit: $limit, offset: $offset) {\n\t\t\tproducts {\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcreatedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\timage\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\turl\n\t\t\t}\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tmutation Mutation {\n\t\tlogout\n\t}\n',
): (typeof documents)['\n\tmutation Mutation {\n\t\tlogout\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tquery Products($limit: Int, $offset: Int) {\n\t\tproducts(limit: $limit, offset: $offset) {\n\t\t\tcurrentPage\n\t\t\thasNextPage\n\t\t\thasPreviousPage\n\t\t\ttotalCount\n\t\t\ttotalPages\n\t\t\tproducts {\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcolors\n\t\t\t\tcreatedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\timage\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\tsizes\n\t\t\t\turl\n\t\t\t}\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery Products($limit: Int, $offset: Int) {\n\t\tproducts(limit: $limit, offset: $offset) {\n\t\t\tcurrentPage\n\t\t\thasNextPage\n\t\t\thasPreviousPage\n\t\t\ttotalCount\n\t\t\ttotalPages\n\t\t\tproducts {\n\t\t\t\tcategory {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcolors\n\t\t\t\tcreatedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\timage\n\t\t\t\tname\n\t\t\t\tprice\n\t\t\t\tsizes\n\t\t\t\turl\n\t\t\t}\n\t\t}\n\t}\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: '\n\tquery ProductsBySearch($term: String!) {\n\t\tproductsBySearch(term: $term) {\n\t\t\tprice\n\t\t\tname\n\t\t\timage\n\t\t\tid\n\t\t\tcategory {\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery ProductsBySearch($term: String!) {\n\t\tproductsBySearch(term: $term) {\n\t\t\tprice\n\t\t\tname\n\t\t\timage\n\t\t\tid\n\t\t\tcategory {\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n'];

export function graphql(source: string) {
	return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
	TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
