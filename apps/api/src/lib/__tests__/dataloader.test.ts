import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataLoader } from '../dataloader.js';

describe('DataLoader', () => {
  const mockFetchFn = vi.fn();

  beforeEach(() => {
    mockFetchFn.mockReset();
  });

  it('should call fetchFn with keys', async () => {
    mockFetchFn.mockResolvedValue(['value1', 'value2']);
    const loader = new DataLoader(mockFetchFn);

    const result = await loader.load('key1');

    expect(mockFetchFn).toHaveBeenCalledWith(['key1']);
    expect(result).toBe('value1');
  });

  it('should return correct value for each key', async () => {
    mockFetchFn.mockResolvedValue(['value1', 'value2', 'value3']);
    const loader = new DataLoader(mockFetchFn);

    const results = await Promise.all([
      loader.load('key1'),
      loader.load('key2'),
      loader.load('key3'),
    ]);

    expect(results).toEqual(['value1', 'value2', 'value3']);
  });

  it('should batch multiple loads into single fetch', async () => {
    mockFetchFn.mockResolvedValue(['value1', 'value2', 'value3']);
    const loader = new DataLoader(mockFetchFn);

    await Promise.all([
      loader.load('key1'),
      loader.load('key2'),
      loader.load('key3'),
    ]);

    expect(mockFetchFn).toHaveBeenCalledTimes(1);
    expect(mockFetchFn).toHaveBeenCalledWith(['key1', 'key2', 'key3']);
  });

  it('should cache results after first load', async () => {
    mockFetchFn.mockResolvedValue(['value1']);
    const loader = new DataLoader(mockFetchFn);

    await loader.load('key1');
    await loader.load('key1');

    expect(mockFetchFn).toHaveBeenCalledTimes(1);
  });

  it('should return null for missing keys', async () => {
    mockFetchFn.mockResolvedValue([null]);
    const loader = new DataLoader(mockFetchFn);

    const result = await loader.load('nonexistent');

    expect(result).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Fetch failed');
    mockFetchFn.mockRejectedValue(error);
    const loader = new DataLoader(mockFetchFn);

    await expect(loader.load('key1')).rejects.toThrow('Fetch failed');
  });

  it('should clear cache', async () => {
    mockFetchFn.mockResolvedValue(['value1', 'value2']);
    const loader = new DataLoader(mockFetchFn);

    await loader.load('key1');
    loader.clear();
    await loader.load('key1');

    expect(mockFetchFn).toHaveBeenCalledTimes(2);
  });

  it('should work without cache', async () => {
    mockFetchFn.mockResolvedValue(['value1', 'value2']);
    const loader = new DataLoader(mockFetchFn, { cache: false });

    await loader.load('key1');
    await loader.load('key1');

    expect(mockFetchFn).toHaveBeenCalledTimes(2);
  });
});
