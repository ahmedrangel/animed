<script setup lang="ts">
const props = defineProps<{
  data: Anime;
}>();

const anime = computed(() => props.data);
const { loggedIn, user } = useUserSession();
const watchlist = useWatchlist();
const added = computed(() => watchlist.value?.find(item => item.mediaId === Number(anime.value.id)));
const updating = ref(false);

const watchlistData = ref({
  status: added.value?.status || 0,
  progress: added.value?.progress || 0,
  score: added.value?.score || null,
  startedDate: added.value?.startedDate ? new Date(added.value.startedDate).toISOString().split("T")[0] : null,
  finishedDate: added.value?.startedDate ? new Date(added.value.finishedDate).toISOString().split("T")[0] : null
});

const oldWatchlistData = ref({ ...watchlistData.value });

const fixProgress = (input: string) => {
  const progress = Number(input);
  if (!input || progress <= 0) return 0;
  if (anime.value?.episodes && progress > anime.value.episodes) return anime.value.episodes;
  return progress;
};

watch(watchlistData, () => {
  watchlistData.value.progress = fixProgress(watchlistData.value.progress);
  if (!watchlist.value || JSON.stringify(watchlistData.value) === JSON.stringify(oldWatchlistData.value)) return;
  if (watchlistData.value.startedDate && watchlistData.value.finishedDate && watchlistData.value.startedDate > watchlistData.value.finishedDate) {
    watchlistData.value.finishedDate = watchlistData.value.startedDate;
  }
  if (watchlistData.value.status === watchStatus.WATCHING.id && !watchlistData.value.startedDate) {
    watchlistData.value.startedDate = new Date().toISOString().split("T")[0];
  }
  if (!watchlistData.value.startedDate) watchlistData.value.startedDate = null;
  if (!watchlistData.value.finishedDate) watchlistData.value.finishedDate = null;
}, { deep: true });

watchDebounced(watchlistData, async () => {
  if (!watchlist.value) return;
  updating.value = true;
  await updateWatchlist();
  updating.value = false;
}, { deep: true, debounce: 1000 });

const updateWatchlist = async () => {
  if (!watchlist.value) return;
  watchlist.value = await Promise.all(watchlist.value.map(async (item) => {
    if (item.mediaId === Number(anime.value.id)) {
      updating.value = true;
      item.status = watchlistData.value.status;
      item.progress = watchlistData.value.progress;
      item.score = watchlistData.value.score;
      item.startedDate = watchlistData.value.startedDate ? new Date(watchlistData.value.startedDate).getTime() : null;
      item.finishedDate = watchlistData.value.finishedDate ? new Date(watchlistData.value.finishedDate).getTime() : null;
      const toUpdate = {
        ...watchlistData.value.status !== oldWatchlistData.value.status && { status: watchlistData.value.status },
        ...watchlistData.value.progress !== oldWatchlistData.value.progress && { progress: watchlistData.value.progress },
        ...watchlistData.value.score !== oldWatchlistData.value.score && { score: watchlistData.value.score },
        ...watchlistData.value.startedDate !== oldWatchlistData.value.startedDate && { startedDate: watchlistData.value.startedDate },
        ...watchlistData.value.finishedDate !== oldWatchlistData.value.finishedDate && { finishedDate: watchlistData.value.finishedDate }
      };
      const updated = await $fetch("/api/watchlist", {
        method: "PATCH",
        body: { mediaId: item.mediaId, ...toUpdate }
      }).catch(() => null);
      if (!updated) {
        watchlistData.value = { ...oldWatchlistData.value };
        return { mediaId: item.mediaId, userId: item.userId, ...oldWatchlistData.value, updatedAt: item.updatedAt };
      }
      oldWatchlistData.value = { ...watchlistData.value };
    }
    return item;
  }));
  updating.value = false;
};

const updateButtonDisabled = computed(() => JSON.stringify(watchlistData.value) === JSON.stringify(oldWatchlistData.value));
</script>

<template>
  <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 px-0" style="max-width: 400px;">
    <img id="cover" :src="anime?.coverImage?.extraLarge" class="img-fluid mb-2" :alt="anime.title.romaji" :title="anime.title.romaji" data-aos="fade-in">
    <ButtonComp v-if="loggedIn && !added && user" v-ripple="{ color: 'rgba(0,0,0,0.4)' }" class="bg-primary text-dark w-100 px-3 py-2" icon="ph:plus-bold" @click="addToWatchlist(anime.id, fixSlug(data.title.romaji))">
      Add to Watchlist
    </ButtonComp>
    <div v-if="loggedIn && added">
      <div class="input-group mb-2">
        <label class="input-group-text bg-primary bg-secondary h6 mb-0">Status</label>
        <select v-model="watchlistData.status" class="form-select h6 mb-0" :disabled="updating">
          <option v-for="(status, key) in watchStatus" :key="key" :value="status.id">
            {{ status.name }}
          </option>
        </select>
      </div>
      <div class="input-group mb-2">
        <label class="input-group-text bg-primary bg-secondary h6 mb-0">Progress</label>
        <input v-model="watchlistData.progress" type="number" class="form-control h6 mb-0" placeholder="0" :disabled="updating">
        <span class="input-group-text bg-primary bg-secondary d-flex align-items-center justify-content-center gap-2">
          <div class="bg-dark rounded-circle text-primary d-flex align-items-center justify-content-center" role="button" style="width: 22px; height: 22px;" @click="watchlistData.progress--">
            <Icon name="ph:minus-bold" />
          </div>
          <h6 class="mb-0 text-white">/</h6>
          <div class="bg-dark rounded-circle text-primary d-flex align-items-center justify-content-center" role="button" style="width: 22px; height: 22px;" @click="watchlistData.progress++">
            <Icon name="ph:plus-bold" />
          </div>
        </span>
      </div>
      <div class="input-group mb-2">
        <label class="input-group-text bg-primary bg-secondary h6 mb-0">Score</label>
        <select v-model="watchlistData.score" class="form-select h6 mb-0" :disabled="updating">
          <option selected :value="null">-</option>
          <option v-for="i in [...Array(10)].map((_, i) => 10 - i)" :key="i" :value="i">{{ i }}</option>
        </select>
      </div>
      <div class="input-group mb-2">
        <label class="input-group-text bg-primary bg-secondary h6 mb-0">Started</label>
        <input v-model="watchlistData.startedDate" type="date" class="form-control h6 mb-0" :disabled="updating">
      </div>
      <div class="input-group mb-2">
        <label class="input-group-text bg-primary bg-secondary h6 mb-0">Finished</label>
        <input v-model="watchlistData.finishedDate" type="date" :min="watchlistData.startedDate || undefined" class="form-control h6 mb-0" :disabled="updating">
      </div>
      <ButtonComp v-ripple="{ color: 'rgba(0,0,0,0.4)' }" class="bg-primary text-dark w-100 px-3 py-2" icon="ph:floppy-disk-bold" :disabled="updateButtonDisabled" @click="updateWatchlist">
        Update
      </ButtonComp>
    </div>
  </div>
</template>
