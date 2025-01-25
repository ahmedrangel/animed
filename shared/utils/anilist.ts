import { queryAnime, queryAnimeCharacters, queryAnimeEpisodes, queryAnimeSlug, queryFilter, querySchedules, queryStaff, queryStaffCharacters, queryStaffSlug } from "~/utils/queries";
import { API, Sort, Status } from "~~/enums/anilist";

const callAnilistGQL = async <T>(options: AnilistRequest): Promise<{ data: T }> => {
  const { method = "POST", headers, body, cacheKey, swr } = options;
  const storage = useIdbStorage("cache");
  const storageExpirations = useIdbStorage("expiration");
  const expiration = Date.now() + (43200 * 1000);

  const fetchData = async () => {
    const response = await $fetch<{ data: T }>(API.GRAPHQL, {
      method,
      headers: headers || { "Content-Type": "application/json", "Accept": "application/json", "Referer": SITE.url },
      body
    }).catch(() => null);
    return response?.data;
  };

  if (cacheKey) {
    const [cached, cachedExpiration] = await Promise.all([
      storage?.getItem<T>(cacheKey),
      storageExpirations?.getItem<string>(cacheKey)
    ]);
    if (cached && cachedExpiration && Number(cachedExpiration) > Date.now()) {
      if (swr) {
        void (async () => {
          const response = await fetchData();
          if (response && JSON.stringify(response) !== JSON.stringify(cached)) {
            await Promise.all([
              storage?.setItemRaw(cacheKey, response as unknown),
              storageExpirations?.setItemRaw(cacheKey, expiration)
            ]);
          }
        })();
      }
      return { data: cached };
    }
    await Promise.all([
      storage?.removeItem(cacheKey),
      storageExpirations?.removeItem(cacheKey)
    ]);
  }

  const response = await fetchData();
  if (response && cacheKey) {
    await Promise.all([
      storage?.setItemRaw(cacheKey, response as unknown),
      storageExpirations?.setItemRaw(cacheKey, expiration)
    ]);
  }
  return { data: response || {} as T };
};

export const getSearch = async (options?: QueryOptions): Promise<AnimeList> => {
  const { data } = await callAnilistGQL<{ Page: AnimeList }>({
    body: queryFilter({ ...options, sort: Sort.SEARCH_MATCH })
  });
  return data.Page;
};

export const getNewlyReleased = async (options?: QueryOptions, cacheKey?: string): Promise<AnimeList> => {
  const { data } = await callAnilistGQL<{ Page: AnimeList }>({
    body: queryFilter({ ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] }),
    cacheKey
  });
  return data.Page;
};

export const getPopular = async (options?: QueryOptions, cacheKey?: string): Promise< AnimeList> => {
  const { data } = await callAnilistGQL<{ Page: AnimeList }>({
    body: queryFilter({ ...options, sort: [Sort.TRENDING_DESC, Sort.POPULARITY_DESC] }),
    cacheKey
  });
  return data.Page;
};

export const getTopRated = async (options?: QueryOptions, cacheKey?: string): Promise<AnimeList> => {
  const { data } = await callAnilistGQL<{ Page: AnimeList }>({
    body: queryFilter({ ...options, sort: Sort.SCORE_DESC }),
    cacheKey
  });
  return data.Page;
};

export const getAnimeInfo = async (options?: QueryOptions): Promise<Anime> => {
  const { data } = await callAnilistGQL<{ Media: Anime }>({
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
  const { data } = await callAnilistGQL<{ Media: Anime }>({
    body: queryAnimeSlug(id)
  });
  return data.Media;
};

export const getUpcoming = async (options?: QueryOptions, cacheKey?: string): Promise<AnimeList> => {
  const todayYear = new Date().getFullYear();
  const { data } = await callAnilistGQL<{ Page: AnimeList }>({
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
  const { data } = await callAnilistGQL<{ Media: Anime }>({
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
  const { data } = await callAnilistGQL<{ Media: Anime }>({
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
  const { data } = await callAnilistGQL<{ Staff: StaffInfo }>({
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
  const { data } = await callAnilistGQL<{ Staff: { characterMedia: StaffCharacters } }>({
    body: queryStaffCharacters({ ...options })
  });
  return data.Staff.characterMedia;
};

export const getStaffSlug = async (id: number): Promise<string> => {
  const { data } = await callAnilistGQL<{ Staff: { name: { userPreferred: string } } }>({
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
    await Promise.all([
      useIdbStorage("cache")?.removeItem(cacheKey),
      useIdbStorage("expiration")?.removeItem(cacheKey)
    ]);
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
  const { data } = await callAnilistGQL<{ Page: AiringSchedules }>({
    body: querySchedules(options),
    cacheKey: cacheKey,
    swr: true
  });
  return data.Page;
};
