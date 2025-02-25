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
