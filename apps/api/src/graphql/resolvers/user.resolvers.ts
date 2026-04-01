import { GraphQLError } from "graphql"
import { Context } from "../../server/context.js"
import { getRedisClient } from "../../redis/client.js"
import { Resolvers } from "../types.js"
import { removeNulls } from "@/utils/cleanInput.js"
import {
  requireAuth,
  requireAdmin,
  requireOwnershipOrPermission,
} from "../../utils/auth.js"
import {
  validateEmail,
  validatePassword,
  validateStringLength,
  sanitizeHtml,
} from "../../utils/validation.js"
import { Permission } from "@/utils/rbac.js"
import { UserService } from "../../services/user.service.js"
import { JwtTokenService } from "../../lib/token.service.js"
import { BcryptPasswordService } from "../../lib/password.service.js"
import { PrismaUserRepository } from "../../lib/repositories/prisma-user.repository.js"
import { prisma } from "../../lib/index.js"
import { Loaders } from "../../lib/loaders.js"

const userRepository = new PrismaUserRepository(prisma)
const passwordService = new BcryptPasswordService()
const tokenService = new JwtTokenService()
const userService = new UserService(prisma, userRepository, passwordService, tokenService)

export const userResolvers: Resolvers = {
  Query: {
    adminUsers: async (_: any, __: any, context: Context) => {
      requireAdmin(context)
      return context.prisma.user.findMany({
        include: {
          addresses: true,
          orders: {
            include: {
              items: { include: { product: true } },
              address: true,
              payment: true,
              delivery: true,
            },
          },
        },
      }) as any
    },

    user: async (_: any, { email }: { email: string }, context: Context) => {
      const user = requireAuth(context)

      const foundUser = await userService.findByEmail(email)

      if (!foundUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "USER_NOT_FOUND" },
        })
      }

      requireOwnershipOrPermission(Permission.READ_OWN_PROFILE)(
        context,
        foundUser.id,
      )

      return foundUser as any
    },

    me: async (_: any, __: any, context: Context): Promise<any> => {
      const user = requireAuth(context)
      return user
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: { email: string; password: string; name: string } },
      context: Context,
    ) => {
      if (!validateEmail(input.email)) {
        throw new GraphQLError("Invalid email format", {
          extensions: { code: "INVALID_EMAIL" },
        })
      }

      const passwordValidation = validatePassword(input.password)
      if (!passwordValidation.isValid) {
        throw new GraphQLError(passwordValidation.errors.join(", "), {
          extensions: { code: "INVALID_PASSWORD" },
        })
      }

      const sanitizedName = sanitizeHtml(input.name)
      const validName = validateStringLength(sanitizedName, 2, 100, "name")

      return userService.create(input.email, input.password, validName) as any
    },

    getUser: async (
      _: any,
      { input }: { input: { email: string; password: string } },
      context: Context,
    ) => {
      const result = await userService.login(input.email, input.password)

      const redis = await getRedisClient()
      await redis.set(`refresh_${result.refreshToken}`, result.user.id, {
        EX: 30 * 24 * 60 * 60,
      })

      context.res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "none",
        path: "/",
      })
      context.res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        path: "/",
      })

      return {
        message: result.message,
        user: result.user,
      }
    },

    logout: async (_: any, __: any, context: Context) => {
      const refreshToken = context.req.cookies.refreshToken
      if (refreshToken) {
        const redis = await getRedisClient()
        await redis.del(`refresh_${refreshToken}`)
      }

      context.res.clearCookie("accessToken")
      context.res.clearCookie("refreshToken")
      return true
    },

    updateUser: async (_: any, { input }, context: Context) => {
      const user = requireAuth(context)

      if (input.email && !validateEmail(input.email)) {
        throw new GraphQLError("Invalid email format", {
          extensions: { code: "INVALID_EMAIL" },
        })
      }

      if (input.name) {
        const sanitizedName = sanitizeHtml(input.name)
        input.name = validateStringLength(sanitizedName, 2, 100, "name")
      }

      const dataCleaned = removeNulls(input)

      return userService.update(user.id, dataCleaned) as any
    },
    deleteUser: async (_: any, { id }, context: Context) => {
      requireAuth(context)

      requireOwnershipOrPermission(Permission.DELETE_ANY_USER)(context, id)

      const existingUser = await userService.findById(id)

      if (!existingUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "USER_NOT_FOUND" },
        })
      }

      await userService.delete(id)

      return true
    },
  },
  User: {
    addresses: async (parent, _, context) => {
      if ((parent as any).addresses) return (parent as any).addresses;
      return context.prisma.address.findMany({ where: { userId: parent.id } });
    },
    orders: async (parent, _, context) => {
      if ((parent as any).orders) return (parent as any).orders;
      return context.prisma.order.findMany({
        where: { userId: parent.id },
        include: {
          items: { include: { product: true } },
          address: true,
          payment: true,
          delivery: true,
        },
      });
    },
  },

  Address: {
    user: async (parent, _, context) => {
      if ((parent as any).user) return (parent as any).user;
      const loaders = Loaders.getInstance();
      return loaders.userLoader.load(parent.userId);
    },
  },
}
