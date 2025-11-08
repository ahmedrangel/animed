<script setup lang="ts">
const props = defineProps<{
  data: Anime;
}>();

const result = props.data;
const nexted = ref(false) as Ref<boolean>;
const count = ref(2) as Ref<number>;
const lastRow = ref() as Ref<HTMLElement[]>;
const hasNextPage = ref(result.characters.pageInfo.hasNextPage);

const languages = [] as string[];
for (const l of result.characters.edges) {
  for (const va of l.voiceActors) {
    if (va.languageV2 && !languages.includes(va.languageV2))
      languages.push(va.languageV2);
  }
}

const currentLanguage = ref(languages[0] === "Japanese" ? languages[0] : "Japanese");

const scrollHandler = async () => {
  if (onScreen(lastRow.value[0]!) && !nexted.value && count.value && hasNextPage.value) {
    nexted.value = true;
    const next = await getAnimeCharacters({ id: result.id, page: count.value });
    if (!next) return;
    result.characters.edges.push(...next.characters.edges);
    nexted.value = false;
    count.value = count.value + 1;
    hasNextPage.value = next.characters.pageInfo.hasNextPage;
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
  <h2 class="text-white mb-2">Characters</h2>
  <select v-if="languages.length" v-model="currentLanguage" class="form-select mb-2 p-3" aria-label="Default select example">
    <option v-for="(lang, i) of languages" :key="i">
      {{ lang }}
    </option>
  </select>
  <div v-if="result" class="d-flex justify-content-start align-items-start anime-row flex-wrap gx-0 gx-lg-4 gy-4 px-1 pt-3">
    <template v-for="(c, i) of result.characters.edges" :key="i">
      <template v-for="(va, j) of c.voiceActors" :key="j">
        <template v-if="va.languageV2 === currentLanguage">
          <div class="col-12 col-lg-6 col-xl-6 col-xxl-4" data-aos="fade-in">
            <div class="d-flex align-items-start anime-row row-cols-auto g-2 bg-secondary rounded text-nowrap overflow-auto">
              <div class="col ps-0 mt-0" style="max-width: 100px;">
                <img v-if="c?.node?.image?.large || c?.node?.image?.medium" :src="c.node.image?.large || c.node.image?.medium" class="img-fluid rounded-start rounded-end-0" style="max-height: 90px;" :alt="c.node?.name.userPreferred" :title="c.node?.name.userPreferred">
              </div>
              <div class="col text-start me-auto mt-0 py-1">
                <small v-if="c?.node?.name?.userPreferred" class="d-block">
                  <NuxtLink :to="`/ch/${c.node?.id}/${fixSlug(c.node?.name.userPreferred)}`">{{ c.node?.name.userPreferred }}</NuxtLink>
                </small>
                <small class="text-capitalize">{{ c.role.toLowerCase() }}</small>
              </div>
              <div class="col text-end mt-0 py-1">
                <small v-if="va?.name?.userPreferred" class="d-block">
                  <NuxtLink :to="`/p/${va.id}/${fixSlug(va.name.userPreferred)}`">{{ va.name.userPreferred }}</NuxtLink>
                </small>
                <small class="text-capitalize text-muted">{{ va.languageV2 }}</small>
              </div>
              <div class="col pe-0 mt-0">
                <img v-if="va?.image?.large || va?.image?.medium" :src="va.image?.large || va.image.medium" class="img-fluid rounded-start-0 rounded-end" style="max-height: 90px;" :alt="va.name.userPreferred" :title="va.name.userPreferred">
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-if="noVaInLanguage(c.voiceActors, currentLanguage)">
        <div class="col-12 col-lg-6 col-xl-6 col-xxl-4" data-aos="fade-in">
          <div class="d-flex align-items-start anime-row flex-wrap row-cols-auto g-2 bg-secondary rounded text-nowrap overflow-auto">
            <div class="col ps-0 mt-0" style="max-width: 100px;">
              <img v-if="c?.node?.image?.large || c?.node?.image?.medium" :src="c.node.image?.large || c.node.image?.medium" class="img-fluid rounded-start rounded-end-0" style="max-height: 90px;" :alt="c.node?.name.userPreferred" :title="c.node?.name.userPreferred">
            </div>
            <div class="col text-start me-auto mt-0 py-1">
              <small class="d-block text-primary">{{ c.node?.name.userPreferred }}</small>
              <small class="text-capitalize">{{ c.role.toLowerCase() }}</small>
            </div>
          </div>
        </div>
      </template>
      <span v-if="i === result?.characters?.edges?.length - 1" ref="lastRow" class="m-0 p-0" />
      <SpinnerLoading v-if="i === result?.characters?.edges?.length - 1 && nexted" class="col-12 col-lg-6 col-xl-6 col-xxl-4 mb-3" />
    </template>
  </div>
</template>
