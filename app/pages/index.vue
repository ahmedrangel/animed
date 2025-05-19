<script setup lang="ts">
const trendings = ref<Anime[] | undefined>([]);
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

const data = computed({
  get () {
    return previewData.value;
  },
  set () {
    if (data.value.preview.length) {
      trendings.value = data.value?.preview?.find(el => el.type === "trending")?.media || data.value?.preview?.find(el => el.type === "new")?.media || data.value?.preview?.find(el => el.type === "top-rated")?.media || [];
      animesWithBanner.value = trendings.value?.filter(el => el.bannerImage) as Anime[] || trendings.value;
    }
  }
});

onMounted(async () => {
  for (const type of availablePageTypes) {
    const list = await getPreviewList(type.name, { perPage: 12 });
    previewData.value.preview.push(list);
    data.value = previewData.value;
  }
  loading.value = false;
});
</script>

<template>
  <main>
    <section id="preview">
      <TransitionGroup name="fade">
        <SpinnerFullScreenLoading v-if="loading && !animesWithBanner.length" />
        <BannerDetailed v-if="animesWithBanner.length" :anime="animesWithBanner" />
        <AnimePreviewList v-if="data.preview.length" :data="data" class="px-2 py-4 py-lg-5 px-xl-5 w-100" />
        <SpinnerLoading v-if="loading && data.preview.length" class="py-5" />
      </TransitionGroup>
    </section>
  </main>
</template>
