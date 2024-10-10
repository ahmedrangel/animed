import { API } from "~~/enums/animeflv-api";

export const getAflvSearch = async (query: string) => {
  const response = await $fetch(API.BASE + "/search?query=" + query).catch(() => null) as Record<string, any>;
  const data = response?.data?.media || [];
  return data;
};
