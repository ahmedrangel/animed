<script setup lang="ts">
const { data: result } = await useFetch("/api/category/") as Record<string, any>;

const goTo = async(page: string) => {
  await navigateTo(page);
};
</script>

<template>
  <section id="categories">
    <h3 class="px-4 py-4 mb-0">Categories</h3>
    <ul>
      <div v-for="(c, i) of result.data" :key="i" v-ripple role="button" class="p-ripple px-2 py-4 d-flex justify-content-center align-items-center" @click="goTo(`/c/${c.attributes.slug}`)">
        <span class="category-name h3 text-center">{{ c.attributes.title }}</span>
      </div>
    </ul>
  </section>
</template>