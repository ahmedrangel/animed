<script setup lang="ts">
definePageMeta({ layout: "no-footer" });

const { data: result } = await useFetch("/api/explore/rated") as Record<string, any>;
</script>

<template>
  <section v-if="result" id="top">
    <ComponentInfiniteList :data="result" />
  </section>
</template>
