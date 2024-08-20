import { API } from "~~/enums/jikan";

export const getAnimeThemes = async (malId: string) => {
  const response = await $fetch(`${API.BASE}/anime/${malId}/themes`).catch(() => null) as Record<string, any>;
  const data = response?.data;
  return data;
};
