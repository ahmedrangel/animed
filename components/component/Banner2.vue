<script setup lang="ts">
const props = defineProps({
  anime: { type: Object, required: true },
});
</script>

<template>
  <div v-if="props.anime?.bannerImage" class="banner2 p-0 d-flex align-items-center p-0 w-100 overflow-hidden border-bottom">
    <img id="blur" :src="props.anime?.bannerImage" class="top-0 w-100 h-100">
  </div>
</template>