<script setup lang="ts">
const { params } = useRoute();
const { slug } = params;
const { data: data } = await useFetch("/api/anime/" + slug) as Record<string, any>;
const anime = data.value.data[0];

if (!anime) {
  throw createError({
    statusCode: 404,
    message: `Anime not found: '${slug}'`,
    fatal: true
  });
}
</script>

<template>
  <div class="col px-0 pb-5">
    <ComponentBanner v-if="anime" :anime="anime" />
  </div>
</template>
