<script setup lang="ts">
const props = defineProps({
  anime: { type: Object, required: true }
});

const { anime } = props as { anime: Anime };
</script>

<template>
  <div v-if="anime?.bannerImage" class="banner p-0 position-relative d-flex align-items-center p-0 w-100 overflow-hidden border-bottom" :alt="anime?.title.romaji" :title="anime?.title.romaji">
    <span id="blur" class="position-absolute top-0 w-100 h-100 bg-secondary" :style="{ 'background-image': 'url(' + anime?.bannerImage + ')' }" data-aos="zoom-out" data-aos-duration="3000" />
    <div id="front" />
  </div>
</template>
