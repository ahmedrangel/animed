<script setup lang="ts">
const { data: data, error }: { data: Ref<AnimePreviewList>, error: Ref<FetchError> } = await useFetch("/api/explore");

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    message: error.value.statusMessage,
    fatal: true
  });
}

const trendings = data.value.preview?.trending?.media || data.value.preview?.newly?.media || data.value.preview.top?.media as Anime[];
const animesWithBanner = trendings?.filter(el => el.bannerImage) || trendings;

useSeoMeta({
  title: SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: SITE.name,
  ogUrl: SITE.url,
  ogSiteName: SITE.name,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url }]
});

const upcoming: Ref<AnimePreviewList | undefined> = ref();
const loading: Ref<boolean> = ref(false);

onMounted(async () => {
  loading.value = true;
  upcoming.value = {
    preview: {
      upcoming: {
        ...(await getUpcoming({ perPage: 12 })).data,
        route: "/c/upcoming"
      }
    }
  };
  loading.value = false;
});
</script>

<template>
  <main>
    <section id="preview">
      <BannerDetailed :anime="animesWithBanner" />
      <AnimePreviewList :data="data" class="px-2 pt-4 pt-lg-5 px-xl-5 w-100" />
      <AnimePreviewList v-if="upcoming" :data="upcoming" class="px-2 pt-4 pt-lg-5 px-xl-5 w-100" />
      <SpinnerLoading v-if="loading" />
    </section>
  </main>
</template>
