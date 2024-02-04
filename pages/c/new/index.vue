<script setup lang="ts">
const { data: result } = await useFetch("/api/explore/newly") as Record<string, any>;
</script>

<template>
  <section v-if="result" id="newly">
    <ComponentBanner :anime="result.data[0]" />
    <ComponentInfiniteList :data="result" title="Newly Released" />
  </section>
</template>
