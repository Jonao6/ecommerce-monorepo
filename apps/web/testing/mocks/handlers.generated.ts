import { graphql, type GraphQLResponseResolver, type RequestHandlerOptions } from 'msw'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  complements: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  neighbor: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
  streetNumber: Scalars['String']['output'];
  user: User;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  message: Scalars['String']['output'];
  user: User;
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  products: Array<Product>;
};

export type CreateAddressInput = {
  city: Scalars['String']['input'];
  complements: Scalars['String']['input'];
  country: Scalars['String']['input'];
  neighbor: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
  streetNumber: Scalars['String']['input'];
};

export type CreateOrderInput = {
  addressId?: InputMaybe<Scalars['ID']['input']>;
  items: Array<CreateOrderItemInput>;
  totalAmount: Scalars['Decimal']['input'];
};

export type CreateOrderItemInput = {
  color: Scalars['String']['input'];
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
};

export type CreatePaymentIntentInput = {
  amount: Scalars['Int']['input'];
  orderId: Scalars['ID']['input'];
};

export type CreateProductInput = {
  categoryId: Scalars['ID']['input'];
  colors?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  sizes?: InputMaybe<Array<Scalars['Int']['input']>>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Delivery = {
  __typename?: 'Delivery';
  deliveredAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  order: Order;
  status: DeliveryStatus;
  trackingNumber?: Maybe<Scalars['String']['output']>;
};

export enum DeliveryStatus {
  Delivered = 'delivered',
  InTransit = 'in_transit',
  Preparing = 'preparing',
  Returned = 'returned',
  Shipped = 'shipped'
}

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAddress: Address;
  createCategory: Category;
  createOrder: Order;
  createPaymentIntent: PaymentIntentResponse;
  createProduct: Product;
  createUser: User;
  deleteAddress: Scalars['Boolean']['output'];
  deleteCategory: Scalars['Boolean']['output'];
  deleteOrder: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  getUser: AuthPayload;
  logout: Scalars['Boolean']['output'];
  processPayment: Payment;
  updateAddress: Address;
  updateCategory: Category;
  updateOrderAddress: Order;
  updateOrderStatus: Order;
  updateProduct: Product;
  updateUser: User;
};


export type MutationCreateAddressArgs = {
  input: CreateAddressInput;
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreatePaymentIntentArgs = {
  input: CreatePaymentIntentInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteAddressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGetUserArgs = {
  input: LoginInput;
};


export type MutationProcessPaymentArgs = {
  orderId: Scalars['ID']['input'];
  paymentMethod: Scalars['String']['input'];
};


export type MutationUpdateAddressArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAddressInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateOrderAddressArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrderInput;
};


export type MutationUpdateOrderStatusArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrderInput;
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Order = {
  __typename?: 'Order';
  address: Address;
  createdAt: Scalars['String']['output'];
  delivery?: Maybe<Delivery>;
  id: Scalars['ID']['output'];
  items: Array<OrderItem>;
  payment?: Maybe<Payment>;
  status: OrderStatus;
  totalAmount: Scalars['Float']['output'];
  user: User;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  id: Scalars['ID']['output'];
  price: Scalars['Float']['output'];
  product: Product;
  quantity: Scalars['Int']['output'];
};

export enum OrderStatus {
  Cancelled = 'cancelled',
  Delivered = 'delivered',
  Pending = 'pending',
  Processing = 'processing',
  Shipped = 'shipped'
}

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  order: Order;
  paidAt?: Maybe<Scalars['String']['output']>;
  paymentMethod: Scalars['String']['output'];
  paymentStatus: PaymentStatus;
};

export type PaymentIntentResponse = {
  __typename?: 'PaymentIntentResponse';
  clientSecret: Scalars['String']['output'];
};

export enum PaymentStatus {
  Failed = 'failed',
  Paid = 'paid',
  Pending = 'pending'
}

export type Product = {
  __typename?: 'Product';
  category: Category;
  categoryId?: Maybe<Scalars['ID']['output']>;
  colors?: Maybe<Array<Scalars['String']['output']>>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Decimal']['output'];
  sizes?: Maybe<Array<Scalars['Int']['output']>>;
  url?: Maybe<Scalars['String']['output']>;
};

export type ProductsResponse = {
  __typename?: 'ProductsResponse';
  currentPage: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  products: Array<Product>;
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  address?: Maybe<Address>;
  adminAddresses: Array<Address>;
  adminOrders: Array<Order>;
  adminUsers: Array<User>;
  categories: Array<Category>;
  category?: Maybe<Category>;
  me?: Maybe<User>;
  order?: Maybe<Order>;
  product?: Maybe<Product>;
  products: ProductsResponse;
  productsByCategory: Array<Product>;
  productsBySearch: Array<Product>;
  user?: Maybe<User>;
  userAddresses: Array<Address>;
  userOrders: Array<Order>;
};


export type QueryAddressArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoryArgs = {
  name: Scalars['String']['input'];
};


export type QueryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductsByCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryProductsBySearchArgs = {
  term: Scalars['String']['input'];
};


export type QueryUserArgs = {
  email: Scalars['String']['input'];
};

export type UpdateAddressInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrderInput = {
  addressId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<OrderStatus>;
};

export type UpdateProductInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  colors?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  sizes?: InputMaybe<Array<Scalars['Int']['input']>>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  addresses: Array<Address>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  orders: Array<Order>;
};

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', name: string, email: string, createdAt: string } };

export type GetUserMutationVariables = Exact<{
  input: LoginInput;
}>;


export type GetUserMutation = { __typename?: 'Mutation', getUser: { __typename?: 'AuthPayload', message: string, user: { __typename?: 'User', name: string, email: string } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string } | null };

export type UpdateAddressMutationVariables = Exact<{
  updateAddressId: Scalars['ID']['input'];
  input: UpdateAddressInput;
}>;


export type UpdateAddressMutation = { __typename?: 'Mutation', updateAddress: { __typename?: 'Address', createdAt: string, id: string, user: { __typename?: 'User', name: string } } };

export type CreateAddressMutationVariables = Exact<{
  input: CreateAddressInput;
}>;


export type CreateAddressMutation = { __typename?: 'Mutation', createAddress: { __typename?: 'Address', createdAt: string, id: string } };

export type CreatePaymentIntentMutationVariables = Exact<{
  input: CreatePaymentIntentInput;
}>;


export type CreatePaymentIntentMutation = { __typename?: 'Mutation', createPaymentIntent: { __typename?: 'PaymentIntentResponse', clientSecret: string } };

export type CreateOrderMutationVariables = Exact<{
  input: CreateOrderInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'Order', id: string, status: OrderStatus, createdAt: string } };

export type OrderQueryVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type OrderQuery = { __typename?: 'Query', order?: { __typename?: 'Order', payment?: { __typename?: 'Payment', paymentStatus: PaymentStatus } | null } | null };

export type DeleteAddressMutationVariables = Exact<{
  deleteAddressId: Scalars['ID']['input'];
}>;


export type DeleteAddressMutation = { __typename?: 'Mutation', deleteAddress: boolean };

export type UserAddressesQueryVariables = Exact<{ [key: string]: never; }>;


export type UserAddressesQuery = { __typename?: 'Query', userAddresses: Array<{ __typename?: 'Address', city: string, complements: string, country: string, createdAt: string, id: string, neighbor: string, postalCode: string, state: string, street: string, streetNumber: string }> };

export type UserOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type UserOrdersQuery = { __typename?: 'Query', userOrders: Array<{ __typename?: 'Order', id: string, status: OrderStatus, totalAmount: number, payment?: { __typename?: 'Payment', paymentMethod: string, paymentStatus: PaymentStatus, paidAt?: string | null } | null, delivery?: { __typename?: 'Delivery', status: DeliveryStatus } | null }> };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string }> };

export type CategoryQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CategoryQuery = { __typename?: 'Query', category?: { __typename?: 'Category', products: Array<{ __typename?: 'Product', id: string, name: string, price: any, description?: string | null, image: string, category: { __typename?: 'Category', name: string } }> } | null };

export type GetProductsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProductsQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: string, name: string, image: string, price: any, colors?: Array<string> | null, sizes?: Array<number> | null, description?: string | null, createdAt: any, category: { __typename?: 'Category', id: string, name: string } } | null };

export type HomeProductsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type HomeProductsQuery = { __typename?: 'Query', products: { __typename?: 'ProductsResponse', products: Array<{ __typename?: 'Product', createdAt: any, description?: string | null, id: string, image: string, name: string, price: any, url?: string | null, category: { __typename?: 'Category', name: string } }> } };

export type MutationMutationVariables = Exact<{ [key: string]: never; }>;


export type MutationMutation = { __typename?: 'Mutation', logout: boolean };

export type ProductsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ProductsQuery = { __typename?: 'Query', products: { __typename?: 'ProductsResponse', currentPage: number, hasNextPage: boolean, hasPreviousPage: boolean, totalCount: number, totalPages: number, products: Array<{ __typename?: 'Product', colors?: Array<string> | null, createdAt: any, description?: string | null, id: string, image: string, name: string, price: any, sizes?: Array<number> | null, url?: string | null, category: { __typename?: 'Category', name: string } }> } };

export type ProductsBySearchQueryVariables = Exact<{
  term: Scalars['String']['input'];
}>;


export type ProductsBySearchQuery = { __typename?: 'Query', productsBySearch: Array<{ __typename?: 'Product', price: any, name: string, image: string, id: string, category: { __typename?: 'Category', name: string } }> };


/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateUserMutation = (resolver: GraphQLResponseResolver<CreateUserMutation, CreateUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<CreateUserMutation, CreateUserMutationVariables>(
    'CreateUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { getUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserMutation = (resolver: GraphQLResponseResolver<GetUserMutation, GetUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<GetUserMutation, GetUserMutationVariables>(
    'GetUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockMeQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { me }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockMeQuery = (resolver: GraphQLResponseResolver<MeQuery, MeQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<MeQuery, MeQueryVariables>(
    'Me',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateAddressMutation(
 *   ({ query, variables }) => {
 *     const { updateAddressId, input } = variables;
 *     return HttpResponse.json({
 *       data: { updateAddress }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateAddressMutation = (resolver: GraphQLResponseResolver<UpdateAddressMutation, UpdateAddressMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<UpdateAddressMutation, UpdateAddressMutationVariables>(
    'UpdateAddress',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateAddressMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createAddress }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateAddressMutation = (resolver: GraphQLResponseResolver<CreateAddressMutation, CreateAddressMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<CreateAddressMutation, CreateAddressMutationVariables>(
    'CreateAddress',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreatePaymentIntentMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createPaymentIntent }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreatePaymentIntentMutation = (resolver: GraphQLResponseResolver<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>(
    'CreatePaymentIntent',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateOrderMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createOrder }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateOrderMutation = (resolver: GraphQLResponseResolver<CreateOrderMutation, CreateOrderMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<CreateOrderMutation, CreateOrderMutationVariables>(
    'CreateOrder',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockOrderQuery(
 *   ({ query, variables }) => {
 *     const { orderId } = variables;
 *     return HttpResponse.json({
 *       data: { order }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockOrderQuery = (resolver: GraphQLResponseResolver<OrderQuery, OrderQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<OrderQuery, OrderQueryVariables>(
    'Order',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteAddressMutation(
 *   ({ query, variables }) => {
 *     const { deleteAddressId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteAddress }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteAddressMutation = (resolver: GraphQLResponseResolver<DeleteAddressMutation, DeleteAddressMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<DeleteAddressMutation, DeleteAddressMutationVariables>(
    'DeleteAddress',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUserAddressesQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { userAddresses }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUserAddressesQuery = (resolver: GraphQLResponseResolver<UserAddressesQuery, UserAddressesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<UserAddressesQuery, UserAddressesQueryVariables>(
    'UserAddresses',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUserOrdersQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { userOrders }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUserOrdersQuery = (resolver: GraphQLResponseResolver<UserOrdersQuery, UserOrdersQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<UserOrdersQuery, UserOrdersQueryVariables>(
    'UserOrders',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCategoriesQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { categories }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCategoriesQuery = (resolver: GraphQLResponseResolver<CategoriesQuery, CategoriesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<CategoriesQuery, CategoriesQueryVariables>(
    'Categories',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCategoryQuery(
 *   ({ query, variables }) => {
 *     const { name } = variables;
 *     return HttpResponse.json({
 *       data: { category }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCategoryQuery = (resolver: GraphQLResponseResolver<CategoryQuery, CategoryQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<CategoryQuery, CategoryQueryVariables>(
    'Category',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetProductsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { product }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetProductsQuery = (resolver: GraphQLResponseResolver<GetProductsQuery, GetProductsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetProductsQuery, GetProductsQueryVariables>(
    'GetProducts',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockHomeProductsQuery(
 *   ({ query, variables }) => {
 *     const { limit, offset } = variables;
 *     return HttpResponse.json({
 *       data: { products }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockHomeProductsQuery = (resolver: GraphQLResponseResolver<HomeProductsQuery, HomeProductsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<HomeProductsQuery, HomeProductsQueryVariables>(
    'HomeProducts',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockMutationMutation(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { logout }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockMutationMutation = (resolver: GraphQLResponseResolver<MutationMutation, MutationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<MutationMutation, MutationMutationVariables>(
    'Mutation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProductsQuery(
 *   ({ query, variables }) => {
 *     const { limit, offset } = variables;
 *     return HttpResponse.json({
 *       data: { products }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockProductsQuery = (resolver: GraphQLResponseResolver<ProductsQuery, ProductsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<ProductsQuery, ProductsQueryVariables>(
    'Products',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProductsBySearchQuery(
 *   ({ query, variables }) => {
 *     const { term } = variables;
 *     return HttpResponse.json({
 *       data: { productsBySearch }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockProductsBySearchQuery = (resolver: GraphQLResponseResolver<ProductsBySearchQuery, ProductsBySearchQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<ProductsBySearchQuery, ProductsBySearchQueryVariables>(
    'ProductsBySearch',
    resolver,
    options
  )
