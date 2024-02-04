<script setup lang="ts">
const { data: result } = await useFetch("/api/explore/popular") as Record<string, any>;
</script>

<template>
  <section v-if="result" id="trending">
    <ComponentBanner :anime="result.data[0]" />
    <ComponentInfiniteList :data="result" title="Trending" />
  </section>
</template>
