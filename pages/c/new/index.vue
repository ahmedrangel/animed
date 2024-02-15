<script setup lang="ts">
definePageMeta({ layout: "no-footer" });

const { data: result } = await useFetch("/api/explore/newly") as Record<string, any>;
</script>

<template>
  <main>
    <section v-if="result" id="newly">
      <ComponentInfiniteList :data="result" />
    </section>
  </main>
</template>