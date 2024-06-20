<script setup lang="ts">
definePageMeta({ layout: "no-footer" });

const { params } = useRoute();
const { slug } = params;

const exists = categories.find(c => fixSlug(c.name) === slug) || null;

if (!exists) {
  throw createError({
    statusCode: 404,
    message: `Category not found: '${slug}'`,
    fatal: true
  });
}

const { data: result } = await useFetch("/api/explore/upcoming?slug=" + slug) as Record<string, any>;

useSeoMeta({
  title: `${result.value.title} ${result.value.category}` + " | Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: `${result.value.title} ${result.value.category}` + " | Categories | " + SITE.name,
  ogSiteName: SITE.name,
  ogUrl: SITE.url + `/c/upcoming/${slug}`,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: `${result.value.title} ${result.value.category}` + " | Categories | " + SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/c/upcoming/${slug}` }]
});
</script>

<template>
  <main>
    <section v-if="result" id="upcoming">
      <InfiniteList :data="result" />
    </section>
  </main>
</template>
