<script setup lang="ts">
const query = ref() as Ref<string>;
const debounce = ref(null as any);
const data = ref();
const loading = ref();

watch(query, async() => {
  loading.value = true;
  if (debounce.value) {
    clearTimeout(debounce.value);
    debounce.value = null;
  }

  if (query.value.length > 0) {
    debounce.value = setTimeout(async () => {
      data.value = await getQuery(query.value);
      loading.value = false;
    }, 1000);
  }
  else {
    data.value = null;
    loading.value = false;
  }
});
</script>

<template>
  <section id="search">
    <div class="d-flex justify-content-start align-items-center bg-secondary">
      <h4><Icon name="ph:magnifying-glass" class="mx-4" /></h4>
      <input v-model="query" type="text" class="w-100 py-3 border-0 bg-transparent" placeholder="Type to search...">
    </div>
    <div v-if="!data && !loading">
      <h2 class="text-muted mb-0 w-100 text-center mt-5">Type something to search...</h2>
    </div>
    <ComponentLoadingSpinner v-if="loading" class="mt-5" />
    <div class="px-2 py-4 px-xl-5 w-100">
      <div v-if="data && !loading" class="d-flex flex-wrap p-0 justify-content-center anime-row g-1">
        <div v-for="(d, i) of data" :key="i" class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2 d-flex justify-content-center">
          <div class="mb-1" :class="i === 0 ? 'me-1' : 'mx-1'" style="max-width: 280px;">
            <NuxtLink :to="`/${d.attributes.slug}`">
              <img class="img-fluid mb-2" :src="d.attributes.posterImage.large" width="280">
              <h6 class="mb-1 text-white">{{ d.attributes.titles.en ? d.attributes.titles.en : d.attributes.titles.en_jp }}</h6>
            </NuxtLink>
            <small class="text-muted d-block mb-1">{{ d.attributes.canonicalTitle }}</small>
            <div class="d-flex align-items-center position-relative">
              <div class="stars d-flex align-items-center" style="height: 16px;">
                <img class="position-absolute" src="/images/stars.webp" width="80">
                <img class="" src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + (100-d.attributes.averageRating) + '% 0px 0px) '}">
              </div>
              <small class="ms-2 mb-0 text-white">{{ getRating(d.attributes.averageRating) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>