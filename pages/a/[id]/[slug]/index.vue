<script setup lang="ts">
const { params } = useRoute("a-id-slug");
const { id, slug } = params;
const { data: data, error } = await useFetch("/api/anime/" + id, { retry: 0 }) as Record<string, any>;

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    message: error.value.statusMessage,
    fatal: true
  });
}

const _slug = fixSlug(data.value?.title?.romaji);
if (slug.toLowerCase() !== _slug) {
  throw createError({
    statusCode: 404,
    message: `Anime not found: '${slug}'`,
    fatal: true
  });
}

const anime = data.value;

const externalLinks = ref(anime?.externalLinks
  .filter((e: { site: string }) => {
    const site = e?.site.toLowerCase();
    return site !== "youtube" && site !== "funimation";
  }));

if (anime.idMal) {
  externalLinks.value.unshift({
    color: "#2e51a2",
    icon: "/images/mal.png",
    site: "MyAnimeList",
    url: "https://myanimelist.net/anime/" + anime.idMal
  });
}

externalLinks.value.sort((a: Record<string, string>, b: Record<string, string>) => {
  return a?.site === "Official Site" ? -1 : b?.site === "Official Site" ? 1 : 0;
});

const streamingEpisodes = sortEpisodes(anime?.streamingEpisodes)?.slice(0, 6) || [];

const seoDescription = fixSeoDescription(anime?.description?.replace(/<[^>]*>/g, "") || "").text;

const recommendations = {
  preview: {
    recommendations: {
      media: anime?.recommendations?.nodes?.map((r: Record<string, any>) => r.mediaRecommendation)
    }
  }
};

useSeoMeta({
  title: anime.title.romaji + " | " + SITE.name,
  description: seoDescription,
  // Open Graph
  ogType: "website",
  ogTitle: anime.title.romaji + " | " + SITE.name,
  ogDescription: seoDescription,
  ogSiteName: SITE.name,
  ogUrl: SITE.url + `/a/${id}/${slug}`,
  ogImage: anime?.coverImage?.extraLarge,
  // Twitter
  twitterCard: "summary",
  twitterTitle: anime.title.romaji + " | " + SITE.name,
  twitterDescription: seoDescription
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/a/${id}/${slug}` }]
});

const animeGenres = anime?.genres || [];
const animeTags = anime?.tags?.map((t: Record<string, string>) => t.name) || [];

const genres = [...animeGenres, ...animeTags];
</script>

<template>
  <main>
    <section id="anime-page">
      <div class="col px-0 pb-5">
        <BannerBasic v-if="anime" :anime="anime" />
        <div class="px-2 pt-4 pt-lg-5 px-lg-5 px-xl-5 w-100">
          <AnimeMenu :anime-id="String(id)" :slug="String(slug)" :episodes="streamingEpisodes[0] ? true : false" />
          <div class="pt-4 px-0">
            <h4 class="mb-1 text-primary">{{ anime.title.romaji }} <span class="badge bg-secondary align-middle">{{ anime?.format?.replace(/_/g, " ") }}</span></h4>
            <h6 v-if="anime.title.english" class="mb-1">{{ anime.title.english }}</h6>
            <h6 v-if="anime.title.native" class="mb-1">{{ anime.title.native }}</h6>
            <div class="d-flex align-items-center position-relative">
              <div class="stars d-flex align-items-center" style="height: 25px;">
                <img class="position-absolute" src="/images/stars.webp" width="100" style="opacity: 0.5">
                <img src="/images/stars-filled.webp" width="100" :style="{ 'clip-path': 'inset(0px ' + (100-anime?.averageScore) + '% 0px 0px) ' }">
              </div>
              <small class="ms-2 mb-0 text-white">{{ getRating(anime.averageScore) }}</small>
            </div>
          </div>
          <div id="details" class="pt-3 pb-4 d-flex align-items-start anime-row mx-0 flex-wrap px-0">
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
                    <a v-if="site?.url" :href="site.url" target="_blank" class="d-flex align-items-center justify-content-center p-2 rounded" :style="{ 'background-color': site.color ? site.color : 'var(--bs-secondary)' }" :title="site.site">
                      <Icon v-if="!site?.icon" name="ph:globe-simple-bold" class="text-white" style="font-size: 33px;" />
                      <img v-else :src="site.icon" class="pe-none" style="width: 33px;">
                    </a>
                  </div>
                </div>
              </div>
              <div v-if="anime?.trailer?.site === 'youtube'">
                <div class="col-12 col-lg-12 col-xl-6">
                  <h6 class="text-primary">Trailer:</h6>
                  <div class="ratio ratio-16x9" data-aos="fade-in">
                    <iframe id="embed" width="1280" height="720" :src="'https://youtube.com/embed/' + anime.trailer.id" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope;" />
                  </div>
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
            <div class="d-flex justify-content-start align-items-start anime-row flex-wrap gx-0 gx-lg-3 gy-1 m-0">
              <div v-for="(c, i) of anime?.characters?.edges" :key="i" class="col-12 col-lg-6 col-xl-6 col-xxl-4 mb-3">
                <div class="d-flex align-items-start anime-row row-cols-auto g-2 bg-secondary rounded m-0 text-nowrap overflow-auto" data-aos="fade-in">
                  <div class="col ps-0 mt-0" style="max-width: 100px;">
                    <img :src="c.node.image.large" class="img-fluid rounded-start" style="max-height: 90px;" :alt="c.node?.name.userPreferred" :title="c.node?.name.userPreferred">
                  </div>
                  <div class="col text-start me-auto mt-0 py-1">
                    <small class="d-block text-primary">{{ c.node?.name.userPreferred }}</small>
                    <small class="text-capitalize">{{ c.role.toLowerCase() }}</small>
                  </div>
                  <div class="col text-end mt-0 py-1">
                    <small v-if="c.voiceActors[0]" class="d-block">
                      <NuxtLink :to="`/p/${c.voiceActors[0]?.id}/${fixSlug(c.voiceActors[0]?.name.userPreferred)}`">{{ c.voiceActors[0]?.name.userPreferred }}</NuxtLink>
                    </small>
                    <small class="text-capitalize text-muted">{{ c.voiceActors[0]?.languageV2 }}</small>
                  </div>
                  <div class="col pe-0 mt-0">
                    <img :src="c.voiceActors[0]?.image.large" class="img-fluid rounded-start" style="max-height: 90px;" :alt="c.voiceActors[0]?.name.userPreferred" :title="c.voiceActors[0]?.name.userPreferred">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="streamingEpisodes[0]" id="episodes">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h2 class="text-white mb-0">Episodes</h2>
              <NuxtLink :to="`/a/${id}/${slug}/episodes`">
                <h6 class="mb-0 text-muted">See more</h6>
              </NuxtLink>
            </div>
            <div class="d-flex justify-content-start align-items-start anime-row flex-wrap m-0 g-2">
              <template v-for="(ep, i) of streamingEpisodes" :key="i">
                <div class="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-3 col-xxl-2 mb-2">
                  <EpisodeCard :data="ep" />
                </div>
              </template>
            </div>
          </div>
          <template v-if="recommendations.preview?.recommendations?.media?.length">
            <hr class="my-5">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h2 class="mb-2">Recommendations</h2>
            </div>
            <AnimePreviewList :data="recommendations" />
          </template>
        </div>
      </div>
    </section>
  </main>
</template>
