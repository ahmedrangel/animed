import { API } from "../../../../enums/myanimelist";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const config = useRuntimeConfig();
  const { user } = getRouterParams(event);
  const { data } = await $fetch<{ data: MyAnimeListWatchlist[] }>(`${API.BASE}/users/${user}/animelist`, {
    query: {
      fields: "list_status",
      limit: 1000,
      nsfw: true
    },
    headers: {
      "X-MAL-CLIENT-ID": config.myanimelist.clientId
    }
  }).catch(() => {
    return { data: [] };
  });
  return data;
});
