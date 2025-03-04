<script setup lang="ts">
setScrollBehavior();
const { user, loggedIn } = useUserSession();
if (loggedIn.value) {
  await useFetch("/api/watchlist", {
    query: { userId: user.value?.id },
    key: "mywatchlist",
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
  });
}
</script>

<template>
  <NuxtLoadingIndicator :throttle="0" />
  <BackToTop />
  <NavbarComp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </NavbarComp>
</template>
