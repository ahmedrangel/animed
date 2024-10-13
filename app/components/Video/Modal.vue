<script setup lang="ts">
const props = defineProps({
  id: { type: String, required: true },
  video: { type: String, required: true }
});

const clickHandler = (e: Event) => {
  const target = e.target as Node;
  const iframe = document.querySelector(`#${props.video} iframe`) as HTMLIFrameElement | null;
  if (iframe && !iframe?.contains(target)) {
    ytPlayerApi.stopVideo(iframe);
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
        <div class="modal-body px-0 px-sm-2">
          <div class="text-end mb-2">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <ClientOnly>
            <VideoContainer :id="props.video" :video-id="props.video" />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>
