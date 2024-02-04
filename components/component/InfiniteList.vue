<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true },
  query: { type: String, required: false, default: null }
});
const result = props.data as Record<string, any>;
const nexted = ref(false) as Ref<boolean>;
const count = ref(20) as Ref<number>;
const lastRow = ref("lastRow") as unknown as Ref<HTMLElement[]>;

const scrollHandler = async () => {
  if (onScreen(lastRow.value[0]) && !nexted.value && count.value <= result.count) {
    nexted.value = true;
    const next = await getList(result.type, {offset: count.value + 20, query: props.query, categories: result?.category }) as Record<string, any>;
    result?.data.push(...next.data);
    count.value = count.value + 20;
    nexted.value = false;
  }
};

onMounted(() => {
  addEventListener("scroll", scrollHandler);
});

onBeforeUnmount(() => {
  removeEventListener("scroll", scrollHandler);
});
</script>

<template>
  <div v-if="result" class="px-2 py-5 px-xl-5 w-100">
    <div v-if="result.title" class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">{{ result.title }}&nbsp;<NuxtLink :to="`/c/${result.slug}`">{{ result.category }}</NuxtLink></h3>
    </div>
    <div class="d-flex flex-wrap p-0 justify-content-start anime-row g-1">
      <template v-for="(d, i) of result?.data" :key="i">
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2 d-flex justify-content-center">
          <div class="mb-1" :class="i === 0 ? 'me-1' : 'mx-1'" style="max-width: 280px;">
            <NuxtLink :to="`/a/${d.attributes.slug}`">
              <img class="img-fluid mb-2" :src="d.attributes.posterImage.medium ? d.attributes.posterImage.medium : d.attributes.posterImage.original" width="280">
              <h6 class="mb-1 text-white">{{ d.attributes.titles.en ? d.attributes.titles.en : d.attributes.titles.en_jp }} <span class="badge bg-secondary align-middle">{{ d.attributes.subtype }}</span></h6>
            </NuxtLink>
            <small class="text-muted d-block mb-1">{{ d.attributes.canonicalTitle }}</small>
            <small class="d-block mb-1 text-primary">{{ formatDate(d.attributes.startDate) }}</small>
            <div class="d-flex align-items-center position-relative">
              <div class="stars d-flex align-items-center" style="height: 16px;">
                <img class="position-absolute" src="/images/stars.webp" width="80">
                <img class="" src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + (100-d.attributes.averageRating) + '% 0px 0px) '}">
              </div>
              <small class="ms-2 mb-0 text-white">{{ getRating(d.attributes.averageRating) }}</small>
            </div>
          </div>
        </div>
        <span v-if="i === result.data.length - 10" ref="lastRow" class="m-0 p-0" />
        <ComponentLoadingSpinner v-if="i === result.data.length - 1 && nexted" class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2" />
      </template>
    </div>
  </div>
</template>
