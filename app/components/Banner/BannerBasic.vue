<script setup lang="ts">
defineProps({
  anime: { type: Object as PropType<Anime>, required: true },
  aos: { type: Boolean, default: true }
});
</script>

<template>
  <div v-if="anime?.bannerImage" class="banner p-0 position-relative d-flex align-items-center p-0 w-100 overflow-hidden border-bottom" :alt="anime?.title.romaji" :title="anime?.title.romaji">
    <span id="blur" class="position-absolute top-0 w-100 h-100 bg-secondary" :style="{ 'background-image': 'url(' + anime?.bannerImage + ')' }" :data-aos="!aos ? '' : 'zoom-out'" data-aos-duration="2000" />
    <div id="front" />
  </div>
</template>
