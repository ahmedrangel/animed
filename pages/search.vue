<script setup lang="ts">
const query = ref() as Ref<string>;
const debounce = ref(null as any);
const result = ref() as Ref<Record<string, any> | null>;
const loading = ref(false) as Ref<boolean>;
const nexted = ref(false) as Ref<boolean>;
const count = ref(20) as Ref<number>;
const lastRow = ref("lastRow") as unknown as Ref<HTMLElement[]>;

watch(query, async() => {
  loading.value = true;
  if (debounce.value) {
    clearTimeout(debounce.value);
    debounce.value = null;
  }
  if (query.value.length > 0) {
    debounce.value = setTimeout(async () => {
      result.value = await getQuery(query.value, count.value);
      loading.value = false;
    }, 1000);
  }
  else {
    result.value = null;
    loading.value = false;
  }
});

onMounted(() => {
  addEventListener("scroll", async() => {
    if (onScreen(lastRow.value[0]) && !nexted.value && count.value <= result.value?.count) {
      nexted.value = true;
      const next = await getQuery(query.value, count.value + 20);
      result.value?.data.push(...next.data);
      count.value = count.value + 20;
      nexted.value = false;
    }
  });
});
</script>

<template>
  <section id="search">
    <div class="d-flex justify-content-start align-items-center bg-secondary">
      <h4><Icon name="ph:magnifying-glass" class="mx-4" /></h4>
      <input v-model="query" type="text" class="w-100 py-3 border-0 bg-transparent" placeholder="Type to search..." @input="count = 20">
    </div>
    <div v-if="!result && !loading">
      <h2 class="text-muted mb-0 w-100 text-center mt-5">Type something to search...</h2>
    </div>
    <ComponentLoadingSpinner v-if="loading" class="mt-5" />
    <ComponentInfiniteList v-if="result && !loading" :data="result" />
  </section>
</template>