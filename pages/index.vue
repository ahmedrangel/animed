<script setup lang="ts">
const { data: data } = await useFetch("/api/explore/") as Record<string, any>;
const popular = useState("random-anime", () => null);

const trendings = data.value.preview[data.value.preview.length - 1];

if (!popular.value) {
  popular.value = trendings.data[Math.floor(Math.random() * trendings.data.length - 1)];
}

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
      <ComponentBanner v-if="popular" :anime="popular" />
      <ComponentPreviewList :data="data" />
    </section>
  </main>
</template>
