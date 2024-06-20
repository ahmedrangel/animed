<script setup lang="ts">
const props = defineProps({
  anime: { type: Object, required: true }
});
</script>

<template>
  <div v-if="props.anime?.bannerImage" class="banner p-0 position-relative d-flex align-items-center p-0 w-100 overflow-hidden border-bottom" :alt="props.anime?.title.romaji" :title="props.anime?.title.romaji">
    <span id="blur" class="position-absolute top-0 w-100 h-100 bg-secondary" :style="{ 'background-image': 'url(' + props.anime?.bannerImage + ')' }" />
    <div id="front" />
  </div>
</template>
