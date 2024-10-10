import { API } from "~~/enums/jikan";

export const getAnimeThemes = async (malId: number) => {
  const { data } = await $fetch(`${API.BASE}/anime/${malId}/themes`).catch(() => null) as { data: AnimeThemes };
  return data;
};
