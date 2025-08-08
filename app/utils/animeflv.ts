import { API } from "~~/enums/animeflv-api";
import { useCachedFetch } from "~~/shared/utils/composables";

export const getAflvSearch = async (query: string, userAgent?: string): Promise<AFlvRequest["data"]["media"]> => {
  const response = await useCachedFetch<AFlvRequest>(API.BASE + "/search?query=" + query, {
    headers: {
      ...userAgent ? { "User-Agent": userAgent } : {}
    }
  }, {
    cacheKey: `animeflv:${query}`,
    swr: false,
    ttl: 86400
  }).catch(() => null);
  return response?.data?.media || [];
};
