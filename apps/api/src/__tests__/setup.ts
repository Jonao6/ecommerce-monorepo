import { vi } from "vitest";

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
    address: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    category: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    delivery: {
      findUnique: vi.fn(),
    },
  })),
}));
