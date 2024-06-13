<script setup lang="ts">
const { data: data } = await useFetch("/api/explore") as Record<string, any>;

const trendings = data.value.preview.trending.media;
const animes_with_banner = trendings.filter((el: Record<string, string>) => el.bannerImage);

const random_anime = useState("random-anime", () => {
  return animes_with_banner.length ? getRandomObject(animes_with_banner) : getRandomObject(trendings);
});

onBeforeUnmount(() => {
  random_anime.value = animes_with_banner.length ? getRandomObject(animes_with_banner) : getRandomObject(trendings);
});

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
  twitterTitle: SITE.name,
});

useHead({
  link: [{ rel: "canonical", href: SITE.url }]
});

const upcoming = ref();
const loading = ref();

onMounted(async() => {
  loading.value = true;
  upcoming.value = { preview: await getUpcoming() };
  loading.value = false;
});
</script>

<template>
  <main>
    <section id="preview">
      <ComponentBanner :anime="random_anime" />
      <ComponentPreviewList :data="data" class="px-2 pt-4 pt-lg-5 px-xl-5 w-100" />
      <ComponentPreviewList v-if="upcoming" :data="upcoming" class="px-2 pt-4 pt-lg-5 px-xl-5 w-100" />
      <ComponentLoadingSpinner v-if="loading" />
    </section>
  </main>
</template>
