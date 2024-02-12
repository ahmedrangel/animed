<script setup lang="ts">
const { data: data } = await useFetch("/api/explore/") as Record<string, any>;
const popular = useState("random-anime", () => null);

const trendings = data.value.preview[data.value.preview.length - 1];

if (!popular.value) {
  popular.value = trendings.data[Math.floor(Math.random() * trendings.data.length - 1)];
}
</script>

<template>
  <section id="preview">
    <ComponentBanner v-if="popular" :anime="popular" />
    <ComponentPreviewList :data="data" />
  </section>
</template>
