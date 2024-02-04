<script setup lang="ts">
const { data: result } = await useFetch("/api/explore/popular") as Record<string, any>;
</script>

<template>
  <section v-if="result" id="trending">
    <ComponentInfiniteList :data="result" />
  </section>
</template>
