<script setup lang="ts">
const props = defineProps<{
  characterId: number;
}>();

const id = props.characterId;
const nexted = ref(false);
const count = ref(1) as Ref<number>;
const lastRow = ref() as Ref<HTMLElement[]>;
const hasNextPage = ref(false);

const mediaYears = [] as string[];
const orderedMedias = ref({}) as Ref<Record<string, any>>;
const uniqueYears = ref([...new Set(mediaYears)]) as Ref<string[]>;

const orderItems = (edges: any) => {
  for (const y of uniqueYears.value) {
    const prop = y ? String(y) : "TBA";
    if (!orderedMedias.value[prop]?.length) orderedMedias.value[prop] = [];
    for (const c of edges) {
      if (String(c.node.startDate.year) === String(y)) {
        orderedMedias.value[prop].push(c);
      }
    }
  }
};

const mouseListeners = (set: string[]) => {
  for (const y of set) {
    let j = 0;
    for (const _c of orderedMedias.value[y ? String(y) : "TBA"]!) {
      const index = `${y}_${j}`;
      const coa = document.querySelector(`.coa-${index}`) as HTMLElement;
      const ci = document.querySelector(`.ci-${index}`) as HTMLElement;
      coa?.addEventListener("mouseover", () => ci.style.opacity = ".2");
      coa?.addEventListener("mouseout", () => ci.style.opacity = "1");
      j = j + 1;
    }
  }
};

const getNextMedia = async () => {
  nexted.value = true;
  const next = await getCharacterMedias({ id, page: count.value });
  const nextYears = next.media.edges.map((edge: Record<string, any>) => edge.node.startDate.year) as string[];
  mediaYears.push(...nextYears);
  uniqueYears.value = [...new Set(mediaYears)];
  orderItems(next.media.edges);
  count.value = count.value + 1;
  hasNextPage.value = next.media.pageInfo.hasNextPage;
  nexted.value = false;
  nextTick(() => mouseListeners([...new Set(nextYears)]));
};

const scrollHandler = async () => {
  if (onScreen(lastRow.value[0]!) && !nexted.value && count.value && hasNextPage.value) {
    await getNextMedia();
  }
};

onMounted(async () => {
  await getNextMedia();
  if (mediaYears.length) {
    addEventListener("scroll", scrollHandler);
    mouseListeners(uniqueYears.value);
  }
});

onBeforeUnmount(() => {
  if (mediaYears.length)
    removeEventListener("scroll", scrollHandler);
});
</script>

<template>
  <div>
    <hr v-if="mediaYears.length" class="my-4">
    <div id="characters">
      <SpinnerLoading v-if="nexted && !uniqueYears.length" />
      <TransitionGroup name="tab-left">
        <template v-for="(y, i) of uniqueYears" :key="i">
          <h1 class="mb-4">{{ y ? String(y) : "TBA" }}</h1>
          <div class="d-flex flex-wrap p-0 justify-content-start anime-row g-3">
            <template v-for="(c, j) of orderedMedias[y ? String(y) : 'TBA']" :key="j">
              <div v-if="c?.node?.id" class="position-relative col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2 justify-content-center">
                <div class="character-element image overflow-hidden mb-2 w-100 position-relative" data-aos="fade-in">
                  <img :class="`ci-${y}_${j}`" class="character-image img-fluid scale-on-hover h-100 w-100 position-absolute object-fit-cover" :src="c.node?.coverImage?.extraLarge" :alt="c.node?.title?.english || c.node?.title?.romaji" :title="c.node?.title?.english || c.node?.title?.romaji">
                  <img :class="`coa-${y}_${j}`" class="character-on-anime scale-full-on-hover img-fluid bottom-0 end-0 position-absolute border-start border-top border-2" :src="c.voiceActorRoles[0]?.voiceActor?.image?.large" width="90px" :alt="c.voiceActorRoles[0]?.voiceActor?.name?.userPreferred" :title="c.voiceActorRoles[0]?.voiceActor?.name?.userPreferred">
                </div>
                <NuxtLink :to="`/a/${c.node?.id}/${fixSlug(c.node?.title?.romaji)}`" class="text-white">
                  <h6 class="mb-1">
                    {{ c.node?.title?.english || c.node?.title?.romaji }}
                    <span class="badge bg-secondary align-middle py-1 px-2">{{ c.node?.format?.replace(/_/g, " ") }}</span>
                  </h6>
                </NuxtLink>
                <small class="text-muted d-block mb-1 fw-light">{{ c.node?.title?.romaji }}</small>
                <NuxtLink :to="`/p/${c.voiceActorRoles[0]?.voiceActor?.id}/${fixSlug(c.voiceActorRoles[0]?.voiceActor?.name?.userPreferred)}`">
                  <h6 v-if="c.voiceActorRoles[0]?.voiceActor?.name" class="mb-0 text-primary">
                    {{ c.voiceActorRoles[0]?.voiceActor?.name?.userPreferred }}
                  </h6>
                </NuxtLink>
              </div>
              <span v-if="j === orderedMedias[y ? String(y) : 'TBA']?.length! - 1 && y === uniqueYears[uniqueYears?.length - 1]"
                    ref="lastRow"
                    class="m-0 p-0"
              />
              <SpinnerLoading v-if="j === orderedMedias[y ? String(y) : 'TBA']?.length! - 1 && y === uniqueYears[uniqueYears?.length - 1] && nexted" class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2" />
            </template>
          </div>
          <hr v-if="y !== uniqueYears[uniqueYears?.length - 1]" class="my-4">
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>
