<script setup lang="ts">
const { params } = useRoute("a-id");
const { id } = params;
const { data: data }: { data: Ref<{ id: number, slug: string }> } = await useFetch("/api/anime/" + id + "/slug");
const slug = fixSlug(data.value?.slug);
if (!slug) {
  throw createError({
    statusCode: 404,
    message: `Anime not found: '${id}'`,
    fatal: true
  });
}
navigateTo(`/a/${id}/${slug}`, { redirectCode: 301 });
</script>

<template>
  <main />
</template>
