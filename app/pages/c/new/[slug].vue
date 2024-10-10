<script setup lang="ts">
definePageMeta({ layout: "no-footer" });

const { params } = useRoute("c-new-slug");
const { slug } = params;

const exists = categories.find(c => fixSlug(c.name) === slug) || null;

if (!exists) {
  throw createError({
    statusCode: 404,
    message: `Category not found: '${slug}'`,
    fatal: true
  });
}

const { data: result }: { data: Ref<AnimeList> } = await useFetch("/api/explore/newly?slug=" + slug);

useSeoMeta({
  title: `${result.value.title} ${result.value.category}` + " | Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: `${result.value.title} ${result.value.category}` + " | Categories | " + SITE.name,
  ogSiteName: SITE.name,
  ogUrl: SITE.url + `/c/new/${slug}`,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: `${result.value.title} ${result.value.category}` + " | Categories | " + SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/c/new/${slug}` }]
});
</script>

<template>
  <main>
    <section v-if="result" id="newly">
      <InfiniteList :data="result" />
    </section>
  </main>
</template>
