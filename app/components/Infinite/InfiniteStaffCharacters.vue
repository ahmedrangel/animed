<script setup lang="ts">
const props = defineProps<{
  staffId: number;
}>();

const id = props.staffId;
const nexted = ref(false);
const count = ref(1) as Ref<number>;
const lastRow = ref() as Ref<HTMLElement[]>;
const hasNextPage = ref(false);

const charactersYears = [] as string[];
const orderedCharacters = ref({}) as Ref<Record<string, StaffCharacters["edges"]>>;
const uniqueYears = ref([...new Set(charactersYears)]) as Ref<string[]>;

const orderItems = (edges: StaffCharacters["edges"]) => {
  for (const y of uniqueYears.value) {
    const prop = y ? String(y) : "TBA";
    if (!orderedCharacters.value[prop]?.length) orderedCharacters.value[prop] = [];
    for (const c of edges) {
      if (String(c.node.startDate.year) === String(y)) {
        orderedCharacters.value[prop].push(c);
      }
    }
  }
};

const mouseListeners = (set: string[]) => {
  for (const y of set) {
    let j = 0;
    for (const _c of orderedCharacters.value[y ? String(y) : "TBA"]!) {
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
  const next = await getStaffCharacters({ id, page: count.value });
  const nextYears = next.edges.map((edge: Record<string, any>) => edge.node.startDate.year) as string[];
  charactersYears.push(...nextYears);
  uniqueYears.value = [...new Set(charactersYears)];
  orderItems(next.edges);
  count.value = count.value + 1;
  hasNextPage.value = next.pageInfo.hasNextPage;
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
  if (charactersYears.length) {
    addEventListener("scroll", scrollHandler);
    mouseListeners(uniqueYears.value);
  }
});

onBeforeUnmount(() => {
  if (charactersYears.length)
    removeEventListener("scroll", scrollHandler);
});
</script>

<template>
  <div>
    <hr v-if="charactersYears.length" class="my-4">
    <div id="characters">
      <SpinnerLoading v-if="nexted && !uniqueYears.length" />
      <TransitionGroup name="tab-left">
        <template v-for="(y, i) of uniqueYears" :key="i">
          <h1 class="mb-4">{{ y ? String(y) : "TBA" }}</h1>
          <div class="d-flex flex-wrap p-0 justify-content-start anime-row g-3">
            <template v-for="(c, j) of orderedCharacters[y ? String(y) : 'TBA']" :key="j">
              <div v-if="c.characters[0]?.name" class="position-relative col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2 justify-content-center">
                <div class="character-element image overflow-hidden mb-2 w-100 position-relative" data-aos="fade-in">
                  <img :class="`ci-${y}_${j}`" class="character-image img-fluid scale-on-hover h-100 w-100 position-absolute object-fit-cover" :src="c.characters[0]?.image?.large" :alt="c.characters[0]?.name?.userPreferred" :title="c.characters[0].name?.userPreferred">
                  <img :class="`coa-${y}_${j}`" class="character-on-anime scale-full-on-hover img-fluid bottom-0 end-0 position-absolute border-start border-top border-2" :src="c.node?.coverImage?.large" width="90px" :alt="c.node?.title?.romaji" :title="c.node?.title?.romaji">
                </div>
                <h5 class="mb-2 text-primary d-flex align-items-center gap-1">
                  <NuxtLink :to="`/ch/${c.characters[0]?.id}/${fixSlug(c.characters[0]?.name?.userPreferred)}`">
                    {{ c.characters[0]?.name?.userPreferred }}
                  </NuxtLink>
                  <span class="badge bg-light align-middle text-capitalize py-1 px-2 text-dark" style="font-size: .65em;">{{ c.characterRole.toLowerCase() }}</span>
                </h5>
                <template v-if="c?.node">
                  <NuxtLink :to="`/a/${c.node?.id}/${fixSlug(c.node?.title.romaji)}`" class="text-white">
                    <h6 class="mb-0 fw-normal">
                      {{ c.node?.title?.english ? c.node?.title?.english : c.node?.title?.romaji }}
                      <span class="badge bg-secondary align-middle py-1 px-2">{{ c.node?.format?.replace(/_/g, " ") }}</span>
                    </h6>
                  </NuxtLink>
                  <small class="text-muted d-block mb-1 fw-light">{{ c.node?.title?.romaji }}</small>
                </template>
              </div>
              <span v-if="j === orderedCharacters[y ? String(y) : 'TBA']?.length! - 1 && y === uniqueYears[uniqueYears?.length - 1]"
                    ref="lastRow"
                    class="m-0 p-0"
              />
              <SpinnerLoading v-if="j === orderedCharacters[y ? String(y) : 'TBA']?.length! - 1 && y === uniqueYears[uniqueYears?.length - 1] && nexted" class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2" />
            </template>
          </div>
          <hr v-if="y !== uniqueYears[uniqueYears?.length - 1]" class="my-4">
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>
