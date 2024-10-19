<script setup lang="ts">
defineProps({
  video: { type: String, required: true }
});
</script>

<template>
  <ModalController id="videoModal">
    <VideoContainer :video-id="video" />
  </ModalController>
</template>
