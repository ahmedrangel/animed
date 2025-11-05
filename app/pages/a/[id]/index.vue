<script setup lang="ts">
const { params } = useRoute("a-id");
const { id } = params;

onMounted(async () => {
  const anime = await getAnimeInfo({ id: Number(id) }).catch(() => null);
  if (!anime) {
    throw createError({
      statusCode: 404,
      message: `Anime not found: '${id}'`,
      fatal: true
    });
  }
  useState(`${id}-info`, () => {
    return {
      title: anime?.title,
      bannerImage: anime?.bannerImage,
      averageScore: anime?.averageScore,
      format: anime?.format,
      nextAiringEpisode: anime?.nextAiringEpisode,
      streamingEpisodes: anime?.streamingEpisodes
    };
  });
  navigateTo(`/a/${id}/${anime.slug}`, { redirectCode: 301 });
});
</script>

<template>
  <main />
</template>
