import { API } from "~~/enums/animeflv-api";
import { useCachedFetch } from "~~/shared/utils/composables";

export const getAflvSearch = async (query: string): Promise<AFlvRequest["data"]["media"]> => {
  const response = await useCachedFetch<AFlvRequest>(API.BASE + "/search?query=" + query, {}, {
    cacheKey: `animeflv:${decodeURIComponent(query)?.replace(/\W/g, "")}`,
    swr: false,
    ttl: 86400
  }).catch(() => null);
  return response?.data?.media || [];
};
