<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true },
});
</script>

<template>
  <div>
    <div v-for="(d, i) of props.data.preview" :key="i" of data :class="props.data.preview.length - 1 !== i ? 'pb-5' : ''">
      <div v-if="d?.title" class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">{{ d.title }}<span v-if="props.data.category">&nbsp;<NuxtLink :to="`/c/${fixSlug(props.data.category)}`">{{ props.data.category }}</NuxtLink></span></h3>
        <NuxtLink :to="d.route">
          <h6 class="mb-0 text-muted">Explore More</h6>
        </NuxtLink>
      </div>
      <div class="d-flex overflow-auto">
        <div v-for="(anime, j) of d.data" :key="j" class="col-lg-2 col-sm-3 col-6 mb-3">
          <div :class="j === 0 ? 'me-1' : 'mx-1'">
            <ComponentAnimeCard :data="anime" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>