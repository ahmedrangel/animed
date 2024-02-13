<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true },
});
</script>

<template>
  <div class="px-2 pt-4 pt-lg-5 px-xl-5 w-100">
    <div v-for="(d, i) of props.data.preview" :key="i" of data class="pb-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">{{ d.title }}<span v-if="props.data.category">&nbsp;<NuxtLink :to="`/c/${fixSlug(props.data.category)}`">{{ props.data.category }}</NuxtLink></span></h3>
        <NuxtLink :to="d.route">
          <h6 class="mb-0 text-muted">Explore More</h6>
        </NuxtLink>
      </div>
      <div class="d-flex overflow-auto">
        <div v-for="(list, j) of d.data" :key="j" class="col-lg-2 col-sm-3 col-6 mb-3">
          <div :class="j === 0 ? 'me-1' : 'mx-1'">
            <NuxtLink :to="`/a/${list.id}/${fixSlug(list.title.romaji)}`" class="text-white">
              <div class="image overflow-hidden mb-2 w-100 position-relative">
                <img class="img-fluid scale-on-hover h-100 w-100 top-0 left-0 position-absolute object-fit-cover" :src="list.coverImage.extraLarge" width="280">
              </div>
              <h6 class="mb-1 fw-normal">{{ list.title.english ? list.title.english : list.title.romaji }} <span class="badge bg-secondary align-middle">{{ list.format.replace(/_/g," ") }}</span></h6>
            </NuxtLink>
            <small class="text-muted d-block mb-1 fw-light">{{ list.title.romaji }}</small>
            <small class="d-block mb-1 text-primary ">{{ list.startDate.year ? formatDate(list.startDate.year, list.startDate.month, list.startDate.day) : "TBA" }}</small>
            <div class="d-flex align-items-center position-relative">
              <div class="stars d-flex align-items-center" style="height: 16px;">
                <img class="position-absolute" src="/images/stars.webp" width="80" style="opacity: 0.5">
                <img src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + (100-list.averageScore) + '% 0px 0px) '}">
              </div>
              <small class="ms-2 mb-0 text-white">{{ getRating(list.averageScore) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>