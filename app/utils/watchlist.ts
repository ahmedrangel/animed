export const watchStatus = {
  WATCHING: {
    id: 1,
    name: "Watching",
    color: "#00c153"
  },
  COMPLETED: {
    id: 2,
    name: "Completed",
    color: "#0090d0"
  },
  ON_HOLD: {
    id: 3,
    name: "On Hold",
    color: "#fbbf24"
  },
  DROPPED: {
    id: 4,
    name: "Dropped",
    color: "#a90000"
  },
  PLAN_TO_WATCH: {
    id: 0,
    name: "Plan to Watch",
    color: "#000000"
  }
};

export const updateMyGlobalWatchlist = (newWatchlist?: Watchlist[]) => {
  if (!newWatchlist || !newWatchlist.length) return;
  useNuxtApp().payload.data["mywatchlist"] = newWatchlist.sort((a, b) => a.mediaSlug.localeCompare(b.mediaSlug)).sort((a, b) => {
    const statusOrder = [1, 2, 3, 4, 0];
    const aStatus = statusOrder.indexOf(a.status);
    const bStatus = statusOrder.indexOf(b.status);
    return aStatus - bStatus;
  });
};

export const watchStatusNameBydId = (id: number) => {
  return Object.values(watchStatus).find(status => status.id === id)?.name;
};

export const watchStatusColorById = (id: number) => {
  return Object.values(watchStatus).find(status => status.id === id)?.color;
};

export const addToWatchlist = async (mediaId: number, mediaSlug: string) => {
  const watchlist = useNuxtApp().payload.data["mywatchlist"] as Watchlist[];
  const result = await $fetch<Watchlist>("/api/watchlist", {
    method: "POST",
    body: { mediaId, mediaSlug, status: watchStatus.PLAN_TO_WATCH.id }
  }).catch(() => null);
  if (result && watchlist) {
    updateMyGlobalWatchlist([...(watchlist || []), result]);

    return result;
  }
};

export const importMyAnimeList = async () => {
  const user = prompt("Enter your MyAnimeList username:")?.trim();
  if (!user) return;
  const myanimelistData = await $fetch<MyAnimeListWatchlist[]>(`/api/watchlist/myanimelist/${user}`).catch(() => null);
  if (!myanimelistData) return;
  const chunkSize = 50;
  const importData = [];
  for (let i = 0; i < myanimelistData.length; i += chunkSize) {
    const chunk = myanimelistData.slice(i, i + chunkSize);
    const malIds = chunk.map(item => item.node.id);
    const anilistData = await getListByIdIn({
      idMal_in: malIds,
      perPage: 50,
      noFilter: true,
      includeNSFW: true,
      extraFields: ["idMal"]
    });
    for (const item of chunk) {
      const anilistItem = anilistData.media.find(media => media.idMal === item.node.id);
      const listStatus = item.list_status;
      if (!anilistItem) continue;
      importData.push({
        mediaId: anilistItem.id,
        mediaSlug: fixSlug(anilistItem.title.romaji),
        score: listStatus.score || null,
        status: listStatus.status === "plan_to_watch" ? 0 : listStatus.status === "watching" ? 1 : listStatus.status === "completed" ? 2 : listStatus.status === "on_hold" ? 3 : listStatus.status === "dropped" ? 4 : null,
        progress: listStatus.num_episodes_watched || 0,
        startedDate: listStatus.start_date,
        finishedDate: listStatus.finish_date,
        updatedAt: listStatus.updated_at ? new Date(listStatus.updated_at).getTime() : undefined
      });
    }
  }
  await $fetch("/api/watchlist/myanimelist/import", {
    method: "POST",
    body: importData
  }).catch(() => null);
  const watchlist = await $fetch("/api/watchlist").catch(() => null);
  if (watchlist) updateMyGlobalWatchlist(watchlist);
  return true;
};
