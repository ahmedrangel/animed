<script setup lang="ts">
defineProps<{
  icon?: string;
  role?: "button" | "link";
  disabled?: boolean;
}>();
</script>

<template>
  <button v-if="!role || role === 'button' || disabled" class="btn" :disabled="disabled">
    <div class="d-flex justify-content-center align-items-center py-2 px-2 gap-2">
      <Icon v-if="icon" :name="icon" class="flex-shrink-0" />
      <span class="h6 mb-0"><slot /></span>
    </div>
  </button>
  <NuxtLink v-else class="btn">
    <div class="d-flex justify-content-center align-items-center py-2 px-2 gap-2">
      <Icon v-if="icon" :name="icon" class="flex-shrink-0" />
      <span class="h6 mb-0"><slot /></span>
    </div>
  </NuxtLink>
</template>
