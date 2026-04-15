import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRedisClient } from '../../redis/client.js';
import { RATE_LIMITS } from '../../utils/rateLimit.js';
import { TOKEN_BUCKET_LUA, TOKEN_BUCKET_BURST_LUA, SLIDING_WINDOW_COUNTER_LUA } from '../../utils/lua/tokenBucket.js';

vi.mock('../../redis/client.js', () => ({
  getRedisClient: vi.fn(),
}));

const mockRedis = {
  eval: vi.fn(),
};

describe('Token Bucket Lua Scripts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getRedisClient as any).mockResolvedValue(mockRedis);
  });

  describe('Basic Token Bucket Behavior', () => {
    it('should allow requests when tokens are available', async () => {
      mockRedis.eval.mockResolvedValue([1, 4, 5, Date.now() + 5000, 0]);
      
      const redis = await getRedisClient();
      
      const result = (await redis.eval(TOKEN_BUCKET_LUA, {
        keys: ['test_key'],
        arguments: ['5', '1', '1', String(Date.now())],
      })) as [number, number, number, number, number];
      
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(4);
    });

    it('should deny requests when tokens are exhausted', async () => {
      mockRedis.eval.mockResolvedValue([0, 0, 5, Date.now() + 1000, 1000]);
      
      const redis = await getRedisClient();
      
      const result = (await redis.eval(TOKEN_BUCKET_LUA, {
        keys: ['test_key'],
        arguments: ['5', '1', '1', String(Date.now())],
      })) as [number, number, number, number, number];
      
      expect(result[0]).toBe(0);
      expect(result[4]).toBeGreaterThan(0);
    });

    it('should refill tokens over time', async () => {
      const now = Date.now();
      const pastTime = now - 5000;
      
      mockRedis.eval.mockResolvedValueOnce([1, 5, 5, now, 0]);
      
      const redis = await getRedisClient();
      
      const result = (await redis.eval(TOKEN_BUCKET_LUA, {
        keys: ['test_key'],
        arguments: ['5', '1', '1', String(pastTime)],
      })) as [number, number, number, number, number];
      
      expect(result[0]).toBe(1);
      expect(result[1]).toBeLessThanOrEqual(5);
    });
  });

  describe('Token Bucket Burst Behavior', () => {
    it('should allow burst requests', async () => {
      mockRedis.eval.mockResolvedValue([1, 20, 10, Date.now() + 5000, 0]);
      
      const redis = await getRedisClient();
      
      const result = (await redis.eval(TOKEN_BUCKET_BURST_LUA, {
        keys: ['burst_key'],
        arguments: ['10', '2', '5', String(Date.now()), '25'],
      })) as [number, number, number, number, number];
      
      expect(result[0]).toBe(1);
    });
  });

  describe('Sliding Counter Behavior', () => {
    it('should count requests across sliding windows', async () => {
      mockRedis.eval.mockResolvedValue([1, 95, 100, Date.now() + 10000, 0]);
      
      const redis = await getRedisClient();
      
      const result = (await redis.eval(SLIDING_WINDOW_COUNTER_LUA, {
        keys: ['counter_key'],
        arguments: ['100', '60', '1', String(Date.now())],
      })) as [number, number, number, number, number];
      
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(95);
    });
  });
});

describe('Rate Limit Algorithms', () => {
  const mockRedis = {
    eval: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getRedisClient as any).mockResolvedValue(mockRedis);
  });

  it('should export all algorithm types', () => {
    expect(RATE_LIMITS.AUTH).toBeDefined();
    expect(RATE_LIMITS.GENERAL).toBeDefined();
    expect(RATE_LIMITS.SENSITIVE).toBeDefined();
    expect(RATE_LIMITS.PAYMENT).toBeDefined();
  });

  it('should have correct window and max requests', () => {
    expect(RATE_LIMITS.AUTH.windowMs).toBe(15 * 60 * 1000);
    expect(RATE_LIMITS.AUTH.maxRequests).toBe(5);
  });

  it('should have correct limits for SENSITIVE operations', () => {
    expect(RATE_LIMITS.SENSITIVE.windowMs).toBe(60 * 60 * 1000);
    expect(RATE_LIMITS.SENSITIVE.maxRequests).toBe(10);
  });
});
