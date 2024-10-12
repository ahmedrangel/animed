<script setup lang="ts">
const props = defineProps({
  anime: { type: Object, required: true }
});

const { anime } = props as { anime: Anime };
const description = fixDescription(anime?.description?.replace(/<br>/g, ""));
const toRoute = `/a/${anime?.id}/${fixSlug(anime?.title?.romaji)}`;
</script>

<template>
  <VideoModal v-if="anime?.trailer?.site === 'youtube'" id="verModal" :video="anime?.trailer?.id" />
  <div class="banner p-0 position-relative d-flex align-items-center p-0 w-100 overflow-hidden border-bottom">
    <span id="blur" class="position-absolute top-0 w-100 h-100 bg-secondary" :style="{ backgroundImage: anime?.bannerImage ? `url(${anime?.bannerImage})` : 'none' }" data-aos="zoom-out" data-aos-duration="3000" />
    <span id="front" class="d-flex justify-content-center px-4 pt-5 pt-md-0 pt-lg-0" data-aos="fade-in" data-aos-duration="2000">
      <img class="shadow" :src="anime?.coverImage?.extraLarge" :alt="anime?.title?.romaji" :title="anime?.title?.romaji">
    </span>
    <div id="overlay" class="position-absolute w-100 top-0" />
    <div id="info" class="position-absolute" data-aos="fade-right" data-aos-duration="2000">
      <NuxtLink :to="toRoute">
        <h2 class="mb-1 text-warning d-inline fw-bold">{{ anime?.title?.romaji }}</h2>
      </NuxtLink>
      <h6 class="mb-1 text-muted">{{ anime?.title?.english }}</h6>
      <div class="d-flex align-items-center position-relative mb-2">
        <div class="stars d-flex align-items-center" style="height: 25px;">
          <img class="position-absolute" src="/images/stars.webp" width="100" style="opacity: 0.5">
          <img class="" src="/images/stars-filled.webp" width="100" :style="{ clipPath: `inset(0px ${(100 - (anime?.averageScore || 0))}% 0px 0px)` }">
        </div>
        <span class="ms-2 mb-0 h6">{{ getRating(anime?.averageScore || 0) }}</span>
      </div>
      <h6 v-if="anime?.description" class="mb-2 fw-normal">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="fw-light" v-html="description.text" />
        <NuxtLink v-if="description.more" class="text-primary" :to="toRoute">&nbsp;Read more</NuxtLink>
      </h6>
      <PrimeButton v-if="anime?.trailer?.site === 'youtube'" class="btn text-dark mt-1" data-bs-toggle="modal" data-bs-target="#verModal" title="Watch Trailer">
        <div class="d-flex justify-content-center align-items-center py-1 px-2">
          <Icon name="solar:play-bold" />&nbsp;&nbsp;
          <span class="h6 mb-0">Watch Trailer</span>
        </div>
      </PrimeButton>
    </div>
  </div>
</template>
