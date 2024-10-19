<script setup lang="ts">
interface ControllerModalModel {
  isVisible: boolean;
  show: (callback?: () => void) => Promise<void>;
  hide: () => void;
}

defineProps({
  modelValue: { type: Object as () => ControllerModalModel, required: true },
  id: { type: String, required: true },
  title: { type: String, default: "" },
  lg: { type: Boolean, default: false },
  fullscreen: { type: Boolean, default: false },
  map: { type: Boolean, default: false }
});
</script>

<template>
  <div :id="id" v-if="modelValue.isVisible" class="modal fade" tabindex="-1" :aria-labelledby="id" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" :class="{ 'modal-lg': lg, 'modal-fullscreen': fullscreen }">
      <div class="modal-content">
        <div v-if="title" class="modal-header">
          <h1 id="modalLabel" class="modal-title fs-5">{{ title }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body mx-2 mx-lg-0">
          <slot />
          <div v-if="!title" class="position-absolute end-0 top-0 m-2">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
