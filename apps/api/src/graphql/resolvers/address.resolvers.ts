import { GraphQLError } from "graphql"
import { prisma } from "../../lib/index.js"

export const addressResolvers = {
  Query: {
    addresses: async () => {
      return await prisma.address.findMany()
    },

    address: async (_, { id }) => {
      return await prisma.address.findUnique({
        where: { id: Number(id) },
      })
    },

    userAddresses: async (_, { userId }) => {
      return await prisma.address.findMany({
        where: { userId: userId },
      })
    },
  },

  Mutation: {
    createAddress: async (_, { input }) => {
      const { userId, street, city, state, postalCode, country, complements, neighbor, streetNumber } = input
      const MAX_ADDRESSES = 6

      const count = await prisma.address.count({ where: { userId } })

      if (count >= MAX_ADDRESSES) {
        throw new GraphQLError(`Limite máximo de ${MAX_ADDRESSES} endereços atingido.`, {
          extensions: { code: "ADDRESS_LIMIT_REACHED"}
        })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new GraphQLError("Usuário não encontrado.")
      }

      const newAddress = await prisma.address.create({
        data: {
          userId: userId,
          street,
          city,
          streetNumber,
          complements,
          neighbor,
          state,
          postalCode,
          country,
        },
      })

      return newAddress
    },

    updateAddress: async (_, { id, input }) => {
      const existingAddress = await prisma.address.findUnique({
        where: { id: Number(id) },
      })

      if (!existingAddress) {
        throw new GraphQLError("Endereço não encontrado.")
      }

      const updatedAddress = await prisma.address.update({
        where: { id: Number(id) },
        data: {
          ...input,
        },
      })

      return updatedAddress
    },

    deleteAddress: async (_, { id }) => {
      const existingAddress = await prisma.address.findUnique({
        where: { id: Number(id) },
      })

      if (!existingAddress) {
        throw new GraphQLError("Endereço não encontrado.")
      }

      await prisma.address.delete({
        where: { id: Number(id) },
      })

      return true
    },
  },
  Address: {
    user: async (parent) => {
      return await prisma.user.findUnique({
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
