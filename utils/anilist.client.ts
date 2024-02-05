import { queryAnime } from "./queries/anime";
import { queryFilter } from "./queries/filter";

export const ANI_BASE = "https://graphql.anilist.co";

export const getQuery = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(ANI_BASE, {
    method: "POST",
    body: JSON.stringify(queryFilter({ ...options, sort: "SEARCH_MATCH" }))
  }).catch(() => null) as Record<string, any>;
  data.type = "search";
  return { data: data.Page };
};

export const getNewlyReleased = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(ANI_BASE, {
    method: "POST",
    body: JSON.stringify(queryFilter({ ...options, sort: "START_DATE_DESC", status_in: ["RELEASING", "FINISHED"] }))
  }).catch(() => null) as Record<string, any>;
  data.Page.title = "Newly Released";
  return { data: data.Page };
};

export const getPopular = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(ANI_BASE, {
    method: "POST",
    body: JSON.stringify(queryFilter({ ...options, sort: "POPULARITY_DESC" }))
  }).catch(() => null) as Record<string, any>;
  data.Page.title = "Trending";
  return { data: data.Page };
};

export const getTopRated = async(options?: Record<string, any> | null) => {
  const { data } = await $fetch(ANI_BASE, {
    method: "POST",
    body: JSON.stringify(queryFilter({ ...options, sort: "SCORE_DESC" }))
  }).catch(() => null) as Record<string, any>;
  data.Page.title = "Top Rated";
  return { data: data.Page };
};

export const getAnimeInfo = async(id: number) => {
  const { data } = await $fetch(ANI_BASE, {
    method: "POST",
    body: JSON.stringify(queryAnime({ id }))
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