import { mergeTypeDefs } from "@graphql-tools/merge";
import { allTypeDefs } from "./type-defs.js";

export const typeDefs = mergeTypeDefs([allTypeDefs]);
