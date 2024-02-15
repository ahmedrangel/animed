<script setup lang="ts">
const props = defineProps({
  id: { type: String, required: true },
  video: { type: String, required: true },
});

const clickHandler = (e: Event) => {
  const target = e.target as Node;
  const iframe = document.querySelector("#embed") as HTMLIFrameElement;
  if (!iframe?.contains(target)) {
    iframe.contentWindow?.postMessage("{\"event\":\"command\",\"func\":\"stopVideo\",\"args\":\"\"}", "*");
  }
};

onMounted(() => {
  const modal = document.querySelector("#" + props.id) as HTMLElement;
  if (modal) {
    modal.addEventListener("click", clickHandler);
  }
});

onBeforeUnmount(() => {
  const modal = document.querySelector("#" + props.id) as HTMLElement;
  if (modal) {
    modal.removeEventListener("click", clickHandler);
  }
});
</script>

<template>
  <div :id="props.id" class="modal fade w-100 p-0" tabindex="-1" role="dialog" :aria-labelledby="props.id" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          <!-- 16:9 aspect ratio -->
          <div class="ratio ratio-16x9">
            <iframe id="embed" width="1280" height="720" :src="props.video + '?enablejsapi=1'" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>