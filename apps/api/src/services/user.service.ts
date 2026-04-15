import { GraphQLError } from 'graphql';
import { PrismaClient, User } from '../../prisma/generated/client/client.js';
import type { IUserRepository, IPasswordService, ITokenService } from '../interfaces/index.js';

export class UserService {
  constructor(
    private prisma: PrismaClient,
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(email: string, password: string, name: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email.toLowerCase());
    
    if (existingUser) {
      throw new GraphQLError('User already exists', {
        extensions: { code: 'USER_ALREADY_EXISTS' },
      });
    }

    const passwordHash = await this.passwordService.hash(password);

    return this.userRepository.create({
      email: email.toLowerCase(),
      password,
      name,
      passwordHash,
    });
  }

  async update(id: string, data: { email?: string; name?: string }): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async delete(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }

  async login(email: string, password: string): Promise<{ message: string; user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'USER_NOT_FOUND' },
      });
    }

    const isValidPassword = await this.passwordService.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      throw new GraphQLError('Invalid credentials', {
        extensions: { code: 'INVALID_CREDENTIALS' },
      });
    }

    const tokens = this.tokenService.generateTokens({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      message: 'Login successful',
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
