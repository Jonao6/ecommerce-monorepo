import { mergeResolvers } from "@graphql-tools/merge";
import { IResolvers } from "@graphql-tools/utils";
import { productResolvers } from "./product.resolvers.js";
import { categoryResolvers } from "./category.resolvers.js";
import { userResolvers } from "./user.resolvers.js";
import { paymentResolvers } from "./payment.resolvers.js";
import { orderResolvers } from "./order.resolvers.js";
import { addressResolvers } from "./address.resolvers.js";
const resolversArray = [
  productResolvers,
  categoryResolvers,
  userResolvers,
  paymentResolvers,
  orderResolvers,
  addressResolvers,
];

export const resolvers: IResolvers = mergeResolvers(resolversArray);
