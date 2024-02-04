<script setup lang="ts">
const { params } = useRoute();
const { slug } = params;
const { data: result } = await useFetch("/api/explore/popular?slug=" + slug) as Record<string, any>;
</script>

<template>
  <section v-if="result" id="trending">
    <ComponentInfiniteList :data="result" />
  </section>
</template>