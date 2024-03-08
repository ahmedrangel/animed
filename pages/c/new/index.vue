<script setup lang="ts">
definePageMeta({ layout: "no-footer" });

const { data: result } = await useFetch("/api/explore/newly") as Record<string, any>;

useHead({
  link: [{ rel: "canonical", href: SITE.url + "/c/new" }]
});
</script>

<template>
  <main>
    <section v-if="result" id="newly">
      <ComponentInfiniteList :data="result" />
    </section>
  </main>
</template>