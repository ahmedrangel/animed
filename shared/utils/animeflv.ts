import { API } from "~~/enums/animeflv-api";

export const getAflvSearch = async (query: string, userAgent?: string): Promise<AFlvRequest["data"]["media"]> => {
  const response = await $fetch<AFlvRequest>(API.BASE + "/search?query=" + query, {
    headers: {
      ...userAgent ? { "User-Agent": userAgent } : {}
    }
  }).catch(() => null);
  return response?.data?.media || [];
};
