<script setup lang="ts">
definePageMeta({ layout: "no-footer" });

const { data: result } = await useFetch("/api/explore/rated") as Record<string, any>;

useSeoMeta({
  title: `${result.value.title}` + " | Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: `${result.value.title}` + " | Categories | " + SITE.name,
  ogSiteName: SITE.name,
  ogUrl: SITE.url + "/c/top-rated",
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary",
  twitterTitle: `${result.value.title}` + " | Categories | " + SITE.name,
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + "/c/top-rated" }]
});
</script>

<template>
  <main>
    <section v-if="result" id="top">
      <ComponentInfiniteList :data="result" />
    </section>
  </main>
</template>
