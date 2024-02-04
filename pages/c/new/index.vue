<script setup lang="ts">
const { data: result } = await useFetch("/api/explore/newly") as Record<string, any>;
</script>

<template>
  <section v-if="result" id="newly">
    <ComponentInfiniteList :data="result" />
  </section>
</template>