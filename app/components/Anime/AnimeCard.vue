<script setup lang="ts">
const props = defineProps<{
  data: Anime;
}>();

const cardHovered = ref(false);
const { user, loggedIn } = useUserSession();
const watchlist = await useWatchlist();
const added = computed(() => watchlist.value?.find(item => item.mediaId === props.data.id));

const add = async () => {
  const result = await addToWatchlist(props.data.id, fixSlug(props.data.title.romaji));
  if (!result) return;
  watchlist.value = [...(watchlist.value || []), result];
};
</script>

<template>
  <div class="position-relative" data-aos="fade-in">
    <BadgeBroadcasting v-if="data.status === 'RELEASING'" :airing-date="data?.nextAiringEpisode?.airingAt" class="pe-none" />
    <div v-ripple class="image overflow-hidden mb-2 w-100 position-relative" @mouseover="cardHovered = true" @mouseleave="cardHovered = false">
      <NuxtLink :to="`/a/${data.id}/${fixSlug(data.title.romaji)}`" class="text-white">
        <img class="img-fluid scale-on-hover h-100 w-100 position-absolute object-fit-cover" :src="data.coverImage?.extraLarge || data.coverImage?.large" width="280" :alt="data.title.romaji" :title="data.title.romaji">
      </NuxtLink>
      <div v-if="cardHovered && loggedIn && !added && user?.id" role="button" class="bookmark rounded-1 text-dark position-absolute bottom-0 end-0 z-1 m-2 p-2" title="Add to Watchlist" @click="add">
        <Icon name="ph:plus-bold" width="24" height="24" />
      </div>
      <div v-if="loggedIn && !added" id="overlay-anime-card" class="position-absolute w-100 top-0 pe-none" />
    </div>
  </div>
  <NuxtLink :to="`/a/${data.id}/${fixSlug(data.title.romaji)}`" class="text-white">
    <h6 class="mb-1 fw-normal">{{ data.title?.english ? data.title?.english : data.title?.romaji }} <span class="badge bg-secondary align-middle">{{ data.format.replace(/_/g, " ") }}</span></h6>
  </NuxtLink>
  <small class="text-muted d-block mb-1 fw-light">{{ data.title.romaji }}</small>
  <small class="d-block mb-1 text-primary ">{{ data.startDate.year ? formatDate(data.startDate.year, data.startDate.month, data.startDate.day) : "TBA" }}</small>
  <div class="d-flex align-items-center position-relative">
    <div class="stars d-flex align-items-center" style="height: 16px;">
      <img class="position-absolute" src="/images/stars.webp" width="80" style="opacity: 0.5">
      <img src="/images/stars-filled.webp" width="80" :style="{ 'clip-path': 'inset(0px ' + (100 - (data?.averageScore || 0)) + '% 0px 0px) ' }">
    </div>
    <small class="ms-2 mb-0 text-white">{{ getRating(data?.averageScore || 0) }}</small>
  </div>
</template>

<style scoped>
.image #overlay-anime-card {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.85) 15%, rgba(0, 0, 0, 0) 45%);
  opacity: 0;
  transition: opacity 0.3s ease-in-out!important;
  height: 100%;
}
.image:hover #overlay-anime-card {
  opacity: 1;
}

.bookmark {
  background-color: rgba(var(--bs-primary-rgb), 0.6);
}
.bookmark:hover {
  background-color: rgba(var(--bs-primary-rgb), 1);
}
</style>
