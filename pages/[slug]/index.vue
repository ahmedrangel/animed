<script setup lang="js">
const { params } = useRoute();
const { slug } = params;
const { data: data } = await useFetch("/api/anime/" + slug);
const anime = data.value.data[0];
</script>

<template>
  <VideoModal v-if="anime.attributes.youtubeVideoId" id="verModal" :video="`https://youtube.com/embed/${anime.attributes.youtubeVideoId}`" />
  <div class="col px-0 pb-5">
    <div class="banner p-0 position-relative d-flex align-items-center p-0 w-100 overflow-hidden border-bottom">
      <span id="blur" class="position-absolute top-0 w-100 h-100" :style="{ 'background-image': 'url(' + anime.attributes.coverImage.large + ')' }" />
      <span id="front" class="d-flex justify-content-center px-3 pt-5 pt-md-0 pt-lg-0">
        <img :src="anime.attributes.posterImage.large">
      </span>
      <div id="overlay" class="position-absolute w-100 top-0" />
      <div id="info" class="position-absolute">
        <h2 class="mb-1 text-warning">{{ anime.attributes.canonicalTitle }}</h2>
        <h6 class="mb-1 text-muted">{{ anime.attributes.titles.en ? anime.attributes.titles.en : anime.attributes.canonicalTitle }}</h6>
        <div class="d-flex align-items-center position-relative mb-2">
          <div class="stars d-flex align-items-center" style="height: 25px;">
            <img class="position-absolute" src="/images/stars.webp" width="100">
            <img class="" src="/images/stars-filled.webp" width="100" :style="{'clip-path': 'inset(0px ' + (100-anime.attributes.averageRating) + '% 0px 0px) '}">
          </div>
          <span class="ms-2 mb-0 h6">{{ getRating(anime.attributes.averageRating) }}</span>
        </div>
        <h6 class="mb-2 fw-normal">{{ anime.attributes.synopsis }}</h6>
        <PrimeButton v-if="anime.attributes.youtubeVideoId" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#verModal">
          <div class="d-flex justify-content-center align-items-center py-1 px-2">
            <Icon name="solar:play-bold" />&nbsp;&nbsp;
            <span class="h6 mb-0 fw-bold">Watch Trailer</span>
          </div>
        </PrimeButton>
      </div>
    </div>
  </div>
</template>
