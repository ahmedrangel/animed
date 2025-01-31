import { createStorage } from "unstorage";
import indexedDbDriver, { type IDBKeyvalOptions } from "unstorage/drivers/indexedb";
import { createStore, entries } from "idb-keyval";

export default defineNuxtPlugin((nuxtApp) => {
  const cache: IDBKeyvalOptions = {
    base: "app:",
    dbName: "animed-cache",
    storeName: "key-val"
  };

  const cacheExpiration: IDBKeyvalOptions = {
    base: "app:",
    dbName: "animed-cache-expiration",
    storeName: "key-val"
  };

  const storage = createStorage({ driver: indexedDbDriver(cache) });
  const storageExpirations = createStorage({ driver: indexedDbDriver(cacheExpiration) });

  nuxtApp.hook("app:mounted", async () => {
    const expirationStore = createStore(cacheExpiration.dbName!, cacheExpiration.storeName!);
    const expirationEntries = await entries(expirationStore);
    console.info("Cache enabled: IndexedDB");
    const now = new Date().getTime();
    for (const [key, value] of expirationEntries) {
      if (Number(value) < now) {
        console.info(`Removing expired cache: ${key}`);
        await Promise.all([
          useIdbStorage("cache")?.removeItem(String(key).replace(cache.base + ":", "")),
          useIdbStorage("expiration")?.removeItem(String(key).replace(cache.base + ":", ""))
        ]);
      }
    }
  });

  return {
    provide: {
      storage,
      storageExpirations
    }
  };
});
