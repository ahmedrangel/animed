<script setup lang="ts">
const { data: result } = await useFetch("/api/explore/rated") as Record<string, any>;
</script>

<template>
  <section v-if="result" id="top">
    <ComponentBanner :anime="result.data[0]" />
    <ComponentInfiniteList :data="result" title="Top Rated" />
  </section>
</template>
