<script setup lang="ts">
const { params } = useRoute();
const { id, slug } = params;
const { data: data } = await useFetch("/api/anime/" + id) as Record<string, any>;
const anime = data.value;

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
