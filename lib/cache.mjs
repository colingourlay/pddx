const CACHE = new Map();

export const cacheable =
  (cacheKey, fn) =>
  (...args) => {
    if (!CACHE.has(cacheKey)) {
      CACHE.set(cacheKey, fn(...args));
    }

    return CACHE.get(cacheKey);
  };
