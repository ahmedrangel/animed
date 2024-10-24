import { format, formatDistanceToNow } from "date-fns";

export const getRating = (percent: number) => {
  if (!percent) return 0;
  const stars = (percent / 100) * 10;
  const format = Math.round(stars * 10) / 10;
  return format;
};

export const formatRating = (rating: number) => {
  if (rating >= 1000000)
    return (rating / 1000000).toFixed(2) + "m";
  else if (rating >= 1000)
    return (rating / 1000).toFixed(1) + "k";
  return rating.toString();
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

export const getRandomObject = (obj: Record<string, any>) => {
  const index = Math.floor(Math.random() * obj.length);
  return obj[index];
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

export const fixSlug = (name?: string | null) => {
  return name?.replace(/ /g, "-")?.normalize("NFD").replace(/[^a-zA-Z0-9-]/g, "")?.toLowerCase();
};

export const distanceToNow = (date: number) => {
  const string = formatDistanceToNow(date * 1000, { addSuffix: true });
  if (date) return string.replace(/years?|months?|weeks?|days?|hours?|minutes?|seconds?/g, (match) => {
    return match[0] + (match.startsWith("mo") ? "o" : "");
  });
};

export const ytPlayerApi = {
  stopVideo: (iframe: HTMLIFrameElement) => iframe.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "stopVideo", args: "" }), "*")
};

export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const availablePageTypes = [
  { name: "new", routeType: "newly" },
  { name: "top-rated", routeType: "rated" },
  { name: "trending", routeType: "popular" },
  { name: "upcoming", routeType: "upcoming" }
];
