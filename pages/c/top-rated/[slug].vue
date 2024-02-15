<script setup lang="ts">
definePageMeta({ layout: "no-footer" });

const { params } = useRoute();
const { slug } = params;

const exists = categories.find((c) => fixSlug(c.name) === slug) || null;

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
  <main>
    <section v-if="result" id="top-rated">
      <ComponentInfiniteList :data="result" />
    </section>
  </main>
</template>