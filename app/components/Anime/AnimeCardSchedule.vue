<script setup lang="ts">
const props = defineProps({
  data: { type: Object as PropType<ScheduleInfo>, required: true },
  airingNext: { type: Boolean, default: false },
  airingNow: { type: Boolean, default: false }
});

const anime = props.data.media;
const now = new Date().getTime() / 1000;
</script>

<template>
  <div class="position-relative">
    <h6 v-if="airingNow" class="position-absolute z-2 w-100 text-center mb-0" style="top: -12px">
      <span class="badge bg-info px-2 py-1 text-dark d-inline-flex gap-1 pe-none rounded-1">
        <Icon name="mdi:broadcast" />
        Airing Now
      </span>
    </h6>
    <h6 v-if="airingNext" class="position-absolute z-2 w-100 text-center mb-0" style="top: -12px">
      <span class="badge bg-primary px-2 py-1 text-dark d-inline-flex gap-1 pe-none rounded-1">
        <Icon name="ph:arrow-down-duotone" />
        Airing Next
      </span>
    </h6>
    <div class="d-flex bg-secondary rounded-2 overflow-hidden">
      <NuxtLink :to="`/a/${anime.id}/${fixSlug(anime.title.romaji)}`" ripple class="col-4 text-white position-relative">
        <span class="badge bg-dark align-middle position-absolute end-0 m-1 z-1 pe-none">{{ anime.format.replace(/_/g, " ") }}</span>
        <div class="overflow-hidden">
          <img class="img-fluid scale-on-hover h-100 w-100 object-fit-cover rounded-0" style="height: 140px!important;" :src="anime.coverImage.extraLarge" :alt="anime.title.romaji" :title="anime.title.romaji">
        </div>
      </NuxtLink>
      <div class="col-8 p-2 d-flex flex-column justify-content-between">
        <div>
          <NuxtLink :to="`/a/${anime.id}/${fixSlug(anime.title.romaji)}`" class="col-4 text-white" :title="anime.title?.english ? anime.title?.english : anime.title?.romaji">
            <small class="mb-1 fw-normal text-truncate d-block">{{ anime.title?.english ? anime.title?.english : anime.title?.romaji }}</small>
          </NuxtLink>
          <small class="text-muted d-block mb-1 fw-light text-truncate" :title="anime.title.romaji">{{ anime.title.romaji }}</small>
          <div class="d-flex align-items-center position-relative mb-1">
            <div class="stars d-flex align-items-center" style="height: 16px;">
              <img class="position-absolute" src="/images/stars.webp" width="80" style="opacity: 0.5">
              <img src="/images/stars-filled.webp" width="80" :style="{ 'clip-path': 'inset(0px ' + (100 - (anime?.averageScore || 0)) + '% 0px 0px) ' }">
            </div>
            <small class="ms-2 mb-0 text-white">{{ getRating(anime?.averageScore || 0) }}</small>
          </div>
        </div>
        <small>
          <span class="text-primary">EP {{ data.episode }}</span>
          ·
          <span v-if="now > data.airingAt" class="text-danger">Aired</span>
          <span v-else>Airing</span>
          at {{ formatTime(data.airingAt) }}
        </small>
      </div>
    </div>
  </div>
</template>
