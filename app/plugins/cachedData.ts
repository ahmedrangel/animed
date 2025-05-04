import type { NuxtApp } from "#app";

class CachedData {
  public data = ref<Record<string, any>>({});

  get <T = any>(key: string): T {
    return this.data.value[key];
  }

  set (key: string, value: any) {
    this.data.value[key] = value;
  }

  prepare <T>(key: string, { $cachedData, payload }: NuxtApp): T {
    const cachedData = $cachedData.get(key);
    if (cachedData) {
      return cachedData;
    }

    const payloadData = payload.data[key];
    if (payloadData) {
      $cachedData.set(key, payloadData);
    }
    return payloadData;
  }
}

export default defineNuxtPlugin(() => ({
  provide: { cachedData: new CachedData() }
}));
