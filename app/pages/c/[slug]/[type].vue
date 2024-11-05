<script setup lang="ts">
const { params } = useRoute("c-slug-type");
const { type, slug } = params;
const pageType = availablePageTypes.find(t => t.name === type);
const isAllCategories = slug === "all";
const exists = ((categories.find(c => fixSlug(c.name) === slug) || isAllCategories) && pageType) || null;

if (!exists) {
  throw createError({
    statusCode: 404,
    message: `Category not found: '${!pageType ? type : slug}'`,
    fatal: true
  });
}

const route = isAllCategories ? `${pageType?.routeType}` : `${pageType?.routeType}?slug=${slug}`;
const path = `/c/${slug}/${pageType?.name}`;
const { data: result }: { data: Ref<AnimeList> } = await useFetch(`/api/explore/${route}`);

useSeoMeta({
  title: `${result.value.title} ${result.value.category || ""}` + " | Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: `${result.value.title} ${result.value.category || ""}` + " | Categories | " + SITE.name,
  ogSiteName: SITE.name,
  ogUrl: SITE.url + path,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: `${result.value.title} ${result.value.category || ""}` + " | Categories | " + SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + path }]
});
</script>

<template>
  <main>
    <section v-if="exists && result" :id="pageType?.name">
      <InfiniteList :data="result" />
    </section>
  </main>
</template>
