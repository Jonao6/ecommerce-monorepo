export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(): string;
  generateTokens(payload: TokenPayload): { accessToken: string; refreshToken: string };
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): string | null;
}

export interface AuthPayloadResult {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  validateCredentials(email: string, password: string): Promise<{ userId: string; passwordHash: string } | null>;
  generateTokens(userId: string, email: string, name: string, role: string): AuthPayloadResult;
  verifyAccessToken(token: string): TokenPayload;
  storeRefreshToken(userId: string, refreshToken: string): Promise<void>;
  removeRefreshToken(refreshToken: string): Promise<void>;
  getUserIdFromRefreshToken(refreshToken: string): Promise<string | null>;
}

export interface IUserService {
  findById(id: string): Promise<import('../../prisma/generated/client/client.js').User | null>;
  findByEmail(email: string): Promise<import('../../prisma/generated/client/client.js').User | null>;
  create(email: string, password: string, name: string): Promise<import('../../prisma/generated/client/client.js').User>;
  update(id: string, data: { email?: string; name?: string }): Promise<import('../../prisma/generated/client/client.js').User>;
  delete(id: string): Promise<import('../../prisma/generated/client/client.js').User>;
}
