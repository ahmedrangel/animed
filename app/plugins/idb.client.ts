import { createStorage, defineDriver } from "unstorage";
import { get, set, clear, del, keys, createStore, entries, type UseStore } from "idb-keyval";

const DRIVER_NAME = "idb-keyval";

interface DriverOptions {
  base: string;
  dbName: string;
  storeName: string;
}

export const indexedDbDriver = defineDriver((opts: DriverOptions) => {
  const base = opts.base && opts.base.length > 0 ? `${opts.base}:` : "";
  const makeKey = (key: string) => base + key;
  let customStore: UseStore | undefined;
  if (opts.dbName && opts.storeName) {
    customStore = createStore(opts.dbName, opts.storeName);
  }
  return {
    name: DRIVER_NAME,
    options: opts,
    async hasItem (key) {
      const item = await get(makeKey(key), customStore);
      return item === void 0 ? false : true;
    },
    async getItem (key) {
      const item = await get(makeKey(key), customStore);
      return item ?? null;
    },
    async getItemRaw (key) {
      const item = await get(makeKey(key), customStore);
      return item ?? null;
    },
    async getEntries () {
      return await entries(customStore);
    },
    setItem (key, value) {
      return set(makeKey(key), value, customStore);
    },
    setItemRaw (key, value) {
      return set(makeKey(key), value, customStore);
    },
    removeItem (key) {
      return del(makeKey(key), customStore);
    },
    getKeys () {
      return keys(customStore);
    },
    clear () {
      return clear(customStore);
    }
  };
});

export default defineNuxtPlugin((nuxtApp) => {
  const cache: DriverOptions = {
    base: "app:",
    dbName: "animed-cache",
    storeName: "key-val"
  };

  const cacheExpiration: DriverOptions = {
    base: "app:",
    dbName: "animed-cache-expiration",
    storeName: "key-val"
  };

  const storage = createStorage({
    driver: indexedDbDriver(cache)
  });

  const storageExpirations = createStorage({
    driver: indexedDbDriver(cacheExpiration)
  });

  nuxtApp.hook("app:mounted", async () => {
    const expirationStore = createStore(cacheExpiration.dbName, cacheExpiration.storeName);
    const expirationEntries = await entries(expirationStore);
    console.info("Cache enabled: IndexedDB");
    const now = new Date().getTime();
    for (const [key, value] of expirationEntries) {
      if (Number(value) < now) {
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
