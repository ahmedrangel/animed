import { API } from "~/enums/animeflv-api";

export const aflvSearch = async (query: string) => {
  const { search } = await $fetch(API.BASE + "/search?query=" + query) as Record<string, any>;
  const data = search?.data || [];
  return data;
};