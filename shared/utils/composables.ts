export const useIdbStorage = (name: "cache" | "expiration") => {
  if (import.meta.server) return null;
  const { $storage, $storageExpirations } = useNuxtApp();
  return name === "expiration" ? $storageExpirations : $storage;
};
