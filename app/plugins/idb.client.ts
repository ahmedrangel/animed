import { createStorage, defineDriver } from "unstorage";
import { get, set, clear, del, keys, createStore, type UseStore } from "idb-keyval";

const DRIVER_NAME = "idb-keyval";

export const indexedDbDriver = defineDriver((opts = {}) => {
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
    setItem (key, value) {
      try {
        return set(makeKey(key), JSON.parse(value), customStore);
      }
      catch {
        return set(makeKey(key), value, customStore);
      }
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

export default defineNuxtPlugin(() => {
  const storage = createStorage({
    driver: indexedDbDriver({
      base: "app:",
      dbName: "animed-cache",
      storeName: "key-val"
    })
  });

  const storageExpirations = createStorage({
    driver: indexedDbDriver({
      base: "app:",
      dbName: "animed-cache-expiration",
      storeName: "key-val"
    })
  });

  return {
    provide: {
      storage,
      storageExpirations
    }
  };
});
