import { GraphQLError } from "graphql"
import { Context } from "../server/context.js"
import { Permission, Role, hasPermission } from "./rbac.js"
import { randomUUID } from "node:crypto"

export const requireAuth = (context: Context) => {
  if (!context.user) {
    throw new GraphQLError("Authentication required", {
      extensions: { code: "UNAUTHORIZED" },
    })
  }
  return context.user
}

export const requireAdmin = (context: Context) => {
  const user = requireAuth(context)
  if (user.role !== Role.ADMIN) {
    throw new GraphQLError("Admin access required", {
      extensions: { code: "FORBIDDEN" },
    })
  }
  return user
}

export const requirePermission = (permission: Permission) => {
  return (context: Context) => {
    const user = requireAuth(context)

    if (!hasPermission(user.role as Role, permission)) {
      throw new GraphQLError("Insufficient permissions", {
        extensions: {
          code: "FORBIDDEN",
          required: permission,
          userRole: user.role,
        },
      })
    }

    return user
  }
}

export const requireOwnershipOrPermission = (permission: Permission) => {
  return (context: Context, resourceUserId: string) => {
    const user = requireAuth(context)

    if (user.id === resourceUserId) {
      return user
    }

    return requirePermission(permission)(context)
  }
}

export const validateOwnership = (context: Context, resourceUserId: string) => {
  const user = requireAuth(context)
  if (user.id !== resourceUserId && user.role !== Role.ADMIN) {
    throw new GraphQLError(
      "Access denied: You can only access your own resources",
      {
        extensions: { code: "FORBIDDEN" },
      },
    )
  }
  return user
}

export const withPermission = (permission: Permission) => {
  return (resolver: any) => {
    return async (parent: any, args: any, context: Context, info: any) => {
      requirePermission(permission)(context)
      return resolver(parent, args, context, info)
    }
  }
}

export const withOwnershipOrPermission = (permission: Permission) => {
  return (resolver: any) => {
    return async (parent: any, args: any, context: Context, info: any) => {
      const user = requireAuth(context)

      let resourceUserId: string | undefined

      if (args?.userId) {
        resourceUserId = args.userId
      }

      return resolver(parent, args, context, info)
    }
  }
}

export const gerenateIdempotencyKey = (orderId: number) => {
  const uuid = randomUUID()

  const idempotencyKey = `order_${orderId}_${uuid}`

  return idempotencyKey
}