export default defineNuxtPlugin(() => {
  const router = useRouter();
  const lastRoute = ref(router.currentRoute.value);
  router.afterEach((to, from) => lastRoute.value = from);
  return {
    provide: {
      lastRoute
    }
  };
});
