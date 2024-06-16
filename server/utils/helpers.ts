export { categories } from "~/utils/categories";
export { fixSlug } from "~/utils/helpers";
export { getAnimeInfo, getNewlyReleased, getPopular, getTopRated, getAnimeSlug, getAnimeCharacters, getAnimeEpisodes, getStaff, getStaffSlug, getExplore, getUpcoming } from "~/utils/anilist.client";
export { getAflvSearch } from "~/utils/animeflv.client";

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const animeFlvRelationLogic = (aflvArr: Record<string, any>[], anilistObj: Record<string, any>) => {
  for (const aflv of aflvArr) {
    if (aflv?.type === "Anime" &&
    (
      aflv?.slug?.replace("-tv", "") === anilistObj?.slug ||
      aflv?.title?.toLowerCase()?.replace(/[^\w]/g, "") === anilistObj?.title?.english?.toLowerCase()?.replace(/[^\w]/g, "") ||
      aflv?.title?.toLowerCase()?.replace(/[^\w]/g, "") === anilistObj?.title?.romaji?.toLowerCase()?.replace(/[^\w]/g, "") ||
      anilistObj?.title?.english?.toLowerCase()?.replace(/[^\w]/g, "").includes(aflv?.title?.toLowerCase()?.replace(/[^\w]/g, "")) ||
      anilistObj?.title?.romaji?.toLowerCase()?.replace(/[^\w]/g, "").includes(aflv?.title?.toLowerCase()?.replace(/[^\w]/g, ""))
    )) {
      return {
        site: "AnimeFLV",
        url: aflv?.url,
        icon: "/images/aflv.png",
        color: "#2f353a",
      };
    }
  }
};