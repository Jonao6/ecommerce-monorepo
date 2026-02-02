import { GraphQLError } from "graphql"
import { prisma } from "../../lib/index.js"
import { Resolvers } from "../types.js"
import { Context } from "../../server/context.js"
import { removeNulls } from "@/utils/cleanInput.js"
import { requireOwnershipOrPermission, requirePermission } from "../../utils/auth.js"
import { Permission } from "../../utils/rbac.js"
import { 
  validateStringLength,
  validatePostalCode,
  sanitizeHtml
} from "../../utils/validation.js"

export const addressResolvers: Resolvers = {
  Query: {
    adminAddresses: async (_: any, __: any, context: Context) => {
      const user = requirePermission(Permission.READ_ALL_ADDRESSES)(context);
      return await context.prisma.address.findMany();
    },

    address: async (_: any, { id }: { id: string }, context: Context) => {
      const user = requirePermission(Permission.READ_OWN_ADDRESSES)(context);
      const address = await prisma.address.findUnique({
        where: { id: Number(id) },
      });
      
      if (!address) {
        throw new GraphQLError("Address not found", {
          extensions: { code: "NOT_FOUND" }
        });
      }
      
      requireOwnershipOrPermission(Permission.UPDATE_OWN_ADDRESS)(context, address.userId);
      
      return address;
    },

    userAddresses: async (_: any, __: any, context: Context) => {
      const user = requirePermission(Permission.READ_OWN_ADDRESSES)(context);
      
      return await context.prisma.address.findMany({
        where: { userId: user.id },
      });
    },
  },

  Mutation: {
    createAddress: async (_, { input }, context) => {
      const user = requirePermission(Permission.CREATE_OWN_ADDRESS)(context);
      const {
        street,
        city,
        state,
        postalCode,
        country,
        complements,
        neighbor,
        streetNumber,
      } = input
      const MAX_ADDRESSES = 6

      const validStreet = validateStringLength(sanitizeHtml(street), 5, 200, "street");
      const validCity = validateStringLength(sanitizeHtml(city), 2, 100, "city");
      const validState = validateStringLength(sanitizeHtml(state), 2, 50, "state");
      const validCountry = validateStringLength(sanitizeHtml(country), 2, 100, "country");
      const validStreetNumber = validateStringLength(sanitizeHtml(streetNumber), 1, 20, "streetNumber");
      
      if (!validatePostalCode(postalCode, country)) {
        throw new GraphQLError("Invalid postal code format", {
          extensions: { code: "INVALID_POSTAL_CODE" }
        });
      }

      let validComplements: string | undefined;
      if (complements) {
        validComplements = validateStringLength(sanitizeHtml(complements), 0, 200, "complements");
      }
      
      let validNeighbor: string | undefined;
      if (neighbor) {
        validNeighbor = validateStringLength(sanitizeHtml(neighbor), 2, 100, "neighbor");
      }

      const count = await context.prisma.address.count({ where: { userId: user.id } })

      if (count >= MAX_ADDRESSES) {
        throw new GraphQLError(
          `Maximum of ${MAX_ADDRESSES} addresses reached.`,
          {
            extensions: { code: "ADDRESS_LIMIT_REACHED" },
          }
        )
      }

      const existingUser = await context.prisma.user.findUnique({
        where: { id: user.id },
      })

      if (!existingUser) {
        throw new GraphQLError("User not found.", {
          extensions: { code: "USER_NOT_FOUND" }
        });
      }

      const newAddress = await context.prisma.address.create({
        data: {
          userId: user.id,
          street: validStreet,
          city: validCity,
          streetNumber: validStreetNumber,
          complements: validComplements || "",
          neighbor: validNeighbor || "",
          state: validState,
          postalCode: postalCode.trim(),
          country: validCountry,
        },
      })

      return newAddress
    },

    updateAddress: async (_, { id, input }, context) => {

      const existingAddress = await prisma.address.findUnique({
        where: { id: Number(id) },
      })

      if (!existingAddress) {
        throw new GraphQLError("Address not found.", {
          extensions: { code: "ADDRESS_NOT_FOUND" }
        });
      }

     requireOwnershipOrPermission(Permission.UPDATE_OWN_ADDRESS)(context, existingAddress.userId);
      
      const dataCleaned = removeNulls(input)
      const updatedAddress = await prisma.address.update({
        where: { id: Number(id) },
        data: {
          ...dataCleaned,
        },
      })

      return updatedAddress
    },

    deleteAddress: async (_, { id }, context) => {
      const existingAddress = await prisma.address.findUnique({
        where: { id: Number(id) },
      })

      if (!existingAddress) {
        throw new GraphQLError("Address not found.", {
          extensions: { code: "ADDRESS_NOT_FOUND" }
        });
      }
      
      requireOwnershipOrPermission(Permission.DELETE_OWN_ADDRESS)(context, existingAddress.userId);

      await prisma.address.delete({
        where: { id: Number(id) },
      })

      return true
    },
  },
  Address: {
    user: async (parent) => {
      return await prisma.user.findUniqueOrThrow({
        where: { id: parent.userId },
      })
    },
  },

  User: {
    addresses: async (parent) => {
      return await prisma.address.findMany({
        where: { userId: parent.id },
      })
    },
  },
}
