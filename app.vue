<script setup lang="ts">
setScrollBehavior();
</script>

<template>
  <NuxtLoadingIndicator :throttle="0" />
  <NavbarComp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </NavbarComp>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
