<script setup lang="ts">
const { params } = useRoute("a-id");
const { id } = params;
const { data: data } = await useFetch("/api/anime/" + id + "/slug") as Record<string, any>;
const slug = fixSlug(data.value?.slug);
if (!slug) {
  throw createError({
    statusCode: 404,
    message: `Anime not found: '${id}'`,
    fatal: true
  });
}
navigateTo(`/a/${id}/${slug}`, { redirectCode: 301, replace: false });
</script>

<template>
  <main />
</template>
