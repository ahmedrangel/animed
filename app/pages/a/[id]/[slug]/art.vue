<script setup lang="ts">
import MasonryWall from "@yeger/vue-masonry-wall";

const { lastRoute, currentRoute } = useNavigationRoute();
const fromSameRoute = fromSameRouteParams(lastRoute, currentRoute);
if (fromSameRoute) definePageMeta({ pageTransition: false, layoutTransition: false });

const { params } = useRoute("a-id-slug-characters");
const { id, slug } = params;

const anime = ref<Anime>();
const seoTitle = ref<string>(SITE.name);
const seoImage = ref<string>();
const loading = ref<boolean>(true);

const images = ref<{
  url: string;
  itemListElement: {
    name: string;
    url: string;
    thumbnailUrl: string;
  }[];
}>();

const statedInfo = useState<Anime>(`${id}-info`);
const animeTitles = ref(statedInfo.value?.title);
const animeBanner = ref(statedInfo.value?.bannerImage);
const animeEpisodes = ref(statedInfo.value?.streamingEpisodes);
const animeFormat = ref(statedInfo.value?.format);
const animeScore = ref(statedInfo.value?.averageScore);
const animeNextAiring = ref(statedInfo.value?.nextAiringEpisode);

const sharedInfoHandler = (value: Anime) => {
  animeTitles.value = value?.title;
  animeBanner.value = value?.bannerImage;
  animeEpisodes.value = value?.streamingEpisodes;
  animeFormat.value = value?.format;
  animeScore.value = value?.averageScore;
  animeNextAiring.value = value?.nextAiringEpisode;
  seoTitle.value = value.title.romaji + " | " + SITE.name;
  seoImage.value = value.coverImage?.extraLarge;
};

const userAgent = useRequestHeaders(["User-Agent"])["user-agent"];
const { isCrawler } = useDetectCrawler(userAgent);
if (isCrawler) {
  const data = await $fetch<Anime>(`/api/anime/${id}/images`, { headers: { "User-Agent": userAgent || "" } });
  if (data?.slug?.toLowerCase() !== slug) {
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
  if (!anime.value) {
    throw createError({
      statusCode: 404,
      message: `Anime not found: '${slug}'`,
      fatal: true
    });
  }
  sharedInfoHandler(anime.value);
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
  images.value = await $fetch(`/api/anime/${encodeURIComponent(anime.value.title.romaji)}/art`).catch(() => null);
  loading.value = false;
});

useSeoMeta({
  title: seoTitle,
  description: "Art",
  // Open Graph
  ogType: "website",
  ogTitle: seoTitle,
  ogDescription: "Art",
  ogUrl: SITE.url + `/a/${id}/${slug}/art`,
  ogImage: seoImage,
  // Twitter
  twitterCard: "summary",
  twitterTitle: seoTitle,
  twitterDescription: "Art"
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/a/${id}/${slug}/art` }, { rel: "preconnect", href: "https://static.zerochan.net" }]
});

const getZerochanURL = (url: string) => {
  const parts = url.split(".");
  const id = parts[parts.length - 2];
  return `https://www.zerochan.net/${id}`;
};
</script>

<template>
  <main>
    <section id="anime-page-art">
      <TransitionGroup name="fade">
        <SpinnerFullScreenLoading v-if="loading && !fromSameRoute" />
        <div v-else class="col px-0 pb-5">
          <BannerBasic v-if="statedInfo || anime" :anime="statedInfo || anime" :aos="!fromSameRoute" />
          <div class="px-2 pt-4 pt-lg-5 px-lg-5 px-xl-5 w-100">
            <AnimeMenu v-if="animeEpisodes" :anime-id="String(id)" :slug="String(slug)" :episodes="Boolean(animeEpisodes?.length)" />
            <div v-if="statedInfo || anime" :anime="statedInfo || anime" class="pt-4 pb-3 px-0">
              <h4 class="mb-1 text-primary">{{ animeTitles.romaji }} <span v-if="animeFormat" class="badge bg-secondary align-middle">{{ animeFormat.replace(/_/g, " ") }}</span></h4>
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
            <Transition name="fade">
              <div v-if="images && images.itemListElement" class="text-center">
                <div class="alert alert-secondary d-flex align-items-center gap-1 fst-italic" role="alert">
                  <Icon name="ph:info-bold" />
                  <small class="d-block">These arts could not be related to the anime. They are sourced from <NuxtLink href="https://www.zerochan.net/" target="_blank" external>Zerochan.net</NuxtLink></small>
                </div>
                <MasonryWall :items="images.itemListElement" :gap="16" :max-columns="6" :min-columns="2" :column-width="277">
                  <template #default="{ item }">
                    <div class="overflow-hidden rounded-2">
                      <NuxtLink v-ripple :to="getZerochanURL(item.url) || item.url" target="_blank" external class="position-relative">
                        <img :src="item.thumbnailUrl" style="width: 100%" class="scale-on-hover">
                      </NuxtLink>
                    </div>
                  </template>
                </MasonryWall>
                <NuxtLink :to="images.url" target="_blank" external>
                  <ButtonComp v-ripple class="mt-5 bg-primary">
                    <span style="color: var(--bs-dark)!important">See more</span>
                  </ButtonComp>
                </NuxtLink>
              </div>
            </Transition>
            <SpinnerLoading v-if="loading && fromSameRoute" />
          </div>
        </div>
      </TransitionGroup>
    </section>
  </main>
</template>
