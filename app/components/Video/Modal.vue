<script setup lang="ts">
const props = defineProps({
  video: { type: String, required: true }
});

const videoId = ref("");

watchEffect(() => {
  videoId.value = props.video;
});
</script>

<template>
  <ModalController id="videoModal">
    <VideoContainer :video-id="videoId" />
  </ModalController>
</template>
