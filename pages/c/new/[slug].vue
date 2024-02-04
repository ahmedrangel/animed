<script setup lang="ts">
const { params } = useRoute();
const { slug } = params;
const { data: result } = await useFetch("/api/explore/newly?slug=" + slug) as Record<string, any>;
</script>

<template>
  <section v-if="result" id="newly">
    <ComponentInfiniteList :data="result" />
  </section>
</template>