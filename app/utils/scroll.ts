export const setScrollBehavior = () => {
  const { $router } = useNuxtApp();
  $router.options.scrollBehavior = to => new Promise((resolve) => {
    if (!to.hash) return resolve({ left: 0, top: 0 });
    setTimeout(() => resolve({ el: to.hash, top: 55, left: 0, behavior: "smooth" }), 500);
  });
};
