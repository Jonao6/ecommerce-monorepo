import { PrismaClient } from '../../prisma/generated/client/client.js';
import { DataLoader } from './dataloader.js';

export class Loaders {
  private static loaders: Loaders | null = null;
  
  public userLoader: DataLoader<string, any>;
  public productLoader: DataLoader<string, any>;
  public addressLoader: DataLoader<number, any>;
  public orderLoader: DataLoader<number, any>;
  public categoryLoader: DataLoader<number, any>;

  constructor(private prisma: PrismaClient) {
    this.userLoader = new DataLoader(
      async (ids: string[]) => {
        const users = await this.prisma.user.findMany({
          where: { id: { in: ids } },
        });
        return ids.map((id) => users.find((u) => u.id === id) ?? null);
      }
    );

    this.productLoader = new DataLoader(
      async (ids: string[]) => {
        const products = await this.prisma.product.findMany({
          where: { id: { in: ids } },
        });
        return ids.map((id) => products.find((p) => p.id === id) ?? null);
      }
    );

    this.addressLoader = new DataLoader(
      async (ids: number[]) => {
        const addresses = await this.prisma.address.findMany({
          where: { id: { in: ids } },
        });
        return ids.map((id) => addresses.find((a) => a.id === id) ?? null);
      }
    );

    this.orderLoader = new DataLoader(
      async (ids: number[]) => {
        const orders = await this.prisma.order.findMany({
          where: { id: { in: ids } },
        });
        return ids.map((id) => orders.find((o) => o.id === id) ?? null);
      }
    );

    this.categoryLoader = new DataLoader(
      async (ids: number[]) => {
        const categories = await this.prisma.category.findMany({
          where: { id: { in: ids } },
        });
        return ids.map((id) => categories.find((c) => c.id === id) ?? null);
      }
    );
  }

  static init(prisma: PrismaClient): Loaders {
    if (!Loaders.loaders) {
      Loaders.loaders = new Loaders(prisma);
    }
    return Loaders.loaders;
  }

  static getInstance(): Loaders {
    if (!Loaders.loaders) {
      throw new Error('Loaders not initialized. Call init() first.');
    }
    return Loaders.loaders;
  }
}
