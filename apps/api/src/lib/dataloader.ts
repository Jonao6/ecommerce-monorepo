export class DataLoader<K, V> {
  private cache = new Map<K, V>();
  private cachePromises = new Map<K, Promise<V>>();
  private pending = new Map<K, { resolve: (v: V) => void; reject: (e: Error) => void }>();
  private scheduled = false;
  
  constructor(
    private fetchFn: (keys: K[]) => Promise<V[]>,
    private options: { cache?: boolean } = {}
  ) {}

  load(key: K): Promise<V> {
    if (this.options.cache !== false && this.cache.has(key)) {
      return Promise.resolve(this.cache.get(key)!);
    }

    if (this.options.cache !== false && this.cachePromises.has(key)) {
      return this.cachePromises.get(key)!;
    }

    if (this.pending.has(key)) {
      return new Promise<V>((resolve, reject) => {
        const pending = this.pending.get(key)!;
        const originalResolve = pending.resolve;
        pending.resolve = (v: V) => {
          originalResolve(v);
          resolve(v);
        };
      });
    }

    const promise = new Promise<V>((resolve, reject) => {
      this.pending.set(key, { resolve, reject });
      
      if (!this.scheduled) {
        this.scheduled = true;
        queueMicrotask(() => {
          this.flush();
        });
      }
    });

    if (this.options.cache !== false) {
      this.cachePromises.set(key, promise);
    }

    return promise;
  }

  private async flush(): Promise<void> {
    this.scheduled = false;
    if (this.pending.size === 0) return;

    const keys = Array.from(this.pending.keys());
    const entries = new Map(this.pending);
    this.pending.clear();

    try {
      const results = await this.fetchFn(keys);
      
      results.forEach((result, index) => {
        const key = keys[index];
        const pending = entries.get(key)!;
        pending.resolve(result);
        
        if (this.options.cache !== false) {
          this.cache.set(key, result);
          this.cachePromises.delete(key);
        }
      });
    } catch (error) {
      entries.forEach((pending) => {
        pending.reject(error as Error);
      });
    }
  }

  clear(): void {
    this.cache.clear();
    this.cachePromises.clear();
    this.pending.clear();
  }
}
