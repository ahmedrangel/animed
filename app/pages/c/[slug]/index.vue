<script setup lang="ts">
const { params } = useRoute("c-slug");
const { slug } = params;

if (slug === "all") navigateTo("/", { redirectCode: 301 });

const exists = categories.find(c => fixSlug(c.name) === slug) || null;

if (!exists) {
  throw createError({
    statusCode: 404,
    message: `Category not found: '${slug}'`,
    fatal: true
  });
}

const category = exists.name;
const animesWithBanner = ref<Anime[]>([]);
const loading: Ref<boolean> = ref(true);
const previewData = ref<AnimePreviewList>({ preview: [], category });

useSeoMeta({
  title: category + " | Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: category + " | Categories | " + SITE.name,
  ogUrl: SITE.url + `/c/${slug}`,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: category + " | Categories | " + SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/c/${slug}` }]
});

const data = computed(() => previewData.value);

onMounted(async () => {
  const cat_title = categories.find(c => fixSlug(c.name) === slug)!.name;
  const cat_type = categories.find(c => fixSlug(c.name) === slug)?.type;
  const options = cat_type === "genre" ? { genres: [cat_title] } : { tags: [cat_title] };
  const explore = await getExplore({ ...options, slug });
  previewData.value.preview = explore;
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
  <main v-if="exists">
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
