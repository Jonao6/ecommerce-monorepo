import jwt, { JwtPayload } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { prisma } from "../lib/index.js"
import { Request, Response } from "express";
import { Role as UserRole } from "../utils/rbac.js";
import type { RateLimitInfo } from "../utils/rateLimit.js";
import { RATE_LIMITS } from "../utils/rateLimit.js";

type UserPayload = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export interface Context {
  req: Request;
  res: Response;
  prisma: typeof prisma;
  user: UserPayload | null;
  applyRateLimit?: (type?: keyof typeof RATE_LIMITS) => Promise<RateLimitInfo>;
  RateLimitUtils?: {
    getMetrics: () => Record<string, any>;
    clearRateLimit: (identifier: string) => Promise<void>;
    getRateLimitInfo: (identifier: string, windowMs: number) => Promise<RateLimitInfo | null>;
  };
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

  return { req, res, prisma, user };
};