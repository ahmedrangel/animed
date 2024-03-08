<script setup lang="ts">
const result = categories.sort((a, b) => (a.name > b.name) ? 1 : -1);

useSeoMeta({
  title: "Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: "Categories | " + SITE.name,
  ogUrl: SITE.url + "/c",
  ogSiteName: SITE.name,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: "Categories | " + SITE.name,
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + "/c" }]
});
</script>

<template>
  <main>
    <section id="categories">
      <h3 class="px-4 py-4 mb-0 bg-dark">Categories</h3>
      <ul>
        <NuxtLink v-for="(c, i) of result" :key="i" v-ripple :to="`/c/${fixSlug(c.name)}`" role="button" class="p-ripple px-2 py-4 d-flex justify-content-center align-items-center" :title="c.name">
          <span class="category-name h3 text-center pe-none fw-normal">{{ c.name }}</span>
        </NuxtLink>
      </ul>
    </section>
  </main>
</template>