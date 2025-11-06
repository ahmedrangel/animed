<script setup lang="ts">
const animesWithBanner = ref<Anime[]>([]);
const loading: Ref<boolean> = ref(true);
const previewData = ref<AnimePreviewList>({ preview: [] });

useSeoMeta({
  title: SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: SITE.name,
  ogUrl: SITE.url,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url }]
});

const data = computed(() => previewData.value);

onMounted(async () => {
  for (const type of availablePageTypes) {
    const list = await getPreviewList(type.name, { perPage: 12 });
    if (list) previewData.value.preview.push(list);
  }
  if (data.value.preview.length) {
    const trending = data.value?.preview?.find(el => el.type === "trending")?.media?.filter(anime => anime.bannerImage);
    const newly = data.value?.preview?.find(el => el.type === "new")?.media?.filter(anime => anime.bannerImage);
    const topRated = data.value?.preview?.find(el => el.type === "top-rated")?.media?.filter(anime => anime.bannerImage);
    animesWithBanner.value = [...new Set([...(trending || []), ...(newly || []), ...(topRated || [])])];
  }
  loading.value = false;
});
</script>

<template>
  <main>
    <section id="preview">
      <TransitionGroup name="fade">
        <SpinnerFullScreenLoading v-if="loading && !animesWithBanner.length && !data.preview.length" />
        <BannerDetailed v-if="animesWithBanner.length" :anime="animesWithBanner" />
        <AnimePreviewList v-if="data.preview.length" :data="data" class="px-2 py-4 py-lg-5 px-xl-5 w-100" />
        <SpinnerLoading v-if="loading && data.preview.length" class="py-5" />
      </TransitionGroup>
    </section>
  </main>
</template>
