import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/index.js"
import { Request, Response } from "express";

type UserPayload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

export interface GraphQLContext {
  req: Request;
  res: Response;
  prisma: typeof prisma;
  user: UserPayload | null;
}

function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded as UserPayload;
  } catch {
    return null;
  }
}

export const context = async ({ req, res }: { req: Request; res: Response }): Promise<GraphQLContext> => {
  let user: UserPayload | null = null;

  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    user = verifyToken(token);
  }

  if (!user && req.cookies?.accessToken) {
    user = verifyToken(req.cookies.accessToken);
  }

  return { req, res, prisma, user };
};
