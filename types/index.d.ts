import type { FetchError as F } from "ofetch";
import type { Sort, Status } from "~~/enums/anilist";

export {};

declare global {
  type FetchError = F | undefined;

  interface AnimeTitle {
    romaji: string;
    english: string;
    native: string;
  }

  interface AnimeCoverImage {
    extraLarge: string;
  }

  interface AnimeDate {
    year: number;
    month: number;
    day: number;
  }

  interface AnimeTrailer {
    id: string;
    site: string;
  }

  interface AnimeNextAiringEpisode {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  }

  interface AnimeStudiosEdge {
    edges: {
      isMain: boolean;
      node: {
        id: number;
        name: string;
      };
    }[];
  }

  interface AnimeEpisodes {
    site: string;
    title: string;
    thumbnail: string;
    url: string;
  }

  interface StaffInfo {
    id: number;
    name: NameOptions;
    image: ImageOptions;
    languageV2?: string;
  }

  interface AnimeCharacters {
    pageInfo: PageInfo;
    edges: {
      id: number;
      role: "MAIN" | "SUPPORTING" | "BACKGROUND";
      node: StaffInfo;
      voiceActors: StaffInfo[];
    }[];
  }

  interface PageInfo {
    hasNextPage: boolean;
  }

  interface NameOptions {
    native?: string;
    userPreferred?: string;
    alternative?: string[];
  }

  interface ImageOptions {
    large?: string;
    medium?: string;
  }

  interface AnimeRecommendations {
    nodes: {
      mediaRecommendation: Anime;
    }[];
  }

  interface Anime {
    id: number;
    idMal: number;
    title: AnimeTitle;
    coverImage: AnimeCoverImage;
    bannerImage: string | null;
    startDate: AnimeDate;
    endDate: AnimeDate;
    description: string;
    season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
    seasonYear: number;
    format: string;
    status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
    episodes: number;
    duration: number;
    genres: string[];
    source: "ORIGINAL" | "MANGA" | "LIGHT_NOVEL" | "VISUAL_NOVEL" | "VIDEO_GAME" | "NOVEL" | "DOUJINSHI" | "ANIME" | "WEB_NOVEL" | "LIVE_ACTION" | "GAME" | "COMIC" | "MULTIMEDIA_PROJECT" | "PICTURE_BOOK" | "OTHER";
    averageScore: number | null;
    countryOfOrigin: string;
    trailer: AnimeTrailer;
    nextAiringEpisode: AnimeNextAiringEpisode | null;
    studios: AnimeStudiosEdge;
    externalLinks: {
      site: string;
      url: string | null;
      icon: string | null;
      color: string;
    }[];
    streamingEpisodes: AnimeEpisodes[];
    tags: {
      name: string;
    }[];
    characters: AnimeCharacters;
    recommendations: AnimeRecommendations | null;
    slug: string;
  }

  interface AnimeThemes {
    openings: string[];
    endings: string[];
  }

  interface AnimeList {
    pageInfo: PageInfo;
    media: Anime[];
    title: string;
    type: string;
    category: string | null;
    slug: string | null;
  }

  interface AnimePreviewListInfo {
    media: Anime[];
    title: string;
    route: string;
  }

  interface AnimePreviewList {
    preview: {
      [k: string]: AnimePreviewListInfo;
    };
    category?: string | null;
  }

  interface QueryOptions {
    id?: number;
    alias?: string;
    staffLanguage?: string;
    sort?: Sort | Sort[];
    status_in?: Status | Status[];
    genres?: string[] | null;
    tags?: string[] | null;
    page?: number;
    perPage?: number;
    search?: string;
    startDate_greater?: string;
    startDate_lesser?: string;
    slug?: string | null;
    category?: string | null;
  }
}
