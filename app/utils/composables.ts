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

export const useWatchlist = () => {
  const { user, loggedIn } = useUserSession();
  if (!loggedIn.value) return ref(null);
  const { data: currentWatchlist } = useNuxtData<Watchlist[]>("mywatchlist");
  if (currentWatchlist.value) return currentWatchlist;
  const { data: watchlist } = useAsyncData("mywatchlist", () => $fetch<Watchlist[]>("/api/watchlist", {
    query: { userId: user.value?.id }
  }), {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
  });
  return watchlist;
};
