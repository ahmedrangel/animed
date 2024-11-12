<script setup lang="ts">
const isSameRoute = isSameRouteNavigation();
if (isSameRoute) {
  definePageMeta({
    layout: "default",
    pageTransition: false,
    layoutTransition: false
  });
}

const { params } = useRoute("a-id-slug");
const { id, slug } = params;

const anime = ref<Anime>();
const recommendations = ref<AnimePreviewList>();
const themes = ref<AnimeThemes | null>();
const openings = ref();
const endings = ref();
const moreThemes = ref(false);
const genres = ref<string[]>([]);
const seoDescription = ref<string>();
const seoTitle = ref<string>(SITE.name);
const computeExternalLinks = ref<Anime["externalLinks"]>([]);
const computeStreamingEpisodes = ref<Anime["streamingEpisodes"]>([]);
const loading = ref(true);

const statedInfo = useState<Anime>(`${id}-info`);
const animeTitles = ref(statedInfo.value?.title);
const animeBanner = ref(statedInfo.value?.bannerImage);
const animeEpisodes = ref(statedInfo.value?.streamingEpisodes);
const animeFormat = ref(statedInfo.value?.format);
const animeScore = ref(statedInfo.value?.averageScore);
const animeNextAiring = ref(statedInfo.value?.nextAiringEpisode);

const externalLinks = computed({
  get () {
    return computeExternalLinks.value;
  },
  set (data) {
    const newData = data.filter((e) => {
      const site = e?.site.toLowerCase();
      return site !== "youtube" && site !== "funimation";
    });

    if (anime.value?.idMal) {
      newData.unshift({
        color: "#2e51a2",
        icon: "/images/mal.png",
        site: "MyAnimeList",
        url: "https://myanimelist.net/anime/" + anime.value.idMal
      });
    }

    computeExternalLinks.value = newData.toSorted((a, b) => {
      return a?.site === "Official Site" ? -1 : b?.site === "Official Site" ? 1 : 0;
    });
  }
});

const streamingEpisodes = computed({
  get () {
    return computeStreamingEpisodes.value;
  },
  set (data) {
    const newData = sortEpisodes(data)?.slice(0, 6) || [];
    computeStreamingEpisodes.value = newData;
  }
});

const sharedInfoHandler = (value: Anime) => {
  animeTitles.value = value?.title;
  animeBanner.value = value?.bannerImage;
  animeEpisodes.value = value?.streamingEpisodes;
  animeFormat.value = value?.format;
  animeScore.value = value?.averageScore;
  animeNextAiring.value = value?.nextAiringEpisode;
  externalLinks.value = value?.externalLinks;
  streamingEpisodes.value = value?.streamingEpisodes;

  recommendations.value = {
    preview: [
      {
        media: value?.recommendations?.nodes?.map(r => r.mediaRecommendation),
        type: "recommendations"
      }
    ]
  };

  const animeGenres = value?.genres || [];
  const animeTags = value?.tags?.map(t => t.name) || [];
  genres.value = [...animeGenres, ...animeTags] as string[];

  seoDescription.value = fixSeoDescription(value?.description?.replace(/<[^>]*>/g, "") || "").text;
  seoTitle.value = value?.title?.romaji + " | " + SITE.name;
};

const userAgent = useRequestHeaders(["User-Agent"])["user-agent"];
const { isCrawler } = useDetectCrawler(userAgent);
if (isCrawler) {
  const data = await $fetch<Anime>(`/api/anime/${id}`, { headers: { "User-Agent": userAgent || "" } });
  if (data.slug && data?.slug?.toLowerCase() !== slug) {
    throw createError({
      statusCode: 404,
      message: `Anime not found: '${slug}'`,
      fatal: true
    });
  }
  anime.value = data;
  sharedInfoHandler(data);
}

onMounted(async () => {
  anime.value = await getAnimeInfo({ id: Number(id), slug });
  sharedInfoHandler(anime.value);
  loading.value = false;

  const animeflv = await getAflvSearch(encodeURIComponent(anime.value?.title?.english || anime.value?.title?.native));
  if (animeflv?.length) {
    const foundRelation = animeFlvRelationLogic(animeflv, anime.value);
    if (foundRelation) externalLinks.value.push(foundRelation);
  }

  themes.value = anime.value.idMal ? await getAnimeThemes(anime.value.idMal) : null;
  openings.value = themes.value?.openings.slice(0, 10);
  endings.value = themes.value?.endings.slice(0, 10);

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
  description: seoDescription,
  // Open Graph
  ogType: "website",
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: SITE.url + `/a/${id}/${slug}`,
  ogImage: anime.value?.coverImage?.extraLarge,
  // Twitter
  twitterCard: "summary",
  twitterTitle: seoTitle,
  twitterDescription: seoDescription
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/a/${id}/${slug}` }]
});

const toggleMoreThemes = () => {
  moreThemes.value = !moreThemes.value;
  openings.value = moreThemes.value && themes ? themes.value?.openings : openings.value?.slice(0, 10);
  endings.value = moreThemes.value && themes ? themes.value?.endings : endings.value?.slice(0, 10);
};

const fixTheme = (text: string) => {
  return text.replace(/"/g, "").replace(/(\d+|\w+): /g, "");
};
</script>

<template>
  <main>
    <section id="anime-page">
      <SpinnerLoading v-if="loading && !isSameRoute" style="height: 100vh;" />
      <div class="col px-0 pb-5">
        <BannerBasic v-if="statedInfo || anime" :anime="statedInfo || anime" :aos="Boolean(statedInfo?.bannerImage ? false : true)" />
        <div class="px-2 pt-4 pb-2 pt-lg-5 px-lg-5 px-xl-5 w-100">
          <AnimeMenu v-if="animeEpisodes" :anime-id="String(id)" :slug="String(slug)" :episodes="Boolean(animeEpisodes?.length)" />
          <div v-if="anime || statedInfo" class="pt-4 px-0">
            <h4 class="mb-1 text-primary">{{ animeTitles.romaji }} <span class="badge bg-secondary align-middle">{{ animeFormat?.replace(/_/g, " ") }}</span></h4>
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
          <div v-if="anime">
            <div id="details" class="pt-2 pb-4 d-flex align-items-start anime-row mx-0 flex-wrap px-0">
              <img id="cover" :src="anime?.coverImage?.extraLarge" class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 img-fluid px-0" style="max-width: 400px;" :alt="anime.title.romaji" :title="anime.title.romaji" data-aos="fade-in">
              <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-9 pt-4 pt-md-0 px-0 ps-md-4">
                <div v-if="anime?.description" class="pb-4">
                  <h2 class="text-white">Description</h2>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <h6 class="mb-0 fw-normal" v-html="anime.description" />
                </div>
                <div class="d-flex justify-content-start align-items-start anime-row flex-wrap m-0">
                  <h6 v-if="anime.status" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Status:</span>&nbsp; {{ anime.status.toLowerCase().replace(/_/g, " ") }}
                  </h6>
                  <h6 v-if="anime.startDate?.year" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                    <span class="text-primary">Release Date:</span>&nbsp; {{ anime.startDate.year ? formatDate(anime.startDate.year, anime.startDate.month, anime.startDate.day) : "TBA" }}
                  </h6>
                  <h6 v-if="anime.endDate?.year" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                    <span class="text-primary">End Date:</span>&nbsp; {{ anime.endDate?.year ? formatDate(anime.endDate.year, anime.endDate.month, anime.endDate.day) : "TBA" }}
                  </h6>
                  <h6 v-if="anime.episodes" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                    <span class="text-primary">Episodes:</span>&nbsp; {{ anime.episodes }}
                  </h6>
                  <h6 v-if="anime.duration" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                    <span class="text-primary">Episode Duration:</span>&nbsp; {{ anime.duration }} mins
                  </h6>
                  <h6 v-if="anime.season" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Season:</span>&nbsp; {{ anime.season.toLowerCase() }} {{ anime.seasonYear }}
                  </h6>
                  <h6 v-if="anime.source" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Source:</span>&nbsp; {{ anime.source.toLowerCase().replace(/_/g, " ") }}
                  </h6>
                  <h6 v-if="getStudios(anime.studios)" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                    <span class="text-primary">Studios:</span>&nbsp; {{ getStudios(anime.studios) }}
                  </h6>
                  <h6 v-if="getProducers(anime.studios)" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                    <span class="text-primary">Producers:</span>&nbsp; {{ getProducers(anime.studios) }}
                  </h6>
                </div>
                <div v-if="anime.genres || anime.tags">
                  <h6 class="mb-2">
                    <span class="text-primary">Genres:</span>&nbsp;
                    <span v-for="(genre, i) of genres" :key="i" class="mx-1">
                      <NuxtLink v-if="categories.some(c => c.name.toLowerCase() === genre.toLowerCase())" :to="`/c/${fixSlug(genre)}`">
                        <span class="badge bg-secondary align-middle fw-normal my-1">{{ genre }}</span>
                      </NuxtLink>
                      <span v-else class="badge bg-secondary align-middle fw-normal my-1">{{ genre }}</span>
                    </span>
                  </h6>
                </div>
                <div v-if="externalLinks" class="py-2 mb-2">
                  <h6 class="text-primary">External Links:</h6>
                  <div class="d-flex flex-wrap gap-2 align-items-end">
                    <div v-for="(site, i) of externalLinks" :key="i">
                      <a v-if="site?.url" :href="site.url" target="_blank" class="d-flex align-items-center justify-content-center p-2 rounded" :style="{ 'background-color': site.color ? site.color : 'var(--bs-secondary)' }" :title="site.site" style="width: 50px; height: 50px">
                        <Icon v-if="!site?.icon" name="ph:globe-simple-bold" class="text-white" style="font-size: 33px;" />
                        <img v-else :src="site.icon" class="pe-none" style="width: 33px;">
                      </a>
                    </div>
                  </div>
                </div>
                <div v-if="anime?.trailer?.site === 'youtube'">
                  <div class="col-12 col-lg-12 col-xl-6">
                    <h6 class="text-primary">Trailer:</h6>
                    <VideoContainer :video-id="anime.trailer.id" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="anime?.characters?.edges[0]" id="characters" class="pb-4">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h2 class="text-white mb-0">Characters</h2>
                <NuxtLink :to="`/a/${id}/${slug}/characters`">
                  <h6 class="mb-0 text-muted">See more</h6>
                </NuxtLink>
              </div>
              <div class="d-flex anime-row flex-wrap gx-0 gx-lg-4 gy-4 pt-2 px-1">
                <div v-for="(c, i) of anime?.characters?.edges" :key="i" class="col-12 col-lg-6 col-xl-6 col-xxl-4">
                  <div class="d-flex align-items-start anime-row row-cols-auto g-2 bg-secondary rounded text-nowrap overflow-auto" data-aos="fade-in">
                    <div class="col ps-0 mt-0" style="max-width: 100px;">
                      <img :src="c.node.image.large" class="img-fluid rounded-start rounded-end-0" style="max-height: 90px;" :alt="c.node?.name.userPreferred" :title="c.node?.name.userPreferred">
                    </div>
                    <div class="col text-start me-auto mt-0 py-1">
                      <small class="d-block text-primary">{{ c.node?.name.userPreferred }}</small>
                      <small class="text-capitalize">{{ c.role.toLowerCase() }}</small>
                    </div>
                    <div class="col text-end mt-0 py-1">
                      <small v-if="c.voiceActors[0]" class="d-block">
                        <NuxtLink :to="`/p/${c.voiceActors[0]?.id}/${fixSlug(c.voiceActors[0]?.name.userPreferred!)}`">{{ c.voiceActors[0]?.name.userPreferred }}</NuxtLink>
                      </small>
                      <small class="text-capitalize text-muted">{{ c.voiceActors[0]?.languageV2 }}</small>
                    </div>
                    <div class="col pe-0 mt-0">
                      <img :src="c.voiceActors[0]?.image.large" class="img-fluid rounded-start-0 rounded-end" style="max-height: 90px;" :alt="c.voiceActors[0]?.name.userPreferred" :title="c.voiceActors[0]?.name.userPreferred">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="streamingEpisodes?.length" id="episodes" class="pb-4">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h2 class="text-white mb-0">Episodes</h2>
                <NuxtLink :to="`/a/${id}/${slug}/episodes`">
                  <h6 class="mb-0 text-muted">See more</h6>
                </NuxtLink>
              </div>
              <div class="d-flex anime-row flex-wrap g-2">
                <template v-for="(ep, i) of streamingEpisodes" :key="i">
                  <div class="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-3 col-xxl-2 mb-2">
                    <EpisodeCard :data="ep" />
                  </div>
                </template>
              </div>
            </div>
            <div v-if="openings?.length || endings?.length" id="themes" class="pb-2">
              <div class="d-flex anime-row flex-wrap g-2">
                <div v-if="themes?.openings" class="col-6 m-0">
                  <h2 class="mb-2">Openings:</h2>
                  <hr>
                  <ol class="small mb-0" data-aos="fade-in">
                    <li v-for="(op, i) of openings" :key="i" class="mb-2">
                      <a :href="`https://www.youtube.com/results?search_query=${encodeURIComponent(fixTheme(op).replace(/\(eps.*?\)/g, ''))}`" target="_blank">
                        <h6 class="mb-0 fw-light">{{ fixTheme(op) }}</h6>
                      </a>
                    </li>
                  </ol>
                </div>
                <div v-if="themes?.endings" class="col-6 m-0">
                  <h2 class="mb-2">Endings:</h2>
                  <hr>
                  <ol class="small mb-0" data-aos="fade-in">
                    <li v-for="(en, i) of endings" :key="i" class="mb-2">
                      <a :href="`https://www.youtube.com/results?search_query=${encodeURIComponent(fixTheme(en).replace(/\(eps.*?\)/g, ''))}`" target="_blank">
                        <h6 class="mb-0 fw-light">{{ fixTheme(en) }}</h6>
                      </a>
                    </li>
                  </ol>
                </div>
                <a v-if="themes && (themes?.endings.length > 10 || themes?.endings.length > 10)" class="ms-auto" role="button" @click="toggleMoreThemes()">
                  <div class="d-flex align-items-center gap-1">
                    <Icon v-if="!moreThemes" name="ph:caret-down-bold" />
                    <Icon v-else name="ph:caret-up-bold" />
                    <span>{{ !moreThemes ? 'More' : 'Less' }} theme songs</span>
                  </div>
                </a>
              </div>
            </div>
            <template v-if="recommendations?.preview?.[0]?.media?.length">
              <hr class="pb-4 m-0">
              <div class="d-flex justify-content-between align-items-center">
                <h2 class="mb-2">Recommendations</h2>
              </div>
              <AnimePreviewList :data="recommendations" />
            </template>
          </div>
          <SpinnerLoading v-else />
        </div>
      </div>
    </section>
  </main>
</template>
