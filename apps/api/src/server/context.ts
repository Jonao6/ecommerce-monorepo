import jwt, { JwtPayload } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { prisma } from "../lib/index.js"
import { Request, Response } from "express";
import { Role as UserRole } from "../utils/rbac.js";
import { applyRateLimit, RATE_LIMITS, RateLimitInfo, RateLimitUtils } from "@/utils/rateLimit.js";

type UserPayload = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  iat: number;
  exp: number;
};

type RateLimitUtilsCtx = {
  getMetrics: () => ReturnType<typeof RateLimitUtils.getAllMetrics>;
  clearRateLimit: (identifier: string) => ReturnType<typeof RateLimitUtils.clearRateLimit>;
  getRateLimitInfo: (
    identifier: string,
    windowMs: number
  ) => ReturnType<typeof RateLimitUtils.getRateLimitInfo>;
};

type RateLimitType = keyof typeof RATE_LIMITS;

export interface Context {
  req: Request;
  res: Response;
  prisma: typeof prisma;
  user: UserPayload | null;
  applyRateLimit: (type?: RateLimitType) => Promise<RateLimitInfo>;
  rateLimitUtils: RateLimitUtilsCtx;
}

function verifyToken(token: string): UserPayload {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded.id || !decoded.email) {
      throw new Error("Invalid token payload");
    }
    return decoded as UserPayload;
  } catch (error) {
    throw new GraphQLError("Invalid or expired token", {
      extensions: { code: "INVALID_TOKEN" }
    });
  }
}

export const context = async ({ req, res }: { req: Request; res: Response }): Promise<Context> => {
  let user: UserPayload | null = null;

  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      user = verifyToken(token);
    } catch {
      user = null;
    }
  }

  if (!user && req.cookies?.accessToken) {
    try {
      user = verifyToken(req.cookies.accessToken);
    } catch {
      user = null;
    }
  }

  const base = { req, res, prisma, user };

  return {
    ...base,

    applyRateLimit: (type: RateLimitType = "GENERAL") => applyRateLimit(base, type),

    rateLimitUtils: {
      getMetrics: () => RateLimitUtils.getAllMetrics(),
      clearRateLimit: (identifier: string) => RateLimitUtils.clearRateLimit(identifier),
      getRateLimitInfo: (identifier: string, windowMs: number) =>
        RateLimitUtils.getRateLimitInfo(identifier, windowMs),
    },
  };
};
