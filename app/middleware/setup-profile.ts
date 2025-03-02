export default defineNuxtRouteMiddleware(({ path }) => {
  const { loggedIn, user } = useUserSession();
  if (path !== "/setup-profile" && loggedIn.value && !user.value?.username) return navigateTo("/setup-profile");
});
