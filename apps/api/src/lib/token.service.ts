import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import type { ITokenService, TokenPayload } from '../interfaces/index.js';

export class JwtTokenService implements ITokenService {
  private readonly jwtSecret: string;
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiryDays = 30;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-change-me';
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  generateTokens(payload: TokenPayload): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(),
    };
  }

  verifyAccessToken(token: string): TokenPayload {
    const payload = jwt.verify(token, this.jwtSecret) as JwtPayload;
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  }

  verifyRefreshToken(token: string): string | null {
    return null;
  }
}
