import { GraphQLError } from 'graphql';
import { PrismaClient } from '../../../prisma/generated/client/client.js';

export abstract class BaseFieldResolver<TParent> {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  protected async safeFind<T>(
    promise: Promise<T | null>,
    fallback: T | null = null
  ): Promise<T | null> {
    try {
      return await promise;
    } catch (error) {
      console.error('Field resolver error:', error);
      return fallback;
    }
  }

  protected async safeFindOrThrow<T>(
    promise: Promise<T | null>,
    errorMessage: string,
    errorCode: string = 'NOT_FOUND'
  ): Promise<T> {
    try {
      const result = await promise;
      if (!result) {
        throw new GraphQLError(errorMessage, {
          extensions: { code: errorCode },
        });
      }
      return result;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError(errorMessage, {
        extensions: { code: errorCode },
      });
    }
  }

  protected requireField<T>(value: T | null | undefined, fieldName: string): T {
    if (value === null || value === undefined) {
      throw new GraphQLError(`${fieldName} is required`, {
        extensions: { code: 'REQUIRED_FIELD' },
      });
    }
    return value;
  }
}

export const createFieldResolver = <TParent>(
  resolver: (parent: TParent, prisma: PrismaClient) => Promise<any>
) => {
  return async (parent: TParent, _: any, context: any) => {
    return resolver(parent, context.prisma);
  };
};
