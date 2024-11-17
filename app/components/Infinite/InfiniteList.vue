<script setup lang="ts">
const props = defineProps({
  type: { type: String as PropType<ListType>, required: false, default: null },
  category: { type: String, required: false, default: null },
  query: { type: String, required: false, default: null }
});

const category = props.category;
const type = props.type;
const query = props.query;
const typeTitle = availablePageTypes.find(t => t.name === type)?.title || null;
const media = ref<AnimeList["media"]>([]);
const nexted = ref(false) as Ref<boolean>;
const count = ref(1) as Ref<number>;
const lastRow = ref() as Ref<HTMLElement[]>;
const hasNextPage = ref(false);
const cat_type = categories.find(c => c.name === category)?.type || null;
const loading = ref(query ? false : true);

const getNextMedia = async () => {
  nexted.value = true;
  const tag_or_genre = category ? cat_type === "genre" ? { genres: category ? [category] : null } : { tags: category ? [category] : null } : null;
  const next = await getList(type, { page: count.value, search: props?.query, ...tag_or_genre });
  media.value.push(...next.media);
  nexted.value = false;
  count.value = count.value + 1;
  hasNextPage.value = next.pageInfo.hasNextPage;
};

const scrollHandler = async () => {
  if (onScreen(lastRow.value[0]!) && !nexted.value && count.value && hasNextPage.value) {
    await getNextMedia();
  }
};

onMounted(async () => {
  await getNextMedia();
  loading.value = false;
  if (media.value.length)
    addEventListener("scroll", scrollHandler);
});

onBeforeUnmount(() => {
  if (media.value.length)
    removeEventListener("scroll", scrollHandler);
});
</script>

<template>
  <div>
    <TransitionGroup name="fade">
      <SpinnerFullScreenLoading v-if="loading && !media.length" />
      <div v-else class="px-2 py-5 px-xl-5 w-100">
        <div v-if="typeTitle" class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">{{ typeTitle }}&nbsp;<NuxtLink :to="`/c/${category}`">{{ category }}</NuxtLink></h3>
        </div>
        <div class="d-flex flex-wrap p-0 justify-content-start anime-row g-1">
          <template v-for="(anime, i) of media" :key="i">
            <div class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2 d-flex justify-content-center">
              <div class="mb-1 w-100" :class="i === 0 ? 'me-1' : 'mx-1'">
                <AnimeCard :data="anime" />
              </div>
            </div>
            <span v-if="i === media?.length - 11" ref="lastRow" class="m-0 p-0" />
            <SpinnerLoading v-if="i === media?.length - 1 && nexted" class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2" />
          </template>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
