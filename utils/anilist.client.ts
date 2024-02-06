import { queryAnime } from "./queries/anime";
import { queryFilter } from "./queries/filter";
import { API, Sort, Status } from "../enums/anilist";

export const getQuery = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: Sort.SEARCH_MATCH })
  }).catch(() => null) as Record<string, any>;
  data.type = "search";
  return { data: data.Page };
};

export const getNewlyReleased = async(options?: Record<string, any> | null) => {
  console.log(queryFilter({ ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] }));
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] })
  }).catch(() => null) as Record<string, any>;
  data.Page.title = "Newly Released";
  return { data: data.Page };
};

export const getPopular = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: [Sort.TRENDING_DESC, Sort.POPULARITY_DESC] })
  }).catch(() => null) as Record<string, any>;
  data.Page.title = "Trending";
  return { data: data.Page };
};

export const getTopRated = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: Sort.SCORE_DESC })
  }).catch(() => null) as Record<string, any>;
  data.Page.title = "Top Rated";
  return { data: data.Page };
};

export const getAnimeInfo = async(id: number) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryAnime({ id })
  }).catch(() => null) as Record<string, any>;
  return { data };
};

export const getList = async(type: string, options?: Record<string, any>) => {
  if (type === "new") {
    return await getNewlyReleased(options);
  }
  else if (type === "trending") {
    return await getPopular(options);
  }
  else if (type === "top-rated") {
    return await getTopRated(options);
  }
  return await getQuery(options);
};