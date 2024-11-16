import type { FetchError as F } from "ofetch";
import type { CacheEntry as C } from "nitropack/runtime/types";
import type { Sort, Status } from "~~/enums/anilist";

export {};

declare global {
  type FetchError = F | undefined;
  type CacheEntry<T> = C<T> | undefined;

  interface AnimeTitle {
    romaji: string;
    english: string;
    native: string;
  }

  interface AnimeCoverImage {
    extraLarge?: string;
    large?: string;
  }

  interface DateOptions {
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
    age?: number;
    bloodType?: string | null;
    dateOfBirth?: DateOptions;
    dateOfDeath?: DateOptions;
    description?: string;
    gender?: string;
    homeTown?: string;
    image: StaffImageOptions;
    languageV2?: string;
    name: NameOptions;
    primaryOccupations?: string[];
    yearsActive?: number[];
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

  interface StaffImageOptions {
    large?: string;
    medium?: string;
  }

  interface AnimeRecommendations {
    nodes: {
      mediaRecommendation: Anime;
    }[];
  }

  interface AnimeExternalLinks {
    site: string;
    url?: string | null;
    icon: string | null;
    color: string;
  }

  interface Anime {
    id: number;
    idMal: number;
    title: AnimeTitle;
    coverImage: AnimeCoverImage;
    bannerImage: string | null;
    startDate: DateOptions;
    endDate: DateOptions;
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
    externalLinks: AnimeExternalLinks[];
    streamingEpisodes: AnimeEpisodes[];
    tags: {
      name: string;
    }[];
    characters: AnimeCharacters;
    recommendations: AnimeRecommendations | null;
    slug?: string;
  }

  interface AnimeThemes {
    openings: string[];
    endings: string[];
  }

  interface AnimeList {
    pageInfo: PageInfo;
    media: Anime[];
    title: string;
    slug: string | null;
  }

  type ListType = "new" | "top-rated" | "trending" | "upcoming" | "recommendations";

  interface AnimePreviewListInfo {
    media?: Anime[];
    title?: string;
    route?: string;
    type: ListType;
  }

  interface AnimePreviewList {
    preview: AnimePreviewListInfo[];
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
    withInfo?: boolean;
  }

  interface StaffCharacters {
    edges: {
      characterRole: "MAIN" | "SUPPORTING" | "BACKGROUND";
      characters: {
        image: StaffImageOptions;
        name: NameOptions;
      }[];
      node: Anime;
    }[];
    pageInfo: PageInfo;
  }

  interface AFlvRequest {
    success: boolean;
    data: {
      currentPage: number;
      hasNextPage: boolean;
      foundPages: number;
      media: {
        title: string;
        slug: string;
        url: string;
        type: string;
      }[];
    };
  }

  interface GqlFetchBody {
    query: string;
    variables?: Record<string, any>;
  }
}
