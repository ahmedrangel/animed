<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true }
});

const staff = props.data as Record<string, any>;
const nexted = ref(false) as Ref<boolean>;
const count = ref(2) as Ref<number>;
const lastRow = ref("lastRow") as unknown as Ref<HTMLElement[]>;
const hasNextPage = ref(staff.characterMedia.pageInfo.hasNextPage);

const charactersYears = staff.characterMedia.edges.map((edge: Record<string, any>) => edge.node.startDate.year) as string[];
const orderedCharacters = ref({}) as Record<string, any>;
const uniqueYears = ref([...new Set(charactersYears)]) as Ref<string[]>;

const orderItems = (edges: Record<string, any>[]) => {
  for (const y of uniqueYears.value) {
    const prop = y ? String(y) : "TBA";
    if (!orderedCharacters.value[prop]?.length) orderedCharacters.value[prop] = [];
    for (const c of edges) {
      if (c.node.startDate.year === y) {
        orderedCharacters.value[prop].push(c);
      }
    }
  }
};

orderItems(staff.characterMedia.edges);

const mouseListeners = (set: string[]) => {
  for (const y of set) {
    let j = 0;
    for (const _c of orderedCharacters.value[y ? String(y) : "TBA"]) {
      const index = `${y}_${j}`;
      const coa = document.querySelector(`.coa-${index}`) as HTMLElement;
      const ci = document.querySelector(`.ci-${index}`) as HTMLElement;
      coa?.addEventListener("mouseover", () => ci.style.opacity = ".2");
      coa?.addEventListener("mouseout", () => ci.style.opacity = "1");
      j = j + 1;
    }
  }
};

const scrollHandler = async () => {
  if (onScreen(lastRow.value[0]) && !nexted.value && count.value && hasNextPage.value) {
    nexted.value = true;
    const next = await getStaff({ id: staff.id, page: count.value }) as Record<string, any>;
    const nextYears = next.data.Staff.characterMedia.edges.map((edge: Record<string, any>) => edge.node.startDate.year) as string[];
    charactersYears.push(...nextYears);
    uniqueYears.value = [...new Set(charactersYears)];
    orderItems(next.data.Staff.characterMedia.edges);
    count.value = count.value + 1;
    hasNextPage.value = next.data.Staff.characterMedia.pageInfo.hasNextPage;
    nexted.value = false;
    nextTick(() => mouseListeners([...new Set(nextYears)]));
  }
};

onMounted(() => {
  addEventListener("scroll", scrollHandler);
  mouseListeners(uniqueYears.value);
});

onBeforeUnmount(() => {
  removeEventListener("scroll", scrollHandler);
});
</script>

<template>
  <div id="characters">
    <template v-for="(y, i) of uniqueYears" :key="i">
      <h1 class="mb-4">{{ y ? String(y) : "TBA" }}</h1>
      <div class="d-flex flex-wrap p-0 justify-content-start anime-row g-3">
        <template v-for="(c, j) of orderedCharacters[y ? String(y) : 'TBA']" :key="j">
          <div class="position-relative col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2 justify-content-center">
            <div class="character-element image overflow-hidden mb-2 w-100 position-relative">
              <img :class="`ci-${y}_${j}`" class="character-image img-fluid scale-on-hover h-100 w-100 position-absolute object-fit-cover" :src="c.characters[0].image.large" :alt="c.characters[0].name?.userPreferred" :title="c.characters[0].name?.userPreferred">
              <img :class="`coa-${y}_${j}`" class="character-on-anime scale-full-on-hover img-fluid bottom-0 end-0 position-absolute border-start border-top border-2" :src="c.node.coverImage.large" width="90px" :alt="c.node?.title?.romaji" :title="c.node?.title?.romaji">
            </div>
            <h5 class="mb-1 text-primary">{{ c.characters[0].name?.userPreferred }}</h5>
            <template v-if="c?.node">
              <NuxtLink :to="`/a/${c.node?.id}/${fixSlug(c.node?.title.romaji)}`" class="text-white">
                <h6 class="mb-0 fw-normal">{{ c.node?.title?.english ? c.node?.title?.english : c.node?.title?.romaji }} <span class="badge bg-secondary align-middle">{{ c.node?.format?.replace(/_/g, " ") }}</span></h6>
              </NuxtLink>
              <small class="text-muted d-block mb-1 fw-light">{{ c.node?.title?.romaji }}</small>
            </template>
          </div>
          <span v-if="j === orderedCharacters[y ? String(y) : 'TBA']?.length - 1 && y === uniqueYears[uniqueYears?.length - 1]"
                ref="lastRow"
                class="m-0 p-0"
          />
          <SpinnerLoading v-if="j === orderedCharacters[y ? String(y) : 'TBA']?.length - 1 && y === uniqueYears[uniqueYears?.length - 1] && nexted" class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-6 mb-2" />
        </template>
      </div>
      <hr v-if="y !== uniqueYears[uniqueYears?.length - 1]" class="my-4">
    </template>
  </div>
</template>
