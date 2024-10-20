import { queryAnime, queryAnimeCharacters, queryAnimeSlug, queryAnimeEpisodes } from "./queries/anime";
import { queryExplore } from "./queries/explore";
import { queryFilter } from "./queries/filter";
import { queryStaff, queryStaffCharacters, queryStaffSlug } from "./queries/staff";
import { API, Sort, Status } from "~~/enums/anilist";

const callAnilistGQL = async (options: { method?: "GET" | "POST" | "OPTIONS", headers?: HeadersInit, body?: Record<string, any> }) => {
  const { method, headers, body } = options;
  return await $fetch(API.GRAPHQL, {
    method: method || "POST",
    headers: headers || { "Content-Type": "application/json", "Accept": "application/json" },
    body
  }).catch(() => null) as Record<string, any>;
};

export const getSearch = async (options?: QueryOptions | null) => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.SEARCH_MATCH })
  });
  data.type = "search";
  return { data: data.Page } as { data: AnimeList };
};

export const getNewlyReleased = async (options?: QueryOptions | null) => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] })
  });
  data.Page.title = "Newly Released";
  return { data: data.Page } as { data: AnimeList };
};

export const getPopular = async (options?: QueryOptions | null) => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: [Sort.TRENDING_DESC, Sort.POPULARITY_DESC] })
  });
  data.Page.title = "Trending";
  return { data: data.Page } as { data: AnimeList };
};

export const getTopRated = async (options?: QueryOptions | null) => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.SCORE_DESC })
  });
  data.Page.title = "Top Rated";
  return { data: data.Page } as { data: AnimeList };
};

export const getAnimeInfo = async (options?: QueryOptions) => {
  const { data } = await callAnilistGQL({
    body: queryAnime(options)
  });
  return data.Media as Anime;
};

export const getAnimeSlug = async (id: number) => {
  const { data } = await callAnilistGQL({
    body: queryAnimeSlug(id)
  });
  return data.Media;
};

export const getUpcoming = async (options?: QueryOptions | null) => {
  const todayYear = new Date().getFullYear();
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.START_DATE, status_in: [Status.NOT_YET_RELEASED], startDate_greater: `${todayYear}0000` })
  });
  data.Page.title = "Upcoming";
  return { data: data.Page } as { data: AnimeList };
};

export const getList = async (type: string, options?: QueryOptions) => {
  switch (type) {
    case "new":
      return await getNewlyReleased(options);
    case "trending":
      return await getPopular(options);
    case "top-rated":
      return await getTopRated(options);
    case "upcoming":
      return await getUpcoming(options);
    default:
      return await getSearch(options);
  }
};

export const getAnimeCharacters = async (options?: QueryOptions) => {
  const { data } = await callAnilistGQL({
    body: queryAnimeCharacters(options)
  });
  return data.Media;
};

export const getAnimeEpisodes = async (options?: QueryOptions) => {
  const { data } = await callAnilistGQL({
    body: queryAnimeEpisodes(options)
  });
  return data.Media;
};

export const getStaff = async (id: number) => {
  const { data } = await callAnilistGQL({
    body: queryStaff(id)
  });
  return { data };
};

export const getStaffCharacters = async (options?: QueryOptions) => {
  const { data } = await callAnilistGQL({
    body: queryStaffCharacters({ ...options })
  });
  return { data };
};

export const getStaffSlug = async (id: number) => {
  const { data } = await callAnilistGQL({
    body: queryStaffSlug(id)
  });
  return data;
};

export const getExplore = async (options?: QueryOptions | null) => {
  const { data } = await callAnilistGQL({
    body: queryExplore(options)
  });
  data.newly.title = "Newly Released";
  data.newly.route = `/c/new${options?.slug ? `/${options.slug}` : ""}`;
  data.trending.title = "Trending";
  data.trending.route = `/c/trending${options?.slug ? `/${options.slug}` : ""}`;
  data.top.title = "Top Rated";
  data.top.route = `/c/top-rated${options?.slug ? `/${options.slug}` : ""}`;
  return { preview: data, category: options?.category } as AnimePreviewList;
};
