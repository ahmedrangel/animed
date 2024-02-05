<script setup lang="ts">
const { params } = useRoute();
const { slug } = params;

const exists = categories.data.find((c) => c.attributes.slug === slug) || null;

if (!exists) {
  throw createError({
    statusCode: 404,
    message: `Category not found: '${slug}'`,
    fatal: true
  });
}

const { data: result } = await useFetch("/api/explore/rated?slug=" + slug) as Record<string, any>;
</script>

<template>
  <section v-if="result" id="newly">
    <ComponentInfiniteList :data="result" />
  </section>
</template>