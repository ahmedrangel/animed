<script setup lang="ts">
const data = categories.data;
const result = computed(() => data.sort((a, b) => (a.attributes.title > b.attributes.title) ? 1 : -1));
console.log(result)
</script>

<template>
  <section id="categories">
    <h3 class="px-4 py-4 mb-0 bg-dark">Categories</h3>
    <ul>
      <NuxtLink v-for="(c, i) of result" :key="i" v-ripple :to="`/c/${c.attributes.slug}`" role="button" class="p-ripple px-2 py-4 d-flex justify-content-center align-items-center">
        <span class="category-name h3 text-center">{{ c.attributes.title }}</span>
      </NuxtLink>
    </ul>
  </section>
</template>