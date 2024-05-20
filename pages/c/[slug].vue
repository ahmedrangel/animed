<script setup lang="ts">
const { params } = useRoute();
const { slug } = params;

const exists = categories.find((c) => fixSlug(c.name) === slug) || null;

if (!exists) {
  throw createError({
    statusCode: 404,
    message: `Category not found: '${slug}'`,
    fatal: true
  });
}
const { data: data } = await useFetch("/api/explore?slug=" + slug) as Record<string, any>;
const random_anime = useState("random-anime", () => null);

const newlies = data.value.preview[0].data;

if (!random_anime.value) {
  const animes_with_banner = newlies.filter((el: Record<string, string>) => el.bannerImage);
  random_anime.value = animes_with_banner.length ? getRandomObject(animes_with_banner) : getRandomObject(newlies);
}

onBeforeUnmount(() => {
  random_anime.value = null;
});

useSeoMeta({
  title: data.value.category + " | Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: data.value.category + " | Categories | " + SITE.name,
  ogSiteName: SITE.name,
  ogUrl: SITE.url + `/c/${slug}`,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: data.value.category + " | Categories | " + SITE.name,
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/c/${slug}` }]
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
