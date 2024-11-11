<script setup lang="ts">
const isSameRoute = isSameRouteNavigation();
if (isSameRoute) {
  definePageMeta({
    layout: "default",
    pageTransition: false,
    layoutTransition: false
  });
}
const { params } = useRoute("a-id-slug-episodes");
const { id, slug } = params;

const anime = ref<Anime>();
const computeStreamingEpisodes = ref<Anime["streamingEpisodes"]>([]);
const seoTitle = ref<string>(SITE.name);
const seoImage = ref<string>();
const loading = ref<boolean>(true);

const statedInfo = useState<Anime>(`${id}-info`);
const animeTitles = ref(statedInfo.value?.title);
const animeBanner = ref(statedInfo.value?.bannerImage);
const animeEpisodes = ref(statedInfo.value?.streamingEpisodes);
const animeFormat = ref(statedInfo.value?.format);
const animeScore = ref(statedInfo.value?.averageScore);
const animeNextAiring = ref(statedInfo.value?.nextAiringEpisode);

const streamingEpisodes = computed({
  get () {
    return computeStreamingEpisodes.value;
  },
  set (data) {
    computeStreamingEpisodes.value = sortEpisodes(data);
  }
});

onMounted(async () => {
  anime.value = statedInfo.value?.streamingEpisodes ? statedInfo.value : await getAnimeEpisodes({ id: Number(id), slug });
  animeTitles.value = anime.value?.title;
  animeBanner.value = anime.value?.bannerImage;
  animeEpisodes.value = anime.value?.streamingEpisodes;
  animeFormat.value = anime.value?.format;
  animeScore.value = anime.value?.averageScore;
  animeNextAiring.value = anime.value?.nextAiringEpisode;

  streamingEpisodes.value = anime.value.streamingEpisodes;
  loading.value = false;

  seoTitle.value = anime.value.title.romaji + " | " + SITE.name;
  seoImage.value = anime.value.coverImage?.extraLarge;

  if (anime.value) {
    useState(`${id}-info`, () => {
      return {
        title: anime.value?.title,
        bannerImage: anime.value?.bannerImage,
        averageScore: anime.value?.averageScore,
        format: anime.value?.format,
        nextAiringEpisode: anime.value?.nextAiringEpisode,
        streamingEpisodes: anime.value?.streamingEpisodes
      };
    });
  }
});

useSeoMeta({
  title: seoTitle,
  description: "Episodes",
  // Open Graph
  ogType: "website",
  ogTitle: seoTitle,
  ogDescription: "Episodes",
  ogUrl: SITE.url + `/a/${id}/${slug}/episodes`,
  ogImage: seoImage,
  // Twitter
  twitterCard: "summary",
  twitterTitle: seoTitle,
  twitterDescription: "Episodes"
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/a/${id}/${slug}/episodes` }]
});
</script>

<template>
  <main>
    <section id="anime-page">
      <SpinnerLoading v-if="loading && !isSameRoute" style="height: 100vh;" />
      <div class="col px-0 pb-5">
        <BannerBasic v-if="statedInfo || anime" :anime="statedInfo || anime" :aos="Boolean(statedInfo.bannerImage ? false : true)" />
        <div class="px-2 pt-4 pt-lg-5 px-lg-5 px-xl-5 w-100">
          <AnimeMenu v-if="animeEpisodes" :anime-id="String(id)" :slug="String(slug)" />
          <div v-if="statedInfo || anime" :anime="statedInfo || anime" class="pt-4 pb-3 px-0">
            <h4 class="mb-1 text-primary">{{ animeTitles.romaji }} <span class="badge bg-secondary align-middle">{{ animeFormat.replace(/_/g, " ") }}</span></h4>
            <h6 v-if="animeTitles.english" class="mb-1">{{ animeTitles.english }}</h6>
            <h6 v-if="animeTitles.native" class="mb-1">{{ animeTitles.native }}</h6>
            <div class="d-flex align-items-center position-relative">
              <div class="stars d-flex align-items-center" style="height: 25px;">
                <img class="position-absolute" src="/images/stars.webp" width="100" style="opacity: 0.5">
                <img src="/images/stars-filled.webp" width="100" :style="{ 'clip-path': 'inset(0px ' + (100 - (animeScore || 0)) + '% 0px 0px) ' }">
              </div>
              <small class="ms-2 mb-0 text-white">{{ getRating(animeScore || 0) }}</small>
            </div>
            <span v-if="animeNextAiring?.airingAt && (animeNextAiring?.airingAt * 1000 > Date.now())" class="mt-1 d-inline-block p-1 rounded bg-secondary">
              <h6 class="d-flex align-items-center justify-content-center gap-1 m-0">
                <Icon class="text-info" name="mdi:broadcast" />
                <span class="text-center">Next Episode · <span class="text-primary">E{{ animeNextAiring?.episode }}</span> · {{ useTimeAgo(animeNextAiring.airingAt * 1000) }}</span>
              </h6>
            </span>
          </div>
          <div v-if="animeEpisodes?.length" id="episodes">
            <h2 class="text-white mb-2">Episodes</h2>
            <div class="d-flex anime-row flex-wrap g-2">
              <template v-for="(ep, i) of animeEpisodes" :key="i">
                <div class="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-3 col-xxl-3 mb-2">
                  <EpisodeCard :data="ep" />
                </div>
              </template>
            </div>
          </div>
          <SpinnerLoading v-else />
        </div>
      </div>
    </section>
  </main>
</template>
