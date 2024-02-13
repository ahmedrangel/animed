<script setup lang="ts">
const result = computed(() => categories.sort((a, b) => (a.name > b.name) ? 1 : -1));
</script>

<template>
  <section id="categories">
    <h3 class="px-4 py-4 mb-0 bg-dark">Categories</h3>
    <ul>
      <a v-for="(c, i) of result" :key="i" v-ripple :href="`/c/${fixSlug(c.name)}`" role="button" class="p-ripple px-2 py-4 d-flex justify-content-center align-items-center" :title="c.name" @click="waitForAnimation">
        <span class="category-name h3 text-center pe-none fw-normal">{{ c.name }}</span>
      </a>
    </ul>
  </section>
</template>