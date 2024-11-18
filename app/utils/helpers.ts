import { format, formatDistanceToNow } from "date-fns";
import type { RouteLocationNormalizedGeneric } from "vue-router";

export const getRating = (percent: number) => {
  if (!percent) return 0;
  const stars = (percent / 100) * 10;
  const format = Math.round(stars * 10) / 10;
  return format;
};

export const onScreen = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth);
};

export const formatDate = (y?: number, m?: number, d?: number) => {
  if (m && y && d)
    return format(new Date(y, m - 1, d), "MMM d, yyyy");
  else if (!d && m && y)
    return format(new Date(y, m - 1), "MMM yyyy");
  else if (!d && !m && y)
    return y;
  else if (d && m && !y)
    return format(new Date(m - 1, d), "MMM") + " " + d;
};

export const formatDayName = (day: number) => {
  return format(new Date(0, 0, day), "EEEE");
};

export const formatTime = (timestamp: number) => {
  return format(new Date(timestamp * 1000), "p");
};

export const getStudios = (studios: Record<string, any>) => {
  return studios.edges.filter((edge: { isMain: boolean }) => edge.isMain === true)
    .map((edge: { node: { name: string } }) => edge.node.name).join(", ");
};

export const getProducers = (studios: Record<string, any>) => {
  return studios.edges.filter((edge: { isMain: boolean }) => edge.isMain === false)
    .map((edge: { node: { name: string } }) => edge.node.name).join(", ");
};

export const fixDescription = (text: string) => {
  const limit = 900;
  text = text
    .replace(/<br>/g, "")
    .replace(/(\(Source:.*?\)).*/s, "$1");

  if (text?.length > limit) {
    text = text.substring(0, limit) + "...";
    return { text, more: true as boolean };
  }
  return { text, more: false as boolean };
};

export const sortEpisodes = (episodes: AnimeEpisodes[]) => {
  episodes?.sort((a, b) => {
    const matchA = a?.title.match(/\d+/g);
    const matchB = b?.title.match(/\d+/g);

    const episodeA = matchA ? parseInt(matchA[0]) : Number.MIN_SAFE_INTEGER;
    const episodeB = matchB ? parseInt(matchB[0]) : Number.MIN_SAFE_INTEGER;

    return episodeB - episodeA;
  });
  return episodes;
};

export const noVaInLanguage = (actors: StaffInfo[], language: string) => {
  for (const va of actors) {
    if (va.languageV2 === language) {
      return false;
    }
  }
  return true;
};

export const fixSeoDescription = (text: string) => {
  const limit = 300;
  if (text?.length > limit) {
    text = text.substring(0, limit) + "...";
    return { text: text as string, more: true as boolean };
  }
  return { text: text as string, more: false as boolean };
};

export const fixEpisodeTitle = (text: string) => {
  const spliced = text.split(" - ");
  const episode = spliced[0]?.replace("Episode ", "E");
  const title = spliced[1];
  return { episode, title };
};

export const fixStaffDescription = (text: string) => {
  return text
    .replaceAll("https://anilist.co/anime", "/a")
    .replaceAll("https://anilist.co/staff", "/p")
    .replace("<p><strong>", "<h6 class=\"fw-500 d-flex justify-content-start align-items-start anime-row flex-wrap mx-0 mb-2\"><strong>")
    .replaceAll("</p>", "</h6>")
    .replaceAll("<strong>", "<span><span class=\"mb-2 text-primary fw-500\">")
    .replaceAll("</strong>", "</span>")
    .replaceAll("<br />\n<span>", "</span><span>")
    .replaceAll("</h6>\n", "</span></h6>\n")
    .replaceAll("<span><span", "<span class=\"mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize\"><span")
    .replaceAll("\n", "");
};

export const distanceToNow = (date: number) => {
  const string = formatDistanceToNow(date * 1000, { addSuffix: true });
  if (date) return string.replace(/years?|months?|weeks?|days?|hours?|minutes?|seconds?/g, (match) => {
    return match[0] + (match.startsWith("mo") ? "o" : "");
  }).replace(/about/g, "");
};

export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
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

export const availablePageTypes: { name: ListType, routeType: string, title: string }[] = [
  { name: "new", routeType: "newly", title: "Newly Released" },
  { name: "top-rated", routeType: "rated", title: "Top Rated" },
  { name: "trending", routeType: "popular", title: "Trending" },
  { name: "upcoming", routeType: "upcoming", title: "Upcoming" }
];

export const fromSameRouteParams = (last: RouteLocationNormalizedGeneric, current: RouteLocationNormalizedGeneric) => {
  return JSON.stringify(last?.params) === JSON.stringify(current.params) && last.fullPath !== current.fullPath;
};
