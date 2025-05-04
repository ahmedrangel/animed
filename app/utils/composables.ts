import type { NitroFetchRequest } from "nitropack";
import type { UseFetchOptions } from "#app";

export const useModalController = (id: string) => {
  const { $bootstrap } = useNuxtApp();
  return ref({
    isVisible: false,
    show: async function (callback?: () => void) {
      if (!this.isVisible) this.isVisible = true;
      nextTick(() => {
        const element = $bootstrap.showModal(id);
        if (!element) return;
        if (this.isVisible) {
          if (typeof callback === "function") callback();
          const hideEvent = () => {
            this.isVisible = false;
          };
          element.addEventListener("hidden.bs.modal", hideEvent, { once: true });
        }
      });
    },
    hide: () => $bootstrap.hideModal(id)
  });
};

export const useNavigationRoute = () => {
  const { $lastRoute } = useNuxtApp();
  const currentRoute = useRoute();
  const lastRoute = $lastRoute?.value;
  return { lastRoute, currentRoute };
};

export const useDetectCrawler = (userAgent: string | undefined) => {
  const botName = [...limitedBots, ...unlimitedBots].find(bot => userAgent?.includes(bot));
  if (botName) {
    return { userAgent, isCrawler: true };
  }
  return { userAgent, isCrawler: false };
};

export const useFormState = <T extends Record<string, unknown>>(initialState: T) => {
  const data = ref<T>({ ...initialState });
  const methods = {
    /**
     * Reset all fields or specific fields
     * @param fields
     */
    reset (...fields: (keyof T)[]) {
      if (!fields.length) {
        data.value = { ...initialState };
        return;
      }
      for (const field of fields) {
        data.value[field] = initialState[field];
      }
    }
  };
  Object.assign(data, methods);
  return data as Ref<T> & typeof methods;
};

const cachedData: Record<string, Ref<any>> = ({});

export const useCachedData = <T = any>(key: string, getValue?: () => T): Ref<T> => {
  const isFunction = typeof getValue === "function";

  if (!cachedData[key]) {
    cachedData[key] = ref(isFunction ? getValue() : undefined);
  }
  else if (isFunction) {
    cachedData[key].value = getValue();
  }

  return cachedData[key];
};

export const setupCachedData = <T>(key: string): T => {
  const cachedData = useCachedData(key);

  if (cachedData.value) {
    return cachedData.value;
  }

  const { data } = useNuxtData(key);

  if (data.value) {
    useCachedData(key, () => data.value);
  }
  else {
    watch(data, (newData) => {
      useCachedData(key, () => newData);
    });
  }
  return data.value;
};

export const useCachedFetch = async <T>(url: NitroFetchRequest, options: UseFetchOptions<T> & { key: string }) => {
  const nuxtData = useCachedData<T>(options.key);

  if (!nuxtData.value) {
    const { data: resultsFetch } = await useFetch(url, {
      ...options,
      getCachedData: setupCachedData
    });

    if (options.lazy) {
      watch(resultsFetch, () => {
        nuxtData.value = resultsFetch.value as T;
      });
    }
    else {
      nuxtData.value = resultsFetch.value as T;
    }
  }

  return nuxtData;
};

export const useWatchlist = async () => {
  const { user, loggedIn } = useUserSession();
  if (!loggedIn.value) return ref(null);
  const data = await useCachedFetch<Watchlist[]>("/api/watchlist", {
    query: { userId: user.value?.id },
    key: "mywatchlist"
  });
  return data;
};
