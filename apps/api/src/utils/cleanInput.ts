export function removeNulls<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
  ) as { [K in keyof T]?: Exclude<T[K], null> }; 
}