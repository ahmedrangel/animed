<script setup lang="ts">
const query = ref() as Ref<string>;
const result = ref() as Ref<AnimeList | null>;
const loading = ref(false) as Ref<boolean>;
const input = ref() as Ref<HTMLElement>;

watch(query, () => loading.value = true);

watchDebounced(query, async () => {
  if (query.value.length > 0) result.value = await getSearch({ search: query.value });
  else result.value = null;
  loading.value = false;
}, { debounce: 1000 });

onMounted(() => {
  input.value.focus();
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
      <div v-if="!result && !loading">
        <h2 class="text-muted mb-0 w-100 text-center mt-5">Type something to search...</h2>
      </div>
      <SpinnerLoading v-if="loading" class="mt-5" />
      <InfiniteList v-if="result && !loading" :data="result" :query="query" />
    </section>
  </main>
</template>
