import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../order.service.js';
import { UserService } from '../user.service.js';

vi.mock('../../../prisma/generated/client/client.js', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    order: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    orderItem: {
      createMany: vi.fn(),
      findMany: vi.fn(),
    },
    payment: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  })),
}));

describe('OrderService', () => {
  let orderService: OrderService;
  let mockPrisma: any;
  let mockOrderRepository: any;
  let mockOrderItemRepository: any;
  let mockPaymentRepository: any;

  beforeEach(() => {
    mockPrisma = {
      product: {
        findMany: vi.fn(),
      },
    };

    mockOrderRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findAll: vi.fn(),
      updateStatus: vi.fn(),
      updateAddress: vi.fn(),
      addItems: vi.fn(),
    };

    mockOrderItemRepository = {};

    mockPaymentRepository = {
      create: vi.fn(),
      findByOrderId: vi.fn(),
      updateStatus: vi.fn(),
    };

    orderService = new OrderService(
      mockPrisma as any,
      mockOrderRepository as any,
      mockOrderItemRepository as any,
      mockPaymentRepository as any
    );
  });

  describe('createOrder', () => {
    it('should throw error for empty items', async () => {
      await expect(
        orderService.createOrder('user1', { items: [] })
      ).rejects.toThrow('Order must contain at least one item');
    });

    it('should throw error when items exceed 50', async () => {
      const items = Array.from({ length: 51 }, (_, i) => ({
        productId: `prod${i}`,
        quantity: 1,
      }));

      await expect(
        orderService.createOrder('user1', { items })
      ).rejects.toThrow('Order cannot contain more than 50 items');
    });

    it('should throw error when products not found', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);

      await expect(
        orderService.createOrder('user1', {
          items: [{ productId: 'nonexistent', quantity: 1 }],
        })
      ).rejects.toThrow('One or more products not found');
    });

    it('should create order with valid items', async () => {
      const mockProducts = [
        { id: 'prod1', price: 100 },
        { id: 'prod2', price: 50 },
      ];
      mockPrisma.product.findMany.mockResolvedValue(mockProducts);
      mockOrderRepository.create.mockResolvedValue({ id: 1 });
      mockOrderRepository.findById.mockResolvedValue({ id: 1 });
      mockPaymentRepository.create.mockResolvedValue({ id: 1 });

      const result = await orderService.createOrder('user1', {
        items: [
          { productId: 'prod1', quantity: 2 },
          { productId: 'prod2', quantity: 1 },
        ],
      });

      expect(mockOrderRepository.create).toHaveBeenCalled();
      expect(mockPaymentRepository.create).toHaveBeenCalled();
    });
  });

  describe('getOrderById', () => {
    it('should return order by id', async () => {
      const mockOrder = { id: 1, userId: 'user1' };
      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(1);

      expect(result).toEqual(mockOrder);
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null for non-existent order', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      const result = await orderService.getOrderById(999);

      expect(result).toBeNull();
    });
  });

  describe('getUserOrders', () => {
    it('should return orders for user', async () => {
      const mockOrders = [{ id: 1 }, { id: 2 }];
      mockOrderRepository.findByUserId.mockResolvedValue(mockOrders);

      const result = await orderService.getUserOrders('user1');

      expect(result).toEqual(mockOrders);
      expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith('user1');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const mockOrder = { id: 1, status: 'processing' };
      mockOrderRepository.updateStatus.mockResolvedValue(mockOrder);

      const result = await orderService.updateOrderStatus(1, 'processing');

      expect(result).toEqual(mockOrder);
      expect(mockOrderRepository.updateStatus).toHaveBeenCalledWith(1, 'processing');
    });
  });
});

describe('UserService', () => {
  let userService: UserService;
  let mockPrisma: any;
  let mockUserRepository: any;
  let mockPasswordService: any;
  let mockTokenService: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockPasswordService = {
      hash: vi.fn(),
      compare: vi.fn(),
    };

    mockTokenService = {
      generateTokens: vi.fn().mockReturnValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }),
      verifyAccessToken: vi.fn(),
      verifyRefreshToken: vi.fn(),
    };

    userService = new UserService(
      mockPrisma as any,
      mockUserRepository as any,
      mockPasswordService as any,
      mockTokenService as any
    );
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: 'user1', email: 'test@test.com' };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.findById('user1');

      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = { id: 'user1', email: 'test@test.com' };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await userService.findByEmail('test@test.com');

      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should throw error if user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: 'existing' });

      await expect(
        userService.create('test@test.com', 'password123', 'Test User')
      ).rejects.toThrow('User already exists');
    });

    it('should create user with hashed password', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed-password');
      mockUserRepository.create.mockResolvedValue({
        id: 'new-user',
        email: 'new@test.com',
      });

      await userService.create('new@test.com', 'password123', 'New User');

      expect(mockPasswordService.hash).toHaveBeenCalledWith('password123');
      expect(mockUserRepository.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw error if user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        userService.login('notfound@test.com', 'password')
      ).rejects.toThrow('User not found');
    });

    it('should throw error if password is invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 'user1',
        email: 'test@test.com',
        passwordHash: 'hashed',
      });
      mockPasswordService.compare.mockResolvedValue(false);

      await expect(
        userService.login('test@test.com', 'wrong-password')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should return user and tokens on successful login', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 'user1',
        email: 'test@test.com',
        passwordHash: 'hashed',
        name: 'Test User',
        role: 'USER',
      });
      mockPasswordService.compare.mockResolvedValue(true);

      const result = await userService.login('test@test.com', 'password');

      expect(result.user.email).toBe('test@test.com');
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const mockUser = { id: 'user1', name: 'Updated' };
      mockUserRepository.update.mockResolvedValue(mockUser);

      const result = await userService.update('user1', { name: 'Updated' });

      expect(result).toEqual(mockUser);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      mockUserRepository.delete.mockResolvedValue({ id: 'user1' });

      await userService.delete('user1');

      expect(mockUserRepository.delete).toHaveBeenCalledWith('user1');
    });
  });
});
