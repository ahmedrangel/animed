<script setup lang="ts">
const { params } = useRoute("c-slug-type");
const { type, slug } = params;
const pageType = availablePageTypes.find(t => t.name === type);
const isAllCategories = slug === "all";
const existsCategory = categories.find(c => fixSlug(c.name) === slug);
const exists = ((existsCategory || isAllCategories) && pageType) || null;

if (!exists) {
  throw createError({
    statusCode: 404,
    message: `Category not found: '${!pageType ? type : slug}'`,
    fatal: true
  });
}

const category = existsCategory?.name;
const path = `/c/${slug}/${pageType?.name}`;

useSeoMeta({
  title: `${pageType?.title} ${category || ""}` + " | Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: `${pageType?.title} ${category || ""}` + " | Categories | " + SITE.name,
  ogUrl: SITE.url + path,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: `${pageType?.title} ${category || ""}` + " | Categories | " + SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + path }]
});
</script>

<template>
  <main>
    <section v-if="exists && pageType?.name" :id="pageType.name">
      <InfiniteList :type="pageType.name" :category="category" />
    </section>
  </main>
</template>
