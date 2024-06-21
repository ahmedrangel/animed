<script setup lang="ts">
const { params } = useRoute();
const { id, slug } = params;
const { data: data, error } = await useFetch("/api/anime/" + id + "/characters") as Record<string, any>;

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    message: error.value.data.error,
    fatal: true
  });
}

const _slug = fixSlug(data.value?.title.romaji);
if (slug !== _slug) {
  throw createError({
    statusCode: 404,
    message: `Anime not found: '${slug}'`,
    fatal: true
  });
}

const anime = data.value;

const streamingEpisodes = sortEpisodes(anime?.streamingEpisodes)?.slice(0, 6) || [];

useSeoMeta({
  title: anime.title.romaji + " | " + SITE.name,
  description: "Characters",
  // Open Graph
  ogType: "website",
  ogTitle: anime.title.romaji + " | " + SITE.name,
  ogDescription: "Characters",
  ogSiteName: SITE.name,
  ogUrl: SITE.url + `/a/${id}/${slug}/characters`,
  ogImage: anime?.coverImage?.extraLarge,
  // Twitter
  twitterCard: "summary",
  twitterTitle: anime.title.romaji + " | " + SITE.name,
  twitterDescription: "Characters"
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/a/${id}/${slug}/characters` }]
});
</script>

<template>
  <main>
    <section id="anime-page">
      <div class="col px-0 pb-5">
        <BannerBasic v-if="anime" :anime="anime" />
        <div class="px-2 pt-4 pt-lg-5 px-lg-5 px-xl-5 w-100">
          <AnimeMenu :anime-id="String(id)" :slug="String(slug)" :episodes="streamingEpisodes[0] ? true : false" />
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
          <div v-if="anime?.characters?.edges[0]" id="characters" class="pb-4">
            <InfiniteCharacters :data="anime" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
