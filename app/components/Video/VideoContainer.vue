<script setup lang="ts">
defineProps<{
  videoId: string;
}>();
</script>

<template>
  <ScriptYouTubePlayer :video-id="videoId" above-the-fold :width="1920" :height="1080" class="w-100 rounded overflow-hidden" :placeholder-attrs="{ style: { objectFit: 'cover' } }">
    <template #awaitingLoad>
      <div class="position-absolute top-50 start-50 translate-middle text-center">
        <svg height="22%" version="1.1" viewBox="0 0 68 48" width="22%"><path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#ff0033" /><path d="M 45,24 27,14 27,34" fill="#fff" /></svg>
      </div>
    </template>
    <template #loading>
      <div class="spinner-border position-absolute top-50 start-50 translate-middle" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </template>
  </ScriptYouTubePlayer>
</template>
