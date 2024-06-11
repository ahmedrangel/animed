export { categories } from "~/utils/categories";
export { fixSlug } from "~/utils/helpers";
export { getAnimeInfo, getNewlyReleased, getPopular, getTopRated, getAnimeSlug, getAnimeCharacters, getAnimeEpisodes, getStaff, getStaffSlug } from "~/utils/anilist.client";

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};