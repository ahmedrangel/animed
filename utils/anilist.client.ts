import { API, Sort, Status } from "../enums/anilist";
import { queryAnime, queryAnimeCharacters, queryAnimeSlug, queryAnimeEpisodes } from "./queries/anime";
import { queryFilter } from "./queries/filter";
import { queryStaff, queryStaffSlug } from "./queries/staff";
import { queryExplore } from "./queries/explore";

export const getQuery = async (options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: Sort.SEARCH_MATCH })
  }).catch(e => console.info(e)) as Record<string, any>;
  data.type = "search";
  return { data: data.Page };
};

export const getNewlyReleased = async (options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] })
  }).catch(e => console.info(e)) as Record<string, any>;
  data.Page.title = "Newly Released";
  return { data: data.Page };
};

export const getPopular = async (options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: [Sort.TRENDING_DESC, Sort.POPULARITY_DESC] })
  }).catch(e => console.info(e)) as Record<string, any>;
  data.Page.title = "Trending";
  return { data: data.Page };
};

export const getTopRated = async (options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: Sort.SCORE_DESC })
  }).catch(e => console.info(e)) as Record<string, any>;
  data.Page.title = "Top Rated";
  return { data: data.Page };
};

export const getAnimeInfo = async (options?: Record<string, any>) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryAnime(options)
  }).catch(e => console.info(e)) as Record<string, any>;
  return { data };
};

export const getAnimeSlug = async (id: number) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryAnimeSlug(id)
  }).catch(e => console.info(e)) as Record<string, any>;
  return data;
};

export const getUpcoming = async (options?: Record<string, any> | null) => {
  const todayYear = new Date().getFullYear();
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: Sort.START_DATE, status_in: [Status.NOT_YET_RELEASED], startDate_greater: `${todayYear}0000` })
  }).catch(e => console.info(e)) as Record<string, any>;
  data.Page.title = "Upcoming";
  data.Page.route = `/c/upcoming${options?.slug ? `/${options.slug}` : ""}`;
  return { data: data.Page };
};

export const getList = async (type: string, options?: Record<string, any>) => {
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
      return await getQuery(options);
  }
};

export const getAnimeCharacters = async (options?: Record<string, any>) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryAnimeCharacters(options)
  }).catch(e => console.info(e)) as Record<string, any>;
  return { data };
};

export const getAnimeEpisodes = async (options?: Record<string, any>) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryAnimeEpisodes(options)
  }).catch(e => console.info(e)) as Record<string, any>;
  return { data };
};

export const getStaff = async (options?: Record<string, any>) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryStaff({ ...options })
  }).catch(e => console.info(e)) as Record<string, any>;
  return { data };
};

export const getStaffSlug = async (id: number) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryStaffSlug(id)
  }).catch(e => console.info(e)) as Record<string, any>;
  return data;
};

export const getExplore = async (options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryExplore(options)
  }).catch(e => console.info(e)) as Record<string, any>;
  data.newly.title = "Newly Released";
  data.newly.route = `/c/new${options?.slug ? `/${options.slug}` : ""}`;
  data.trending.title = "Trending";
  data.trending.route = `/c/trending${options?.slug ? `/${options.slug}` : ""}`;
  data.top.title = "Top Rated";
  data.top.route = `/c/top-rated${options?.slug ? `/${options.slug}` : ""}`;
  return { preview: data, category: options?.category };
};
