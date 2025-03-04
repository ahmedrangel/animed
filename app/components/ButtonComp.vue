<script setup lang="ts">
defineProps<{
  icon?: string;
  role?: "button" | "link";
  disabled?: boolean;
}>();
</script>

<template>
  <button v-if="!role || role === 'button' || disabled" class="btn" :disabled="disabled">
    <div class="d-flex justify-content-center align-items-center gap-2 px-1">
      <Icon v-if="icon" :name="icon" class="flex-shrink-0" />
      <slot />
    </div>
  </button>
  <NuxtLink v-else class="btn">
    <div class="d-flex justify-content-center align-items-center gap-2 px-1">
      <Icon v-if="icon" :name="icon" class="flex-shrink-0" />
      <slot />
    </div>
  </NuxtLink>
</template>
