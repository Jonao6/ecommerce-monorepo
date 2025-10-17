import { GraphQLError } from "graphql"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import crypto from "crypto"
import { getRedisClient } from "@/redis/client.js"
import { GraphQLContext } from "../../server/context.js"

const SALT_ROUNDS = 10

export const userResolvers = {
  Query: {
    users: async (_: any, __: any, context: GraphQLContext) => {
      return context.prisma.user.findMany()
    },

    user: async (
      _: any,
      { email }: { email: string },
      context: GraphQLContext
    ) => {
      return context.prisma.user.findUnique({ where: { email } })
    },

    me: async (_: any, __: any, context: GraphQLContext) => {
      const cookieHeader = context.req?.headers?.cookie || '';
  
      const cookies: Record<string, string> = {};
       cookieHeader.split(';').forEach(c => {
      const [key, value] = c.trim().split('=');
      cookies[key] = value;
      });

      const token = cookies['accessToken'];
      if (!token) throw new GraphQLError('UNAUTHORIZED');

      const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      const user = await context.prisma.user.findUnique({
      where: { id: payload.id },
      });

      if (!user) throw new GraphQLError('UNAUTHORIZED');
      return user;
  }
},
  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: { email: string; password: string; name: string } },
      context: GraphQLContext
    ) => {
      const existingUser = await context.prisma.user.findUnique({
        where: { email: input.email },
      })

      if (existingUser) {
        throw new GraphQLError("Usuário já existe", {
          extensions: { code: "USER_ALREADY_EXISTS" },
        })
      }

      const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS)

      return context.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash: hashedPassword,
        },
      })
    },

    getUser: async (
      _: any,
      { input }: { input: { email: string; password: string } },
      context: GraphQLContext
    ) => {
      const user = await context.prisma.user.findUnique({
        where: { email: input.email },
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
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      )

      const refreshToken = crypto.randomBytes(40).toString("hex")
      const redis = await getRedisClient()
      await redis.set(`refresh_${refreshToken}`, user.id, {
        EX: 30 * 24 * 60 * 60,
      })

      context.res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      })
      context.res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })

      return {
        message: "Login bem-sucedido",
        user,
      }
    },

    logout: async (_: any, __: any, context: GraphQLContext) => {
      const refreshToken = context.req.cookies.refreshToken
      if (refreshToken) {
        const redis = await getRedisClient()
        await redis.del(`refresh_${refreshToken}`)
      }

      context.res.clearCookie("accessToken")
      context.res.clearCookie("refreshToken")
      return true
    },

    updateUser: async (
      _: any,
      { name }: { name: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new GraphQLError("Não autenticado", {
          extensions: { code: "TOKEN_NOT_FOUND" },
        })
      }

      return context.prisma.user.update({
        where: { id: context.user.id },
        data: { ...(name && { name }) },
        include: {
          addresses: true,
          orders: true,
        },
      })
    },
  },

  User: {
    addresses: (parent: any, _: any, context: GraphQLContext) =>
      context.prisma.address.findMany({ where: { userId: parent.id } }),
    orders: (parent: any, _: any, context: GraphQLContext) =>
      context.prisma.order.findMany({ where: { userId: parent.id } }),
  },

  Address: {
    user: (parent: any, _: any, context: GraphQLContext) =>
      context.prisma.user.findUnique({ where: { id: parent.userId } }),
  },
}
