<script setup lang="ts">
const query = ref<string>("");
const search = ref(false);
const loading = ref(false);
const input = useTemplateRef("input");

watch(query, () => {
  if (query.value.length > 0) loading.value = true;
  else {
    loading.value = false;
    search.value = false;
  }
});

watchDebounced(query, () => {
  if (query.value.length > 0) search.value = true;
  loading.value = false;
}, { debounce: 1000 });

onMounted(() => {
  input.value?.focus();
});

useSeoMeta({
  title: "Search | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: "Search | " + SITE.name,
  ogUrl: SITE.url + "/search",
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: "Search | " + SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + "/search" }]
});
</script>

<template>
  <main>
    <section id="search">
      <div class="d-flex justify-content-start align-items-center bg-secondary">
        <h4><Icon name="ph:magnifying-glass" class="mx-4" /></h4>
        <input ref="input" v-model="query" type="text" class="w-100 py-3 border-0 bg-transparent" placeholder="Type to search...">
      </div>
      <TransitionGroup name="fade">
        <div v-if="!search && !loading">
          <h2 class="text-muted mb-0 w-100 text-center mt-5">Type something to search...</h2>
        </div>
        <SpinnerLoading v-if="loading" class="mt-5" />
        <InfiniteList v-if="search && !loading" :query="query" />
      </TransitionGroup>
    </section>
  </main>
</template>
