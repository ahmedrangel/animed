<script setup lang="ts">
setScrollBehavior();
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
