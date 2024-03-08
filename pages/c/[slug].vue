<script setup lang="ts">
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
const { data: data } = await useFetch("/api/explore?slug=" + slug) as Record<string, any>;
const newly = data.value.preview[0].data[0];

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/c/${slug}` }]
});
</script>

<template>
  <main>
    <section id="preview">
      <ComponentBanner :anime="newly" />
      <ComponentPreviewList :data="data" />
    </section>
  </main>
</template>
