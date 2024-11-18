import { queryAnime, queryAnimeCharacters, queryAnimeEpisodes, queryAnimeSlug, queryFilter, querySchedules, queryStaff, queryStaffCharacters, queryStaffSlug } from "~/utils/queries";
import { API, Sort, Status } from "~~/enums/anilist";

const callAnilistGQL = async (options: AnilistRequest): Promise<{ data: Record<string, any> }> => {
  const { method, headers, body, cacheKey, swr } = options;
  const storage = useIdbStorage("cache");
  const storageExpirations = useIdbStorage("expiration");

  const fetchData = async () => {
    const response = await $fetch<{ data: Record<string, any> }>(API.GRAPHQL, {
      method: method || "POST",
      headers: headers || { "Content-Type": "application/json", "Accept": "application/json", "Referer": SITE.url },
      body
    }).catch(() => null);
    return response?.data;
  };

  const cached = cacheKey ? await storage?.getItem<Record<string, any>>(cacheKey) : null;
  const cachedExpiration = cacheKey ? await storageExpirations?.getItem<string>(cacheKey) : null;
  if (cached && cacheKey) {
    if (cachedExpiration && Number(cachedExpiration) > Date.now()) {
      if (swr) {
        void (async () => {
          const response = await fetchData();
          if (response && JSON.stringify(response) !== JSON.stringify(cached)) {
            await storage?.setItem(cacheKey, response);
            await storageExpirations?.setItem(cacheKey, Date.now() + (43200 * 1000));
          }
        })();
      }
      return { data: cached };
    }
    else {
      await storage?.removeItem(cacheKey);
      await storageExpirations?.removeItem(cacheKey);
    }
  }

  const response = await fetchData();
  if (response && cacheKey) {
    await storage?.setItem(cacheKey, response.data);
    await storageExpirations?.setItem(cacheKey, Date.now() + (43200 * 1000));
  }
  return { data: response || {} };
};

export const getSearch = async (options?: QueryOptions): Promise<AnimeList> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.SEARCH_MATCH })
  });
  data.Page.type = "search";
  return data.Page;
};

export const getNewlyReleased = async (options?: QueryOptions, cacheKey?: string): Promise<AnimeList> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] }),
    cacheKey
  });
  return data.Page;
};

export const getPopular = async (options?: QueryOptions, cacheKey?: string): Promise< AnimeList> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: [Sort.TRENDING_DESC, Sort.POPULARITY_DESC] }),
    cacheKey
  });
  return data.Page;
};

export const getTopRated = async (options?: QueryOptions, cacheKey?: string): Promise<AnimeList> => {
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.SCORE_DESC }),
    cacheKey
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

export const getUpcoming = async (options?: QueryOptions, cacheKey?: string): Promise<AnimeList> => {
  const todayYear = new Date().getFullYear();
  const { data } = await callAnilistGQL({
    body: queryFilter({ ...options, sort: Sort.START_DATE, status_in: [Status.NOT_YET_RELEASED], startDate_greater: `${todayYear}0000` }),
    cacheKey
  });
  return data.Page;
};

export const getList = async (type: string, options?: QueryOptions, cacheKey?: string) => {
  switch (type) {
    case "new":
      return await getNewlyReleased(options, cacheKey);
    case "trending":
      return await getPopular(options, cacheKey);
    case "top-rated":
      return await getTopRated(options, cacheKey);
    case "upcoming":
      return await getUpcoming(options, cacheKey);
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
  const { slug } = options;
  const _slug = slug ? slug : "all";
  const cacheKey = `preview:${type}:${_slug}`;
  let list = await getList(type, options, cacheKey);

  if (!list.media?.length) {
    await useIdbStorage("cache")?.removeItem(cacheKey);
    await useIdbStorage("expiration")?.removeItem(cacheKey);
    list = await getList(type, options, cacheKey);
  }

  return {
    ...list,
    title: availablePageTypes.find(el => el.name === type)?.title,
    type,
    route: `/c/${_slug}/${type}`
  };
};

export const getSchedules = async (options: QueryOptions = {}): Promise<AiringSchedules> => {
  const { page } = options;
  const cacheKey = `schedule:${page}`;
  const { data } = await callAnilistGQL({
    body: querySchedules(options),
    cacheKey: cacheKey,
    swr: true
  });
  return data.Page;
};
