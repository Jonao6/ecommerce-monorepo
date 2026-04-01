import crypto from 'crypto';
import type { ITokenService, TokenPayload } from '../interfaces/index.js';

export class AuthService {
  constructor(private tokenService: ITokenService) {}

  async login(
    userId: string,
    email: string,
    name: string,
    role: string,
    redisClient: { set: (key: string, value: string, options?: { EX: number }) => Promise<void>; del: (key: string) => Promise<void>; get: (key: string) => Promise<string | null> }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = this.tokenService.generateTokens({
      id: userId,
      email,
      name,
      role,
    });

    const refreshToken = tokens.refreshToken;
    await redisClient.set(`refresh_${refreshToken}`, userId, {
      EX: 30 * 24 * 60 * 60,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken,
    };
  }

  async logout(
    refreshToken: string,
    redisClient: { del: (key: string) => Promise<void> }
  ): Promise<void> {
    await redisClient.del(`refresh_${refreshToken}`);
  }

  async refreshAccessToken(
    refreshToken: string,
    redisClient: { get: (key: string) => Promise<string | null> }
  ): Promise<string | null> {
    const userId = await redisClient.get(`refresh_${refreshToken}`);
    return userId;
  }

  verifyToken(token: string): TokenPayload {
    return this.tokenService.verifyAccessToken(token);
  }
}
