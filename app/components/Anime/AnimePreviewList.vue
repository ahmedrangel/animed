<script setup lang="ts">
defineProps<{
  data: AnimePreviewList;
}>();
</script>

<template>
  <div>
    <div v-for="(preview, i) of data.preview" :key="i" :class="data.preview?.length - 1 !== i ? 'pb-5' : ''">
      <div v-if="preview.title && preview?.media?.length" class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">{{ preview.title }}<span v-if="data.category">&nbsp;<NuxtLink :to="preview.route">{{ data.category }}</NuxtLink></span></h3>
        <NuxtLink :to="preview.route">
          <h6 class="mb-0 text-muted">Explore More</h6>
        </NuxtLink>
      </div>
      <div class="d-flex overflow-auto">
        <template v-for="(anime, j) of preview?.media" :key="j">
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
