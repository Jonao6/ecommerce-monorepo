import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User as UserModel, Product as ProductModel, Order as OrderModel, Payment as PaymentModel, Category as CategoryModel, Address as AddressModel, OrderItem as OrderItemModel, Delivery as DeliveryModel } from '../../prisma/generated/client/client.js';
import { ServerContext } from '../server/context.js'
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date | string; output: Date | string; }
  Decimal: { input: number; output: number; }
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

export type DeliveryStatus =
  | 'delivered'
  | 'in_transit'
  | 'preparing'
  | 'returned'
  | 'shipped';

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

export type OrderStatus =
  | 'cancelled'
  | 'delivered'
  | 'pending'
  | 'processing'
  | 'shipped';

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

export type PaymentStatus =
  | 'failed'
  | 'paid'
  | 'pending';

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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TServerContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TServerContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TServerContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TServerContext, TArgs> | ResolverWithResolve<TResult, TParent, TServerContext, TArgs>;

export type ResolverFn<TResult, TParent, TServerContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  ServerContext: TServerContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TServerContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  ServerContext: TServerContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TServerContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  ServerContext: TServerContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TServerContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TServerContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TServerContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TServerContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TServerContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TServerContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TServerContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TServerContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TServerContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TServerContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TServerContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TServerContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TServerContext = Record<PropertyKey, never>> = (
  parent: TParent,
  ServerContext: TServerContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TServerContext = Record<PropertyKey, never>> = (obj: T, ServerContext: TServerContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TServerContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  ServerContext: TServerContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Address: ResolverTypeWrapper<AddressModel>;
  AuthPayload: ResolverTypeWrapper<Omit<AuthPayload, 'user'> & { user: ResolversTypes['User'] }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: ResolverTypeWrapper<CategoryModel>;
  CreateAddressInput: CreateAddressInput;
  CreateOrderInput: CreateOrderInput;
  CreateOrderItemInput: CreateOrderItemInput;
  CreatePaymentIntentInput: CreatePaymentIntentInput;
  CreateProductInput: CreateProductInput;
  CreateUserInput: CreateUserInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Decimal: ResolverTypeWrapper<Scalars['Decimal']['output']>;
  Delivery: ResolverTypeWrapper<DeliveryModel>;
  DeliveryStatus: DeliveryStatus;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Order: ResolverTypeWrapper<OrderModel>;
  OrderItem: ResolverTypeWrapper<OrderItemModel>;
  OrderStatus: OrderStatus;
  Payment: ResolverTypeWrapper<PaymentModel>;
  PaymentIntentResponse: ResolverTypeWrapper<PaymentIntentResponse>;
  PaymentStatus: PaymentStatus;
  Product: ResolverTypeWrapper<ProductModel>;
  ProductsResponse: ResolverTypeWrapper<Omit<ProductsResponse, 'products'> & { products: Array<ResolversTypes['Product']> }>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateAddressInput: UpdateAddressInput;
  UpdateOrderInput: UpdateOrderInput;
  UpdateProductInput: UpdateProductInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<UserModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Address: AddressModel;
  AuthPayload: Omit<AuthPayload, 'user'> & { user: ResolversParentTypes['User'] };
  Boolean: Scalars['Boolean']['output'];
  Category: CategoryModel;
  CreateAddressInput: CreateAddressInput;
  CreateOrderInput: CreateOrderInput;
  CreateOrderItemInput: CreateOrderItemInput;
  CreatePaymentIntentInput: CreatePaymentIntentInput;
  CreateProductInput: CreateProductInput;
  CreateUserInput: CreateUserInput;
  DateTime: Scalars['DateTime']['output'];
  Decimal: Scalars['Decimal']['output'];
  Delivery: DeliveryModel;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LoginInput: LoginInput;
  Mutation: Record<PropertyKey, never>;
  Order: OrderModel;
  OrderItem: OrderItemModel;
  Payment: PaymentModel;
  PaymentIntentResponse: PaymentIntentResponse;
  Product: ProductModel;
  ProductsResponse: Omit<ProductsResponse, 'products'> & { products: Array<ResolversParentTypes['Product']> };
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  UpdateAddressInput: UpdateAddressInput;
  UpdateOrderInput: UpdateOrderInput;
  UpdateProductInput: UpdateProductInput;
  UpdateUserInput: UpdateUserInput;
  User: UserModel;
}>;

export type AddressResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = ResolversObject<{
  city?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  complements?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ServerContextType>;
  neighbor?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  postalCode?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  street?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  streetNumber?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ServerContextType>;
}>;

export type AuthPayloadResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ServerContextType>;
}>;

export type CategoryResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ServerContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ServerContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface DecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal';
}

export type DeliveryResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['Delivery'] = ResolversParentTypes['Delivery']> = ResolversObject<{
  deliveredAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ServerContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ServerContextType>;
  order?: Resolver<ResolversTypes['Order'], ParentType, ServerContextType>;
  status?: Resolver<ResolversTypes['DeliveryStatus'], ParentType, ServerContextType>;
  trackingNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ServerContextType>;
}>;

export type MutationResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createAddress?: Resolver<ResolversTypes['Address'], ParentType, ServerContextType, RequireFields<MutationCreateAddressArgs, 'input'>>;
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ServerContextType, RequireFields<MutationCreateCategoryArgs, 'name'>>;
  createOrder?: Resolver<ResolversTypes['Order'], ParentType, ServerContextType, RequireFields<MutationCreateOrderArgs, 'input'>>;
  createPaymentIntent?: Resolver<ResolversTypes['PaymentIntentResponse'], ParentType, ServerContextType, RequireFields<MutationCreatePaymentIntentArgs, 'input'>>;
  createProduct?: Resolver<ResolversTypes['Product'], ParentType, ServerContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ServerContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteAddress?: Resolver<ResolversTypes['Boolean'], ParentType, ServerContextType, RequireFields<MutationDeleteAddressArgs, 'id'>>;
  deleteCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ServerContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteOrder?: Resolver<ResolversTypes['Boolean'], ParentType, ServerContextType, RequireFields<MutationDeleteOrderArgs, 'id'>>;
  deleteProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ServerContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ServerContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  getUser?: Resolver<ResolversTypes['AuthPayload'], ParentType, ServerContextType, RequireFields<MutationGetUserArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ServerContextType>;
  processPayment?: Resolver<ResolversTypes['Payment'], ParentType, ServerContextType, RequireFields<MutationProcessPaymentArgs, 'orderId' | 'paymentMethod'>>;
  updateAddress?: Resolver<ResolversTypes['Address'], ParentType, ServerContextType, RequireFields<MutationUpdateAddressArgs, 'id' | 'input'>>;
  updateCategory?: Resolver<ResolversTypes['Category'], ParentType, ServerContextType, RequireFields<MutationUpdateCategoryArgs, 'id' | 'name'>>;
  updateOrderAddress?: Resolver<ResolversTypes['Order'], ParentType, ServerContextType, RequireFields<MutationUpdateOrderAddressArgs, 'id' | 'input'>>;
  updateOrderStatus?: Resolver<ResolversTypes['Order'], ParentType, ServerContextType, RequireFields<MutationUpdateOrderStatusArgs, 'id' | 'input'>>;
  updateProduct?: Resolver<ResolversTypes['Product'], ParentType, ServerContextType, RequireFields<MutationUpdateProductArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ServerContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
}>;

export type OrderResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = ResolversObject<{
  address?: Resolver<ResolversTypes['Address'], ParentType, ServerContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  delivery?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ServerContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ServerContextType>;
  items?: Resolver<Array<ResolversTypes['OrderItem']>, ParentType, ServerContextType>;
  payment?: Resolver<Maybe<ResolversTypes['Payment']>, ParentType, ServerContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ServerContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ServerContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ServerContextType>;
}>;

export type OrderItemResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['OrderItem'] = ResolversParentTypes['OrderItem']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ServerContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ServerContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ServerContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ServerContextType>;
}>;

export type PaymentResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ServerContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ServerContextType>;
  order?: Resolver<ResolversTypes['Order'], ParentType, ServerContextType>;
  paidAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ServerContextType>;
  paymentMethod?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  paymentStatus?: Resolver<ResolversTypes['PaymentStatus'], ParentType, ServerContextType>;
}>;

export type PaymentIntentResponseResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['PaymentIntentResponse'] = ResolversParentTypes['PaymentIntentResponse']> = ResolversObject<{
  clientSecret?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
}>;

export type ProductResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  category?: Resolver<ResolversTypes['Category'], ParentType, ServerContextType>;
  categoryId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ServerContextType>;
  colors?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ServerContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ServerContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ServerContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ServerContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  price?: Resolver<ResolversTypes['Decimal'], ParentType, ServerContextType>;
  sizes?: Resolver<Maybe<Array<ResolversTypes['Int']>>, ParentType, ServerContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ServerContextType>;
}>;

export type ProductsResponseResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['ProductsResponse'] = ResolversParentTypes['ProductsResponse']> = ResolversObject<{
  currentPage?: Resolver<ResolversTypes['Int'], ParentType, ServerContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ServerContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ServerContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ServerContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ServerContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ServerContextType>;
}>;

export type QueryResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ServerContextType, RequireFields<QueryAddressArgs, 'id'>>;
  adminAddresses?: Resolver<Array<ResolversTypes['Address']>, ParentType, ServerContextType>;
  adminOrders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ServerContextType>;
  adminUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ServerContextType>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ServerContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ServerContextType, RequireFields<QueryCategoryArgs, 'name'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ServerContextType>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ServerContextType, RequireFields<QueryOrderArgs, 'id'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ServerContextType, RequireFields<QueryProductArgs, 'id'>>;
  products?: Resolver<ResolversTypes['ProductsResponse'], ParentType, ServerContextType, RequireFields<QueryProductsArgs, 'limit' | 'offset'>>;
  productsByCategory?: Resolver<Array<ResolversTypes['Product']>, ParentType, ServerContextType, RequireFields<QueryProductsByCategoryArgs, 'categoryId'>>;
  productsBySearch?: Resolver<Array<ResolversTypes['Product']>, ParentType, ServerContextType, RequireFields<QueryProductsBySearchArgs, 'term'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ServerContextType, RequireFields<QueryUserArgs, 'email'>>;
  userAddresses?: Resolver<Array<ResolversTypes['Address']>, ParentType, ServerContextType>;
  userOrders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ServerContextType>;
}>;

export type UserResolvers<ServerContextType = ServerContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  addresses?: Resolver<Array<ResolversTypes['Address']>, ParentType, ServerContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ServerContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ServerContextType>;
  orders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ServerContextType>;
}>;

export type Resolvers<ServerContextType = ServerContext> = ResolversObject<{
  Address?: AddressResolvers<ServerContextType>;
  AuthPayload?: AuthPayloadResolvers<ServerContextType>;
  Category?: CategoryResolvers<ServerContextType>;
  DateTime?: GraphQLScalarType;
  Decimal?: GraphQLScalarType;
  Delivery?: DeliveryResolvers<ServerContextType>;
  Mutation?: MutationResolvers<ServerContextType>;
  Order?: OrderResolvers<ServerContextType>;
  OrderItem?: OrderItemResolvers<ServerContextType>;
  Payment?: PaymentResolvers<ServerContextType>;
  PaymentIntentResponse?: PaymentIntentResponseResolvers<ServerContextType>;
  Product?: ProductResolvers<ServerContextType>;
  ProductsResponse?: ProductsResponseResolvers<ServerContextType>;
  Query?: QueryResolvers<ServerContextType>;
  User?: UserResolvers<ServerContextType>;
}>;

