<script setup lang="ts">
const { data: data } = await useFetch("/api/explore/") as Record<string, any>;
const random_anime = useState("random-anime", () => null);

const trendings = data.value.preview[data.value.preview.length - 1].data;

if (!random_anime.value) {
  const animes_with_banner = trendings.filter((el: Record<string, string>) => el.bannerImage);
  random_anime.value = animes_with_banner.length ? getRandomObject(animes_with_banner) : getRandomObject(trendings);
}

onBeforeUnmount(() => {
  random_anime.value = null;
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
</script>

<template>
  <main>
    <section id="preview">
      <ComponentBanner v-if="random_anime" :anime="random_anime" />
      <ComponentPreviewList :data="data" />
    </section>
  </main>
</template>
