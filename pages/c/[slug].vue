<script setup lang="ts">
const { params } = useRoute();
const { slug } = params;
const { data: data } = await useFetch("/api/explore?slug=" + slug) as Record<string, any>;
const newly = data.value.preview[0].data[0];
</script>

<template>
  <section id="preview">
    <ComponentBanner :anime="newly" />
    <ComponentPreviewList :data="data" />
  </section>
</template>
