export const fixSlug = (name?: string | null) => {
  return name?.replace(/ /g, "-")?.normalize("NFD").replace(/[^a-zA-Z0-9-]/g, "")?.toLowerCase();
};

export const animeFlvRelationLogic = (aflvArr: AFlvRequest["data"]["media"], anilistObj: Anime): AnimeExternalLinks | undefined => {
  for (const aflv of aflvArr) {
    if (aflv?.type === "Anime"
      && (
        aflv?.slug?.replace("-tv", "") === anilistObj?.slug
        || aflv?.title?.toLowerCase()?.replace(/[^\w]/g, "") === anilistObj?.title?.english?.toLowerCase()?.replace(/[^\w]/g, "")
        || aflv?.title?.toLowerCase()?.replace(/[^\w]/g, "") === anilistObj?.title?.romaji?.toLowerCase()?.replace(/[^\w]/g, "")
        || anilistObj?.title?.english?.toLowerCase()?.replace(/[^\w]/g, "").includes(aflv?.title?.toLowerCase()?.replace(/[^\w]/g, ""))
        || anilistObj?.title?.romaji?.toLowerCase()?.replace(/[^\w]/g, "").includes(aflv?.title?.toLowerCase()?.replace(/[^\w]/g, ""))
      )) {
      return {
        site: "AnimeFLV",
        url: aflv?.url,
        icon: "/images/aflv.png",
        color: "#2f353a"
      };
    }
  }
};
