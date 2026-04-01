import { PrismaClient } from '../../prisma/generated/client/client.js';
import type { 
  IUserRepository, 
  IOrderRepository, 
  IOrderItemRepository,
  IPaymentRepository,
  ICategoryRepository,
  IProductRepository,
  IPasswordService,
  ITokenService 
} from '../interfaces/index.js';
import { BcryptPasswordService } from './password.service.js';
import { JwtTokenService } from './token.service.js';
import { PrismaUserRepository } from './repositories/prisma-user.repository.js';
import { PrismaOrderRepository } from './repositories/prisma-order.repository.js';
import { PrismaPaymentRepository } from './repositories/prisma-payment.repository.js';

export interface DIContainer {
  prisma: PrismaClient;
  userRepository: IUserRepository;
  orderRepository: IOrderRepository;
  orderItemRepository: IOrderItemRepository;
  paymentRepository: IPaymentRepository;
  categoryRepository: ICategoryRepository;
  productRepository: IProductRepository;
  passwordService: IPasswordService;
  tokenService: ITokenService;
}

let container: DIContainer | null = null;

export const createContainer = (prisma: PrismaClient): DIContainer => {
  if (container) {
    return container;
  }

  const passwordService: IPasswordService = new BcryptPasswordService();
  const tokenService: ITokenService = new JwtTokenService();

  const userRepository: IUserRepository = new PrismaUserRepository(prisma);
  const orderRepository: IOrderRepository = new PrismaOrderRepository(prisma);
  const paymentRepository: IPaymentRepository = new PrismaPaymentRepository(prisma);

  container = {
    prisma,
    userRepository,
    orderRepository,
    orderItemRepository: {} as IOrderItemRepository,
    paymentRepository,
    categoryRepository: {} as ICategoryRepository,
    productRepository: {} as IProductRepository,
    passwordService,
    tokenService,
  };

  return container;
};

export const getContainer = (): DIContainer => {
  if (!container) {
    throw new Error('Container not initialized. Call createContainer first.');
  }
  return container;
};
