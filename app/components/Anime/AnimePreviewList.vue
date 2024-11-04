<script setup lang="ts">
const props = defineProps({
  data: { type: Object as PropType<AnimePreviewList>, required: true }
});
const preview_keys = Object.keys(props.data?.preview);
</script>

<template>
  <div>
    <div v-for="(k, i) of preview_keys" :key="i" :class="preview_keys?.length - 1 !== i ? 'pb-5' : ''">
      <div v-if="data.preview[k]?.title && data.preview[k]?.media?.length" class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">{{ data.preview[k].title }}<span v-if="data.category">&nbsp;<NuxtLink :to="data.preview[k].route">{{ data.category }}</NuxtLink></span></h3>
        <NuxtLink :to="data.preview[k].route">
          <h6 class="mb-0 text-muted">Explore More</h6>
        </NuxtLink>
      </div>
      <div class="d-flex overflow-auto">
        <template v-for="(anime, j) of data.preview[k]?.media" :key="j">
          <div v-if="anime" class="col-lg-2 col-sm-3 col-6 mb-3">
            <div :class="j === 0 ? 'me-1' : 'mx-1'">
              <AnimeCard :data="anime" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
