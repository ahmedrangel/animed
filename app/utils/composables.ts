export const useModalController = (id: string, visible: Ref<boolean | undefined> = ref()) => {
  const { $bootstrap } = useNuxtApp();
  return {
    show: async (callback?: () => void) => {
      if (!visible.value) visible.value = true;
      await sleep(100);
      const element = $bootstrap.showModal(id);
      if (!element) return;
      if (visible.value) {
        if (typeof callback === "function") callback();
        const hideEvent = () => {
          visible.value = false;
        };
        element.addEventListener("hidden.bs.modal", hideEvent, { once: true });
      }
    },
    hide: () => $bootstrap.hideModal(id)
  };
};
