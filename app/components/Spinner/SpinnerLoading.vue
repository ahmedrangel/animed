<script setup lang="ts">
defineProps<{
  size?: string;
}>();
</script>

<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="text-muted spinner-border spinner-lg" role="status" :style="{ width: size || '4rem', height: size || '4rem', fontSize: '30px' }">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>
