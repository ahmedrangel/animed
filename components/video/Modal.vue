<script setup lang="ts">
const props = defineProps({
  id: { type: String, required: true },
  video: { type: String, required: true },
});
</script>

<template>
  <div :id="props.id" class="modal fade w-100 p-0" tabindex="-1" role="dialog" :aria-labelledby="props.id" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          <!-- 16:9 aspect ratio -->
          <div class="ratio ratio-16x9">
            <iframe width="1280" height="720" :src="props.video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>