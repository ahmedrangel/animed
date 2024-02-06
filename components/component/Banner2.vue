<script setup lang="ts">
const props = defineProps({
  anime: { type: Object, required: true },
});
</script>

<template>
  <div class="banner p-0 position-relative d-flex align-items-center p-0 w-100 overflow-hidden border-bottom">
    <span id="blur" class="position-absolute top-0 w-100 h-100 bg-secondary" :style="{ 'background-image': 'url(' + props.anime?.bannerImage + ')' }" />
    <div id="front" />
  </div>
</template>