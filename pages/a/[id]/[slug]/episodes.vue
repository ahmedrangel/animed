<script setup lang="ts">
const { params } = useRoute();
const { id, slug } = params;
const { data: data } = await useFetch("/api/anime/" + id + "/episodes") as Record<string, any>;

const _slug = fixSlug(data.value.title.romaji);
if (slug !== _slug) {
  throw createError({
    statusCode: 404,
    message: `Anime not found: '${slug}'`,
    fatal: true
  });
}

const anime = data.value;
const streamingEpisodes = sortEpisodes(anime.streamingEpisodes);

useSeoMeta({
  title: anime.title.romaji + " | " + SITE.name,
  description: "Episodes",
  // Open Graph
  ogType: "website",
  ogTitle: anime.title.romaji + " | " + SITE.name,
  ogDescription: "Episodes",
  ogSiteName: SITE.name,
  ogUrl: SITE.url + `/a/${id}/${slug}/episodes`,
  ogImage: anime?.coverImage?.extraLarge,
  // Twitter
  twitterCard: "summary",
  twitterTitle: anime.title.romaji + " | " + SITE.name,
  twitterDescription: "Episodes"
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/a/${id}/${slug}/episodes` }]
});
</script>

<template>
  <main>
    <section id="anime-page">
      <div class="col px-0 pb-5">
        <BannerBasic v-if="anime" :anime="anime" />
        <div class="px-2 pt-4 pt-lg-5 px-lg-5 px-xl-5 w-100">
          <AnimeMenu :anime-id="String(id)" :slug="String(slug)" />
          <div class="py-4 px-0">
            <h4 class="mb-1 text-primary">{{ anime.title.romaji }} <span class="badge bg-secondary align-middle">{{ anime.format.replace(/_/g, " ") }}</span></h4>
            <h6 v-if="anime.title.english" class="mb-1">{{ anime.title.english }}</h6>
            <h6 v-if="anime.title.native" class="mb-1">{{ anime.title.native }}</h6>
            <div class="d-flex align-items-center position-relative">
              <div class="stars d-flex align-items-center" style="height: 25px;">
                <img class="position-absolute" src="/images/stars.webp" width="100" style="opacity: 0.5">
                <img src="/images/stars-filled.webp" width="100" :style="{ 'clip-path': 'inset(0px ' + (100-anime.averageScore) + '% 0px 0px) ' }">
              </div>
              <small class="ms-2 mb-0 text-white">{{ getRating(anime.averageScore) }}</small>
            </div>
          </div>
          <div v-if="streamingEpisodes[0]" id="episodes">
            <h2 class="text-white mb-2">Episodes</h2>
            <div class="d-flex justify-content-start align-items-start anime-row flex-wrap m-0 g-2">
              <template v-for="(ep, i) of streamingEpisodes" :key="i">
                <div class="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-3 col-xxl-3 mb-2">
                  <EpisodeCard :data="ep" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
