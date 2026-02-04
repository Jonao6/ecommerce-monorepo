import { GraphQLError } from "graphql"
import { Context } from "../../server/context.js"
import { getRedisClient } from "../../redis/client.js"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import crypto from "crypto"
import { Resolvers } from "../types.js"
import { removeNulls } from "@/utils/cleanInput.js"
import {
  requireAuth,
  requireAdmin,
  requireOwnershipOrPermission,
  requirePermission,
} from "../../utils/auth.js"
import {
  validateEmail,
  validatePassword,
  validateStringLength,
  sanitizeHtml,
} from "../../utils/validation.js"
import { Permission } from "@/utils/rbac.js"

const SALT_ROUNDS = 10

export const userResolvers: Resolvers = {
  Query: {
    adminUsers: async (_: any, __: any, context: Context) => {
      requireAdmin(context)
      return context.prisma.user.findMany()
    },

    user: async (_: any, { email }: { email: string }, context: Context) => {
      const user = requireAuth(context)

      const foundUser = await context.prisma.user.findUnique({
        where: { email },
      })

      if (!foundUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "USER_NOT_FOUND" },
        })
      }

      requireOwnershipOrPermission(Permission.READ_OWN_PROFILE)(
        context,
        foundUser.id,
      )

      return foundUser
    },

    me: async (_: any, __: any, context: Context) => {
      const cookieHeader = context.req?.headers?.cookie || ""

      const cookies: Record<string, string> = {}
      cookieHeader.split(";").forEach((c) => {
        const [key, value] = c.trim().split("=")
        cookies[key] = value
      })
      const token = cookies["accessToken"]
      if (!token) throw new GraphQLError("UNAUTHORIZED")

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
      const user = await context.prisma.user.findUnique({
        where: { id: payload.id },
      })

      if (!user) throw new GraphQLError("UNAUTHORIZED")
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

      const existingUser = await context.prisma.user.findUnique({
        where: { email: input.email },
      })

      if (existingUser) {
        throw new GraphQLError("User already exists", {
          extensions: { code: "USER_ALREADY_EXISTS" },
        })
      }
      const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS)
      return context.prisma.user.create({
        data: {
          name: validName,
          email: input.email.toLowerCase().trim(),
          passwordHash: hashedPassword,
        },
      })
    },

    getUser: async (
      _: any,
      { input }: { input: { email: string; password: string } },
      context: Context,
    ) => {
      const user = await context.prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
      })
      if (!user) {
        throw new GraphQLError("Usuário não encontrado", {
          extensions: { code: "USER_NOT_FOUND" },
        })
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash)
      if (!valid) {
        throw new GraphQLError("Dado inválido", {
          extensions: { code: "INVALID_DATA" },
        })
      }
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" },
      )

      const redis = await getRedisClient()

      const refreshToken = crypto.randomBytes(40).toString("hex")
      await redis.set(`refresh_${refreshToken}`, user.id, {
        EX: 30 * 24 * 60 * 60,
      })

      context.res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
        path: "/",
      })
      context.res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        path: "/",
      })

      return {
        message: "Login bem-sucedido",
        user,
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

      return context.prisma.user.update({
        where: { id: user.id },
        data: {
          ...dataCleaned,
        },
      })
    },
    deleteUser: async (_: any, { id }, context: Context) => {
      const user = requireAuth(context)

      requireOwnershipOrPermission(Permission.DELETE_ANY_USER)(context, id)

      const existingUser = await context.prisma.user.findUnique({
        where: { id },
      })

      if (!existingUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "USER_NOT_FOUND" },
        })
      }

      await context.prisma.user.delete({
        where: { id },
      })

      return true
    },
  },
  User: {
    addresses: (parent, _, context: Context) =>
      context.prisma.address.findMany({ where: { userId: parent.id } }),
    orders: (parent: any, _: any, context: Context) =>
      context.prisma.order.findMany({ where: { userId: parent.id } }),
  },

  Address: {
    user: (parent, _, context: Context) =>
      context.prisma.user.findUniqueOrThrow({ where: { id: parent.userId } }),
  },
}
