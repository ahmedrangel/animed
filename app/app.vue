<script setup lang="ts">
setScrollBehavior();
await setupWatchlist();
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
