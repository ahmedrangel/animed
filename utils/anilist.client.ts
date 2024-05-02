import { queryAnime, queryAnimeCharacters, queryAnimeSlug, queryAnimeEpisodes } from "./queries/anime";
import { queryFilter } from "./queries/filter";
import { API, Sort, Status } from "../enums/anilist";

export const getQuery = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: Sort.SEARCH_MATCH })
  }).catch((e) => console.info(e)) as Record<string, any>;
  data.type = "search";
  return { data: data.Page };
};

export const getNewlyReleased = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] })
  }).catch((e) => console.info(e)) as Record<string, any>;
  data.Page.title = "Newly Released";
  return { data: data.Page };
};

export const getPopular = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: [Sort.TRENDING_DESC, Sort.POPULARITY_DESC] })
  }).catch((e) => console.info(e)) as Record<string, any>;
  data.Page.title = "Trending";
  return { data: data.Page };
};

export const getTopRated = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryFilter({ ...options, sort: Sort.SCORE_DESC })
  }).catch((e) => console.info(e)) as Record<string, any>;
  data.Page.title = "Top Rated";
  return { data: data.Page };
};

export const getAnimeInfo = async(options?: Record<string, any>) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryAnime(options)
  }).catch((e) => console.info(e)) as Record<string, any>;
  return { data };
};

export const getAnimeSlug = async(id: number) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryAnimeSlug(id)
  }).catch((e) => console.info(e)) as Record<string, any>;
  return data;
};

export const getList = async(type: string, options?: Record<string, any>) => {
  if (type === "new") {
    return await getNewlyReleased(options);
  } else if (type === "trending") {
    return await getPopular(options);
  } else if (type === "top-rated") {
    return await getTopRated(options);
  }
  return await getQuery(options);
};

export const getAnimeCharacters = async(options?: Record<string, any>) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryAnimeCharacters(options)
  }).catch((e) => console.info(e)) as Record<string, any>;
  return { data };
};

export const getAnimeEpisodes = async(options?: Record<string, any>) => {
  const { data } = await $fetch(API.GRAPHQL, {
    method: "POST",
    body: queryAnimeEpisodes(options)
  }).catch((e) => console.info(e)) as Record<string, any>;
  return { data };
};