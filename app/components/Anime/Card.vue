<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true }
});

const anime = props.data as Anime;
</script>

<template>
  <NuxtLink :to="`/a/${anime.id}/${fixSlug(anime.title.romaji)}`" class="text-white">
    <div v-ripple class="position-relative" data-aos="fade-in">
      <BadgeBroadcasting v-if="anime.status === 'RELEASING'" :airing-date="anime?.nextAiringEpisode?.airingAt" />
      <div class="image overflow-hidden mb-2 w-100 position-relative">
        <img class="img-fluid scale-on-hover h-100 w-100 position-absolute object-fit-cover" :src="anime.coverImage.extraLarge" width="280" :alt="anime.title.romaji" :title="anime.title.romaji">
      </div>
    </div>
    <h6 class="mb-1 fw-normal">{{ anime.title?.english ? anime.title?.english : anime.title?.romaji }} <span class="badge bg-secondary align-middle">{{ anime.format.replace(/_/g, " ") }}</span></h6>
  </NuxtLink>
  <small class="text-muted d-block mb-1 fw-light">{{ anime.title.romaji }}</small>
  <small class="d-block mb-1 text-primary ">{{ anime.startDate.year ? formatDate(anime.startDate.year, anime.startDate.month, anime.startDate.day) : "TBA" }}</small>
  <div class="d-flex align-items-center position-relative">
    <div class="stars d-flex align-items-center" style="height: 16px;">
      <img class="position-absolute" src="/images/stars.webp" width="80" style="opacity: 0.5">
      <img src="/images/stars-filled.webp" width="80" :style="{ 'clip-path': 'inset(0px ' + (100 - (anime?.averageScore || 0)) + '% 0px 0px) ' }">
    </div>
    <small class="ms-2 mb-0 text-white">{{ getRating(anime?.averageScore || 0) }}</small>
  </div>
</template>
