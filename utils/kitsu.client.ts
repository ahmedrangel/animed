export const KTS_BASE = "https://kitsu.io/api/edge";
export const KTS_headers = {
  "Accept": "application/vnd.api+json",
  "Authorization": "Bearer undefined"
};

export const getQuery = async(options?: Record<string, any>) => {
  const params = paramsBuilder({
    anime: "slug,canonicalTitle,titles,posterImage,averageRating,subtype,startDate",
    query: options?.query,
    offset: options?.offset,
    limit: options?.limit
  });
  const { data, meta } = await $fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  }).catch(() => null) as Record<string, any>;
  return { data, count: meta.count };
};

export const getNewlyReleased = async(options?: Record<string, any>) => {
  const params = paramsBuilder({
    sort: "-start_date",
    offset: String(options?.offset),
    categories: options?.categories,
    limit: options?.limit,
  });
  const { data, meta } = await $fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  }).catch(() => null) as Record<string, any>;
  return { data, count: meta?.count, title: "Newly Released" };
};

export const getPopular = async(options?: Record<string, any>) => {
  const params = paramsBuilder({
    offset: String(options?.offset),
    category: options?.category,
    limit: options?.limit,
  });
  const { data, meta } = await $fetch(`${KTS_BASE}/trending/anime?${params}`, {
    headers: KTS_headers
  }).catch(() => null) as Record<string, any>;
  return { data, count: meta?.count, title: "Trending" };
};

export const getTopRated = async(options?: Record<string, any>) => {
  const params = paramsBuilder({
    sort: "-averageRating",
    offset: String(options?.offset),
    categories: options?.categories,
    limit: options?.limit
  });
  const { data, meta } = await $fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  }).catch(() => null) as Record<string, any>;
  return { data, count: meta?.count, title: "Top Rated" };
};

export const getAnimeInfo = async(slug: string) => {
  const params = paramsBuilder({
    fields_categories: "slug,title",
    slug: slug,
    include: "categories,animeProductions.producer",
    limit: null,
    streamers: null,
    subtype: null,
    anime: null,
    categories: null,
  });
  const { data } = await $fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  }).catch(() => null) as Record<string, any>;
  return { data };
};

export const getCategories = async() => {
  const params = paramsBuilder({
    limit: String(40),
    sort: "-total_media_count",
    streamers: null,
    subtype: null
  });
  const { data, meta } = await $fetch(`${KTS_BASE}/categories?${params}`, {
    headers: KTS_headers
  }).catch(() => null) as Record<string, any>;
  return { data, count: meta?.count };
};

export const getCategoryId = async(slug: string) => {
  const params = `filter%5Bslug%5D=${slug}`;
  const { data } = await $fetch(`${KTS_BASE}/categories?${params}`, {
    headers: KTS_headers
  }).catch(() => null) as Record<string, any>;
  return data[0].id;
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