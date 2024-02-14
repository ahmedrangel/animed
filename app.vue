<script setup lang="ts">
setScrollBehavior();
</script>

<template>
  <NuxtLoadingIndicator :throttle="0" />
  <ComponentNavbar>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ComponentNavbar>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>