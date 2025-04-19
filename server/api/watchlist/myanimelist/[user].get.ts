import { API } from "../../../../enums/myanimelist";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const config = useRuntimeConfig();
  const { user } = getRouterParams(event);
  console.info(config.myanimelist.clientId);
  const { data } = await $fetch<{ data: MyAnimeListWatchlist[] }>(`${API.BASE}/users/${user}/animelist`, {
    query: {
      fields: "list_status",
      limit: 1000,
      nsfw: true
    },
    headers: {
      "X-MAL-CLIENT-ID": config.myanimelist.clientId
    }
  }).catch((e) => {
    console.info("Error fetching MyAnimeList watchlist", e);
    return { data: [] };
  });
  return data;
});
