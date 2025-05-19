<script setup lang="ts">
const props = defineProps<{
  anime: Anime[];
}>();

const route = useRoute();
const videoModal = useModalController("video-modal");
const videoId = ref("");

const computedAnime = computed(() => props.anime.toSorted(() => Math.random() - 0.5).map(el => ({
  ...el,
  description: el.description ? fixDescription(el.description).text : null
})));

const animeArray = useState(route.path, () => computedAnime.value);

watch(computedAnime, () => {
  animeArray.value = computedAnime.value;
}, { deep: true });

const openVideoModal = (trailer: string) => {
  videoId.value = trailer;
  videoModal.value.show();
};

onMounted(() => {
  const { $bootstrap } = useNuxtApp();
  $bootstrap.startAllCarousel();
});

onBeforeUnmount(() => {
  clearNuxtState(route.path);
});
</script>

<template>
  <div id="detailed-banner">
    <ModalController id="video-modal" v-model="videoModal">
      <VideoContainer :video-id="videoId" />
    </ModalController>
    <div class="carousel slide carousel-fade overflow-hidden border-bottom" data-bs-ride="carousel">
      <div class="carousel-indicators mb-0">
        <button v-for="(a, i) of animeArray" :key="i" type="button" :data-bs-target="`#detailed-banner .carousel`" :data-bs-slide-to="i" :class="{ active: !i }" aria-current="true" :aria-label="`${a.title} ${i + 1}`" />
      </div>
      <div class="carousel-inner d-flex">
        <template v-for="(a, i) of animeArray" :key="i">
          <div class="banner p-0 position-relative d-flex align-items-start align-items-md-center p-0 w-100 carousel-item" :class="{ active: !i }" data-bs-interval="10000">
            <span id="blur" class="position-absolute top-0 w-100 h-100 bg-secondary" :style="{ backgroundImage: a?.bannerImage ? `url(${a?.bannerImage})` : 'none' }" data-aos="zoom-out" data-aos-duration="3000" />
            <span id="front" class="text-center px-4 pt-2 pt-md-0" data-aos="fade-in" data-aos-duration="2000">
              <img class="shadow" :src="a?.coverImage?.extraLarge" :alt="a?.title?.romaji" :title="a?.title?.romaji">
            </span>
            <div id="overlay" class="position-absolute w-100 top-0" />
            <div id="info" class="position-absolute" data-aos="fade-right" data-aos-duration="2000">
              <NuxtLink :to="`/a/${a?.id}/${fixSlug(a?.title?.romaji)}`">
                <h2 class="mb-1 text-warning d-inline fw-bold">{{ a?.title?.romaji }}</h2>
              </NuxtLink>
              <h6 class="mb-1 text-muted">{{ a?.title?.english }}</h6>
              <div class="d-flex align-items-center position-relative mb-2">
                <div class="stars d-flex align-items-center" style="height: 25px;">
                  <img class="position-absolute" src="/images/stars.webp" width="100" style="opacity: 0.5">
                  <img class="" src="/images/stars-filled.webp" width="100" :style="{ clipPath: `inset(0px ${(100 - (a?.averageScore || 0))}% 0px 0px)` }">
                </div>
                <span class="ms-2 mb-0 h6">{{ getRating(a?.averageScore || 0) }}</span>
              </div>
              <h6 v-if="a?.description" class="mb-2 fw-normal">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span class="fw-light" v-html="a.description" />
                <NuxtLink v-if="fixDescription(a.description.replace(/<br>/g, '')).more" class="text-primary" :to="`/a/${a?.id}/${fixSlug(a?.title?.romaji)}`">&nbsp;Read more</NuxtLink>
              </h6>
              <ButtonComp v-if="a?.trailer?.site === 'youtube'" v-ripple="{ color: 'rgba(0,0,0,0.4)' }" class="bg-primary text-dark mt-1 px-3 py-2" title="Watch Trailer" icon="ph:play-fill" @click="openVideoModal(a.trailer.id)">
                Watch Trailer
              </ButtonComp>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
