import type { Storage, StorageValue } from "unstorage";

export const useIdbStorage = (name: "cache" | "expiration") => {
  if (import.meta.server) return null;
  // @ts-expect-error
  const { $storage, $storageExpirations } = useNuxtApp() as unknown as { $storage: Storage<StorageValue>, $storageExpirations: Storage<StorageValue> };
  return name === "expiration" ? $storageExpirations : $storage;
};
