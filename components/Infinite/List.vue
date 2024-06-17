<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true },
  query: { type: String, required: false, default: null }
});
const result = props.data as Record<string, any>;
const nexted = ref(false) as Ref<boolean>;
const count = ref(2) as Ref<number>;
const lastRow = ref("lastRow") as unknown as Ref<HTMLElement[]>;
const hasNextPage = ref(result.pageInfo.hasNextPage);

const scrollHandler = async () => {
  if (String(lastRow.value) !== "lastRow" && onScreen(lastRow.value[0]) && !nexted.value && count.value && hasNextPage.value) {
    nexted.value = true;
    const next = await getList(result.type, { page: count.value, search: props?.query, genres: result?.category }) as Record<string, any>;
    result.media.push(...next.data.media);
    nexted.value = false;
    count.value = count.value + 1;
    hasNextPage.value = next.data.pageInfo.hasNextPage;
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
    <div v-if="result?.title" class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">{{ result.title }}&nbsp;<NuxtLink :to="`/c/${fixSlug(result.category)}`">{{ result.category }}</NuxtLink></h3>
    </div>
    <div class="d-flex flex-wrap p-0 justify-content-start anime-row g-1">
      <template v-for="(anime, i) of result?.media" :key="i">
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2 d-flex justify-content-center">
          <div class="mb-1 w-100" :class="i === 0 ? 'me-1' : 'mx-1'">
            <AnimeCard :data="anime" />
          </div>
        </div>
        <span v-if="i === result?.media?.length - 11" ref="lastRow" class="m-0 p-0" />
        <SpinnerLoading v-if="i === result?.media?.length - 1 && nexted" class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2" />
      </template>
    </div>
  </div>
</template>
