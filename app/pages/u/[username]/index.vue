<script setup lang="ts">
const { params } = useRoute("u-username");
const { username } = params;
const { data: result } = await useFetch<User>(`/api/account/${username}`);
const { clear, user, loggedIn } = useUserSession();
const isMyPage = loggedIn.value && user.value?.username?.toLowerCase() === username.toLowerCase();

if (!result.value && isMyPage) {
  clear();
  navigateTo("/login", { external: true });
}

if (!result.value && !isMyPage) {
  throw createError({
    statusCode: 404,
    message: `User not found: ${username}`,
    fatal: true
  });
}

const { data: userWatchlist } = await useFetch("/api/watchlist", {
  query: { userId: result.value?.id, page: 1 }
});

const currentUser = {
  loggedIn: user.value?.username?.toLocaleLowerCase() === username.toLowerCase() && String(result.value?.username).toLowerCase() === username.toLowerCase(),
  ...result.value
};

const animeList = ref<Anime[]>([]);
interface WatchlistData {
  [key: string]: {
    score?: number | null;
    status?: number;
    progress?: number;
    startedDate?: string | null;
    finishedDate?: string | null;
  };
}

const watchlistData = ref<WatchlistData>();
const oldWatchlistData = ref<WatchlistData>();

onMounted(async () => {
  await getNextMedia();
  if (animeList.value.length) {
    addEventListener("scroll", scrollHandler);
  }
});

const fixProgress = (input: string, anime: Anime) => {
  const progress = Number(input);
  if (!input || progress <= 0) return 0;
  if (anime.episodes && progress > anime.episodes) return anime.episodes;
  return progress;
};

watch(watchlistData, () => {
  if (!watchlistData.value) return;
  Object.entries(watchlistData.value).map(async ([mediaId, data]) => {
    const oldData = oldWatchlistData.value?.[mediaId];
    if (data.progress !== oldData?.progress) {
      watchlistData.value![mediaId]!.progress! = fixProgress(String(watchlistData.value![mediaId]!.progress)!, animeList.value!.find(el => el.id === Number(mediaId))!);
    }
  });
}, { deep: true });

watchDebounced(watchlistData, async () => {
  if (!watchlistData.value) return;
  Object.entries(watchlistData.value).map(async ([mediaId, data]) => {
    const oldData = oldWatchlistData.value?.[mediaId];
    const toUpdate = {
      ...data.status !== oldData?.status && { status: data.status },
      ...data.progress !== oldData?.progress && { progress: data.progress },
      ...data.score !== oldData?.score && { score: data.score },
      ...data.startedDate !== oldData?.startedDate && { startedDate: data.startedDate },
      ...data.finishedDate !== oldData?.finishedDate && { finishedDate: data.finishedDate }
    };
    if (!Object.keys(toUpdate).length) return;
    const updated = await $fetch("/api/watchlist", {
      method: "PATCH",
      body: {
        mediaId: Number(mediaId),
        ...toUpdate
      }
    }).catch(() => null);
    if (!updated) {
      watchlistData.value![mediaId] = { ...oldWatchlistData.value![mediaId] };
      return;
    }
    oldWatchlistData.value![mediaId] = { ...data };
  });
}, { debounce: 1000, deep: true });

const removeItem = async (mediaId: number) => {
  const removed = await $fetch("/api/watchlist", {
    method: "DELETE",
    query: { mediaId }
  }).catch(() => null);
  if (!removed) return;
  delete watchlistData.value![String(mediaId)];
  delete oldWatchlistData.value![String(mediaId)];
  animeList.value = animeList.value!.filter(el => el.id !== mediaId);
};

const viewMode = ref(0);
const viewModes = ["Normal", "Edit"];
const editMode = ref(false);
watch(viewMode, () => {
  if (viewMode.value === 1) {
    return editMode.value = true;
  }
  editMode.value = false;
});

const nexted = ref(false) as Ref<boolean>;
const count = ref(1) as Ref<number>;
const lastRow = ref() as Ref<HTMLElement[]>;
const hasNextPage = ref(false);

const getNextMedia = async () => {
  nexted.value = true;
  const newUserWatchList = await $fetch("/api/watchlist", {
    query: { userId: result.value?.id, page: count.value }
  });
  if (!newUserWatchList) return;
  const mediaIds = newUserWatchList.map(item => item.mediaId);
  if (!mediaIds.length) return;
  const next = await getListByIdIn({
    id_in: mediaIds,
    perPage: 50,
    extraFields: ["genres", "episodes"],
    includeNSFW: true,
    noFilter: true
  });
  animeList.value.push(...next.media);
  animeList.value = animeList.value.toSorted((a, b) => mediaIds.indexOf(a.id) - mediaIds.indexOf(b.id));
  if (isMyPage) {
    const mappedValues = newUserWatchList.map(item => ({
      [String(item.mediaId)]: {
        score: item.score,
        status: item.status || 0,
        progress: item.progress || 0,
        startedDate: item.startedDate,
        finishedDate: item.finishedDate
      }
    })).reduce((acc, cur) => ({ ...acc, ...cur }), {});
    oldWatchlistData.value = { ...oldWatchlistData.value, ...JSON.parse(JSON.stringify({ ...mappedValues })) };
    watchlistData.value = { ...watchlistData.value, ...mappedValues };
  }
  nexted.value = false;
  count.value = count.value + 1;
  hasNextPage.value = next.pageInfo.hasNextPage;
};

const scrollHandler = async () => {
  if (lastRow.value?.[0] && onScreen(lastRow.value[0]) && !nexted.value && count.value && hasNextPage.value) {
    await getNextMedia();
  }
};
</script>

<template>
  <main>
    <section id="profile" class="text-center py-4">
      <div class="px-2 px-lg-5 px-xl-5 w-100 position-relative">
        <ProfileDropdown />
        <ProfileMenu v-if="currentUser.loggedIn" class="mb-4" />
        <div class="d-flex justify-content-center align-items-center mb-3">
          <div class="alert alert-warning m-0" role="alert">
            <small>The Profile and Watchlist feature are currently in development</small>
          </div>
        </div>
        <div v-if="isMyPage" class="d-flex justify-content-center gap-3 align-items-center mb-3">
          <small>View Mode</small>
          <select v-model="viewMode" class="form-select h6 mb-0 w-auto">
            <option v-for="(mode, i) in viewModes" :key="i" :value="i" :selected="viewMode === i">{{ mode }}</option>
          </select>
        </div>
        <div v-if="animeList?.length">
          <div class="table-responsive">
            <table class="table table-bordered bg-secondary border align-middle">
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col"><small>#</small></th>
                  <th scope="col" />
                  <th scope="col"><small>Title</small></th>
                  <th scope="col"><small>Score</small></th>
                  <th scope="col"><small>Status</small></th>
                  <th scope="col"><small>Progress</small></th>
                  <th scope="col"><small>Started Date</small></th>
                  <th scope="col"><small>Finished Date</small></th>
                  <th scope="col"><small>Genres</small></th>
                  <th v-if="isMyPage && editMode" scope="col" />
                </tr>
              </thead>
              <tbody>
                <template v-for="(anime, i) of animeList" :key="i">
                  <tr>
                    <td :style="{ backgroundColor: watchStatusColorById(watchlistData?.[String(anime.id)]?.status ?? userWatchlist?.find(el => el.mediaId === anime.id)?.status ?? 0) }" />
                    <td class="bg-secondary">
                      <small>{{ i + 1 }}</small>
                    </td>
                    <td class="bg-secondary">
                      <img :src="anime.coverImage.extraLarge || anime.coverImage?.large" :alt="anime.title.romaji" :title="anime.title.romaji" style="max-height: 80px;">
                    </td>
                    <td class="bg-secondary text-start" style="max-width: 300px;">
                      <NuxtLink :to="`/a/${anime.id}/${fixSlug(anime.title.romaji)}`" :title="anime.title?.english ? anime.title?.english : anime.title?.romaji">
                        <small>{{ anime.title?.romaji }}</small>
                      </NuxtLink>
                      <br>
                      <small class="text-muted">{{ anime.title?.english ? anime.title?.english : anime.title?.romaji }}</small>
                    </td>
                    <td class="bg-secondary">
                      <select v-if="isMyPage && editMode" v-model="watchlistData![String(anime.id)]!.score" class="form-select h6 mb-0 w-auto">
                        <option selected :value="null">-</option>
                        <option v-for="j in [...Array(10)].map((_, j) => 10 - j)" :key="j" :value="j">{{ j }}</option>
                      </select>
                      <small v-else>{{ watchlistData?.[String(anime.id)]?.score ?? userWatchlist?.find(el => el.mediaId === anime.id)?.score ?? "-" }}</small>
                    </td>
                    <td class="bg-secondary">
                      <select v-if="isMyPage && editMode" v-model="watchlistData![String(anime.id)]!.status" class="form-select h6 mb-0 w-auto">
                        <option v-for="(status, key) in watchStatus" :key="key" :value="status.id">
                          {{ status.name }}
                        </option>
                      </select>
                      <small v-else>{{ watchStatusNameBydId(watchlistData?.[String(anime.id)]?.status ?? userWatchlist?.find(el => el.mediaId === anime.id)?.status ?? 0) }}</small>
                    </td>
                    <td class="bg-secondary">
                      <span v-if="isMyPage" class="d-flex align-items-center justify-content-center gap-1">
                        <div class="bg-dark rounded-circle text-primary d-flex align-items-center justify-content-center" role="button" @click="watchlistData![String(anime.id)]!.progress!--">
                          <Icon name="ph:minus-bold" class="p-1" style="width: 20px; height: 20px;" />
                        </div>
                        <small>{{ watchlistData![String(anime.id)]!.progress }}</small>
                        <h6 class="mb-0 text-white">/</h6>
                        <small>{{ anime.episodes || "?" }}</small>
                        <div class="bg-dark rounded-circle text-primary d-flex align-items-center justify-content-center" role="button" @click="watchlistData![String(anime.id)]!.progress!++">
                          <Icon name="ph:plus-bold" class="p-1" style="width: 20px; height: 20px;" />
                        </div>
                      </span>
                      <small v-else>{{ watchlistData?.[String(anime.id)]?.progress ?? userWatchlist?.find(el => el.mediaId === anime.id)?.progress }} / {{ anime.episodes || "?" }}</small>
                    </td>
                    <td class="bg-secondary">
                      <VueDatePicker v-if="isMyPage && editMode" v-model="watchlistData![String(anime.id)]!.startedDate" class="form-control h6 mb-0 w-auto" v-bind="vueDatePickerAttrs">
                        <template #trigger>
                          <span class="text-nowrap">{{ watchlistData![String(anime.id)]!.startedDate ? formatDatePicker(watchlistData![String(anime.id)]!.startedDate) : "-" }}</span>
                        </template>
                      </VueDatePicker>
                      <small v-else class="text-nowrap">{{ formatDatePicker(watchlistData?.[String(anime.id)]?.startedDate || userWatchlist?.find(el => el.mediaId === anime.id)?.startedDate) }}</small>
                    </td>
                    <td class="bg-secondary">
                      <VueDatePicker v-if="isMyPage && editMode" v-model="watchlistData![String(anime.id)]!.finishedDate" class="form-control h6 mb-0 w-auto" v-bind="vueDatePickerAttrs" :min-date="watchlistData?.[String(anime.id)]?.startedDate ? watchlistData?.[String(anime.id)]?.startedDate + 'T00:00' : undefined">
                        <template #trigger>
                          <span class="text-nowrap">{{ watchlistData![String(anime.id)]!.finishedDate ? formatDatePicker(watchlistData![String(anime.id)]!.finishedDate) : "-" }}</span>
                        </template>
                      </VueDatePicker>
                      <small v-else class="text-nowrap">{{ formatDatePicker(watchlistData?.[String(anime.id)]?.finishedDate || userWatchlist?.find(el => el.mediaId === anime.id)?.finishedDate) }}</small>
                    </td>
                    <td class="bg-secondary" style="max-width: 200px; min-width: 200px;">
                      <div class="d-flex justify-content-center flex-wrap gap-1">
                        <template v-for="(genre, j) of anime.genres" :key="j">
                          <NuxtLink v-if="categories.some(c => c.name.toLowerCase() === genre.toLowerCase())" :to="`/c/${fixSlug(genre)}`">
                            <span class="badge bg-body align-middle fw-normal my-1">{{ genre }}</span>
                          </NuxtLink>
                          <span v-else class="badge bg-body align-middle fw-normal my-1">{{ genre }}</span>
                        </template>
                      </div>
                    </td>
                    <td v-if="isMyPage && editMode" class="bg-secondary">
                      <ButtonComp v-ripple="{ color: 'rgba(0,0,0,0.4)' }" class="bg-danger text-dark" icon="ph:trash-bold" style="width: 40px; height: 36px;" @click="removeItem(anime.id)" />
                    </td>
                  </tr>
                  <tr v-if="i === animeList?.length - 1 && hasNextPage">
                    <td colspan="9" class="m-0 px-0 py-3 bg-secondary">
                      <span ref="lastRow" />
                      <SpinnerLoading v-if="nexted" />
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>
