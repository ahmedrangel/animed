import type { FetchError as F } from "ofetch";
import type { CacheEntry as C } from "nitropack";
import type { FieldsOption } from "gql-payload";
import type { Sort, Status } from "../../enums/anilist";
import type { User as U } from "#auth-utils";

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
    format?: string;
    status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
    episodes?: number;
    duration: number;
    genres: string[];
    isAdult: boolean;
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
    id_in?: number[];
    idMal_in?: number[];
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
    airingAt_greater?: number;
    airingAt_lesser?: number;
    extraFields?: FieldsOption;
    noFilter?: boolean;
    includeNSFW?: boolean;
  }

  interface StaffCharacters {
    edges: {
      characterRole: "MAIN" | "SUPPORTING" | "BACKGROUND";
      characters: {
        id: number;
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

  interface ScheduleInfo {
    id: number;
    airingAt: number;
    episode: number;
    media: Anime;
  }

  interface AiringSchedules {
    airingSchedules: ScheduleInfo[];
    pageInfo: PageInfo;
  }

  interface AnilistRequest {
    method?: "POST";
    headers?: HeadersInit;
    body?: GqlFetchBody;
    cacheKey?: string;
    swr?: boolean;
  }

  // TODO: Character profile types

  interface MyAnimeListWatchlist {
    node: {
      id: number;
      title: string;
    };
    list_status: {
      status: string;
      score: number;
      num_episodes_watched: number;
      updated_at: string;
      start_date: string;
      finish_date: string;
    };
  }

  interface Watchlist {
    userId: number | null;
    mediaId: number;
    mediaSlug: string;
    status: number;
    score: number | null;
    progress: number;
    startedDate: string | null;
    finishedDate: string | null;
    updatedAt: number;
  }

  type User = U;

  interface AccountConnection {
    id: number;
    provider: string;
    providerId: string;
    createdAt: number;
    updatedAt: number;
  }
}
