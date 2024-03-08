<script setup lang="ts">
definePageMeta({ layout: "no-footer" });

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

const { data: result } = await useFetch("/api/explore/popular?slug=" + slug) as Record<string, any>;

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/c/trending/${slug}` }]
});
</script>

<template>
  <main>
    <section v-if="result" id="trending">
      <ComponentInfiniteList :data="result" />
    </section>
  </main>
</template>