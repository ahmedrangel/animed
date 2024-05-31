import { format } from "date-fns";

export const getRating = (percent: number) => {
  const stars = (percent / 100) * 10;
  const format = Math.round(stars * 10) / 10;
  return format;
};

export const formatRating = (rating: number) => {
  if (rating >= 1000000) {
    return (rating / 1000000).toFixed(2) + "m";
  } else if (rating >= 1000) {
    return (rating / 1000).toFixed(1) + "k";
  }
  return rating.toString();
};

export const onScreen = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth);
};

export const fixSlug = (name: string) => {
  return name?.replace(/ /g, "-")?.replace(/[^a-zA-Z0-9-]/g, "")?.toLowerCase();
};

export const formatDate = (y?: number, m?: number, d?: number) => {
  if (m && y && d) {
    return format(new Date(y, m - 1, d), "MMM d, yyyy");
  } else if (!d && m && y) {
    return format(new Date(y, m - 1), "MMM yyyy");
  } else if (!d && !m && y) {
    return format(new Date(y), "yyyy");
  }
};

export const getStudios = (studios: Record<string, any>) => {
  return studios.edges.filter((edge: { isMain: boolean; }) => edge.isMain === true)
    .map((edge: { node: { name: string; }; }) => edge.node.name).join(", ");
};

export const getProducers = (studios: Record<string, any>) => {
  return studios.edges.filter((edge: { isMain: boolean; }) => edge.isMain === false)
    .map((edge: { node: { name: string; }; }) => edge.node.name).join(", ");
};

export const fixDescription = (text: string) => {
  const limit = 1000;
  if (text.length > limit) {
    text = text.substring(0, limit) + "...";
    return { text: text as string, more: true as boolean };
  }
  return { text: text as string, more: false as boolean };
};

export const sortEpisodes = (episodes: any[]) => {
  episodes?.sort((a, b) => {
    const episodeA = parseInt(a?.title.match(/\d+/g)[0]);
    const episodeB = parseInt(b?.title.match(/\d+/g)[0]);
    return episodeB - episodeA;
  });
  return episodes;
};

export const noVaInLanguage = (actors: Array<Record<string, any>>, language: string) => {
  for (const va of actors) {
    if (va.languageV2 === language) {
      return false;
    }
  }
  return true;
};

export const fixSeoDescription = (text: string) => {
  const limit = 300;
  if (text.length > limit) {
    text = text.substring(0, limit) + "...";
    return { text: text as string, more: true as boolean };
  }
  return { text: text as string, more: false as boolean };
};

export const getRandomObject = (obj: Record<string, any>) => {
  return obj[Math.floor(Math.random() * obj.length - 1)];
};

export const fixEpisodeTitle = (text: string) => {
  const spliced = text.split(" - ");
  const episode = spliced[0].replace("Episode", "EP");
  const title = spliced[1];
  return { episode, title };
};