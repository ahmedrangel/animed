import { queryAnime, queryAnimeCharacters, queryAnimeSlug, queryAnimeEpisodes } from "./queries/anime";
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
  const { errors } = response || {};
  if (errors?.length) {
    const error = errors.map((el) => {
      return { status: el.status, message: el.message };
    });
    throw createError({ statusMessage: JSON.stringify(error) });
  }
  return response;
};

export const getSearch = async (options?: QueryOptions | null): Promise<AnimeList> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.SEARCH_MATCH })
  });
  data.Page.type = "search";
  return data.Page;
};

export const getNewlyReleased = async (options?: QueryOptions | null): Promise<AnimeList> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] })
  });
  return data.Page;
};

export const getPopular = async (options?: QueryOptions | null): Promise< AnimeList> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: [Sort.TRENDING_DESC, Sort.POPULARITY_DESC] })
  });
  return data.Page;
};

export const getTopRated = async (options?: QueryOptions | null): Promise<AnimeList> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.SCORE_DESC })
  });
  return data.Page;
};

export const getAnimeInfo = async (options?: QueryOptions): Promise<Anime> => {
  const { data } = await callAnilistGQL({
    body: queryAnime(options)
  });
  const response = data.Media as Anime;
  const slug = fixSlug(response?.title?.romaji);
  response.slug = slug;

  if (options?.slug && options.slug.toLowerCase() !== slug) {
    throw createError({
      statusCode: 404,
      message: `Anime not found: '${slug}'`,
      fatal: true
    });
  }

  return response;
};

export const getAnimeSlug = async (id: number): Promise<Anime> => {
  const { data } = await callAnilistGQL({
    body: queryAnimeSlug(id)
  });
  return data.Media;
};

export const getUpcoming = async (options?: QueryOptions | null): Promise<AnimeList> => {
  const todayYear = new Date().getFullYear();
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.START_DATE, status_in: [Status.NOT_YET_RELEASED], startDate_greater: `${todayYear}0000` })
  });
  return data.Page;
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

  const response = data.Media as Anime;
  const slug = fixSlug(response?.title?.romaji);

  if (options?.slug && options.slug.toLowerCase() !== slug) {
    throw createError({
      statusCode: 404,
      message: `Anime not found: '${slug}'`,
      fatal: true
    });
  }
  return response;
};

export const getAnimeEpisodes = async (options?: QueryOptions): Promise<Anime> => {
  const { data } = await callAnilistGQL({
    body: queryAnimeEpisodes(options)
  });

  const response = data.Media as Anime;

  if (!response?.streamingEpisodes?.length) {
    throw createError({
      statusCode: 404,
      message: `Episodes for ${options?.slug} not found.`,
      fatal: true
    });
  }

  const slug = fixSlug(response?.title?.romaji);

  if (options?.slug && options.slug.toLowerCase() !== slug) {
    throw createError({
      statusCode: 404,
      message: `Anime not found: '${slug}'`,
      fatal: true
    });
  }

  return response;
};

export const getStaff = async (options: { id: number, slug: string }): Promise<StaffInfo> => {
  const { data } = await callAnilistGQL({
    body: queryStaff(options)
  });
  const response = data.Staff as StaffInfo;

  const _slug = fixSlug(response?.name?.userPreferred);
  if (options?.slug && options.slug.toLowerCase() !== _slug) {
    throw createError({
      statusCode: 404,
      message: `People not found: '${options.slug}'`,
      fatal: true
    });
  }

  return response;
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

export const getPreviewList = async (type: ListType, options: QueryOptions = {}): Promise<AnimePreviewListInfo> => {
  const list = await getList(type, options);
  const { slug } = options;
  return {
    ...list,
    title: availablePageTypes.find(el => el.name === type)?.title,
    type,
    route: `/c/${slug ? slug : "all"}/${type}`
  };
};
