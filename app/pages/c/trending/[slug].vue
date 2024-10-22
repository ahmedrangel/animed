<script setup lang="ts">
const { params } = useRoute("c-trending-slug");
const { slug } = params;

const exists = categories.find(c => fixSlug(c.name) === slug) || null;

if (!exists) {
  throw createError({
    statusCode: 404,
    message: `Category not found: '${slug}'`,
    fatal: true
  });
}

const { data: result }: { data: Ref<AnimeList> } = await useFetch("/api/explore/popular?slug=" + slug);

useSeoMeta({
  title: `${result.value.title} ${result.value.category}` + " | Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: `${result.value.title} ${result.value.category}` + " | Categories | " + SITE.name,
  ogSiteName: SITE.name,
  ogUrl: SITE.url + `/c/trending/${slug}`,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: `${result.value.title} ${result.value.category}` + " | Categories | " + SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/c/trending/${slug}` }]
});
</script>

<template>
  <main>
    <section v-if="result" id="trending">
      <InfiniteList :data="result" />
    </section>
  </main>
</template>
