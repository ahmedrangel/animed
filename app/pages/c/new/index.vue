<script setup lang="ts">
const { data: result }: { data: Ref<AnimeList> } = await useFetch("/api/explore/newly");

useSeoMeta({
  title: `${result.value.title}` + " | Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: `${result.value.title}` + " | Categories | " + SITE.name,
  ogSiteName: SITE.name,
  ogUrl: SITE.url + "/c/new",
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: `${result.value.title}` + " | Categories | " + SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + "/c/new" }]
});
</script>

<template>
  <main>
    <section v-if="result" id="newly">
      <InfiniteList :data="result" />
    </section>
  </main>
</template>
