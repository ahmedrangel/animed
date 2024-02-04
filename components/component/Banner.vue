<script setup lang="ts">
const props = defineProps({
  anime: { type: Object, required: true },
});
</script>

<template>
  <VideoModal v-if="props.anime.attributes.youtubeVideoId" id="verModal" :video="`https://youtube.com/embed/${props.anime.attributes.youtubeVideoId}`" />
  <div class="banner p-0 position-relative d-flex align-items-center p-0 w-100 overflow-hidden border-bottom">
    <span id="blur" class="position-absolute top-0 w-100 h-100" :style="{ 'background-image': 'url(' + props.anime.attributes.coverImage?.original + ')' }" />
    <span id="front" class="d-flex justify-content-center px-4 pt-5 pt-md-0 pt-lg-0">
      <img class="shadow" :src="props.anime.attributes.posterImage.large">
    </span>
    <div id="overlay" class="position-absolute w-100 top-0" />
    <div id="info" class="position-absolute">
      <NuxtLink :to="`/a/${props.anime.attributes.slug}`">
        <h2 class="mb-1 text-warning d-inline fw-bold">{{ props.anime.attributes.titles.en_jp ? props.anime.attributes.titles.en_jp : props.anime.attributes.canonicalTitle }}</h2>
      </NuxtLink>
      <h6 class="mb-1 text-muted">{{ props.anime.attributes.titles.en ? props.anime.attributes.titles.en : props.anime.attributes.titles.en_jp }}</h6>
      <div class="d-flex align-items-center position-relative mb-2">
        <div class="stars d-flex align-items-center" style="height: 25px;">
          <img class="position-absolute" src="/images/stars.webp" width="100">
          <img class="" src="/images/stars-filled.webp" width="100" :style="{'clip-path': 'inset(0px ' + (100-props.anime.attributes.averageRating) + '% 0px 0px) '}">
        </div>
        <span class="ms-2 mb-0 h6">{{ getRating(props.anime.attributes.averageRating) }}</span>
      </div>
      <h6 class="mb-2 fw-normal">{{ props.anime.attributes.synopsis }}</h6>
      <PrimeButton v-if="props.anime.attributes.youtubeVideoId" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#verModal">
        <div class="d-flex justify-content-center align-items-center py-1 px-2">
          <Icon name="solar:play-bold" />&nbsp;&nbsp;
          <span class="h6 mb-0 fw-bold">Watch Trailer</span>
        </div>
      </PrimeButton>
    </div>
  </div>
</template>