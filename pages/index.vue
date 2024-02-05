<script setup lang="ts">
const { data: data } = await useFetch("/api/explore/") as Record<string, any>;
const popular = data.value.preview[data.value.preview.length - 1].data[0];
</script>

<template>
  <section id="preview">
    <ComponentBanner :anime="popular" />
    <ComponentPreviewList :data="data" />
  </section>
</template>
