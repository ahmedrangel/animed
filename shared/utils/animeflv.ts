import { API } from "~~/enums/animeflv-api";

export const getAflvSearch = async (query: string, userAgent?: string) => {
  const response = await $fetch(API.BASE + "/search?query=" + query, {
    headers: {
      ...userAgent ? { "User-Agent": userAgent } : {}
    }
  }).catch(() => null) as Record<string, any>;
  const data = response?.data?.media || [];
  return data;
};
