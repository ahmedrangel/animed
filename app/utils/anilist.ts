import { queryAnime, queryAnimeCharacters, queryAnimeSlug, queryAnimeEpisodes } from "./queries/anime";
import { queryExplore } from "./queries/explore";
import { queryFilter } from "./queries/filter";
import { queryStaff, queryStaffCharacters, queryStaffSlug } from "./queries/staff";
import { API, Sort, Status } from "~~/enums/anilist";

const callAnilistGQL = async (options: { method?: "GET" | "POST" | "OPTIONS", headers?: HeadersInit, body?: { variables: any, query: string } }) => {
  const { method, headers, body } = options;
  const response = await $fetch(API.GRAPHQL, {
    method: method || "POST",
    headers: headers || { "Content-Type": "application/json", "Accept": "application/json", "Referer": SITE.url },
    body
  }).catch(e => e.data) as { data: Record<string, any>, errors: { message: string, status: number }[] };
  const { errors } = response;
  if (errors?.length) {
    const error = errors.map((el) => {
      return { status: el.status, message: el.message };
    });
    throw createError({ statusMessage: JSON.stringify(error) });
  }
  return response;
};

export const getSearch = async (options?: QueryOptions | null): Promise<{ data: AnimeList }> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.SEARCH_MATCH })
  });
  data.type = "search";
  return { data: data.Page };
};

export const getNewlyReleased = async (options?: QueryOptions | null): Promise<{ data: AnimeList }> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] })
  });
  data.Page.title = "Newly Released";
  return { data: data.Page };
};

export const getPopular = async (options?: QueryOptions | null): Promise<{ data: AnimeList }> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: [Sort.TRENDING_DESC, Sort.POPULARITY_DESC] })
  });
  data.Page.title = "Trending";
  return { data: data.Page };
};

export const getTopRated = async (options?: QueryOptions | null): Promise<{ data: AnimeList }> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.SCORE_DESC })
  });
  data.Page.title = "Top Rated";
  return { data: data.Page };
};

export const getAnimeInfo = async (options?: QueryOptions) => {
  const { data } = await callAnilistGQL({
    body: queryAnime(options)
  });
  return data.Media as Anime;
};

export const getAnimeSlug = async (id: number): Promise<Anime> => {
  const { data } = await callAnilistGQL({
    body: queryAnimeSlug(id)
  });
  return data.Media;
};

export const getUpcoming = async (options?: QueryOptions | null): Promise<{ data: AnimeList }> => {
  const todayYear = new Date().getFullYear();
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.START_DATE, status_in: [Status.NOT_YET_RELEASED], startDate_greater: `${todayYear}0000` })
  });
  data.Page.title = "Upcoming";
  return { data: data.Page };
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

export const getAnimeCharacters = async (options?: QueryOptions): Promise<Anime> => {
  const { data } = await callAnilistGQL({
    body: queryAnimeCharacters(options)
  });
  return data.Media;
};

export const getAnimeEpisodes = async (options?: QueryOptions): Promise<Anime> => {
  const { data } = await callAnilistGQL({
    body: queryAnimeEpisodes(options)
  });
  return data.Media;
};

export const getStaff = async (id: number): Promise<StaffInfo> => {
  const { data } = await callAnilistGQL({
    body: queryStaff(id)
  });
  return data.Staff;
};

export const getStaffCharacters = async (options?: QueryOptions): Promise<StaffCharacters> => {
  const { data } = await callAnilistGQL({
    body: queryStaffCharacters({ ...options })
  });
  return data.Staff.characterMedia;
};

export const getStaffSlug = async (id: number): Promise<string> => {
  const { data } = await callAnilistGQL({
    body: queryStaffSlug(id)
  });
  return data.Staff.name.userPreferred;
};

export const getExplore = async (options?: QueryOptions | null): Promise<AnimePreviewList> => {
  const { data } = await callAnilistGQL({
    body: queryExplore(options)
  });
  data.newly.title = "Newly Released";
  data.newly.route = `/c/${options?.slug ? options.slug : "all"}/new`;
  data.trending.title = "Trending";
  data.trending.route = `/c/${options?.slug ? options.slug : "all"}/trending`;
  data.top.title = "Top Rated";
  data.top.route = `/c/${options?.slug ? options.slug : "all"}/top-rated`;
  return { preview: data, category: options?.category };
};
