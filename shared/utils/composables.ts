import type { NitroFetchOptions } from "nitropack";
import type { Storage, StorageValue } from "unstorage";

export const useIdbStorage = (name: "cache" | "expiration") => {
  if (import.meta.server) return null;
  // @ts-expect-error
  const { $storage, $storageExpirations } = useNuxtApp() as unknown as { $storage: Storage<StorageValue>, $storageExpirations: Storage<StorageValue> };
  return name === "expiration" ? $storageExpirations : $storage;
};

export const useCachedFetch = async <T>(url: string, fetchOptions: NitroFetchOptions<any>, CacheOptions: { cacheKey?: string, swr?: boolean, ttl?: number }) => {
  const { cacheKey, swr, ttl } = CacheOptions;
  const msTtl = (ttl || 0) * 1000;
  const now = Date.now();
  const storage = useIdbStorage("cache");
  const storageExpirations = useIdbStorage("expiration");

  if (cacheKey) {
    const [cached, cachedExpiration] = await Promise.all([
      storage?.getItem<T>(cacheKey),
      storageExpirations?.getItem<string>(cacheKey)
    ]);
    if (cached && cachedExpiration && Number(cachedExpiration) > now) {
      if (swr) {
        void (async () => {
          const response = await $fetch(url, fetchOptions);
          if (response && JSON.stringify(response) !== JSON.stringify(cached)) {
            await Promise.all([
              storage?.setItemRaw(cacheKey, response as unknown),
              storageExpirations?.setItemRaw(cacheKey, now + msTtl)
            ]);
          }
        })();
      }
      return cached;
    }
    await Promise.all([
      storage?.removeItem(cacheKey),
      storageExpirations?.removeItem(cacheKey)
    ]);
  }

  const response = await $fetch(url, fetchOptions);
  if (response && cacheKey) {
    await Promise.all([
      storage?.setItemRaw(cacheKey, response as unknown),
      storageExpirations?.setItemRaw(cacheKey, now + msTtl)
    ]);
  }
  return response as T;
};
