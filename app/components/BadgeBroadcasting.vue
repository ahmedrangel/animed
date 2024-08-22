<script setup lang="ts">
defineProps({
  airingDate: { type: Number, required: false }
});
</script>

<template>
  <div class="position-absolute z-1 mt-1 me-1 top-0 end-0 text-end">
    <span class="badge bg-dark p-1">
      <div class="d-flex justify-content-end align-items-center gap-1">
        <div class="position-relative" style="width: 1em; height: 1em;">
          <Icon class="text-info h6 position-absolute top-50 start-50 translate-middle" name="mdi:broadcast" />
        </div>
        <span class="d-block">Airing</span>
      </div>
    </span>
    <span v-if="airingDate && (airingDate * 1000 > Date.now())" class="badge bg-dark p-1 d-flex">
      <div class="d-flex justify-content-end align-items-center gap-1">
        <span class="d-block">New ep: {{ distanceToNow(airingDate) }}</span>
      </div>
    </span>
  </div>
</template>
