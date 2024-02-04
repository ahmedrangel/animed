export const KTS_BASE = "https://kitsu.io/api/edge";
export const KTS_headers = {
  "Accept": "application/vnd.api+json",
  "Authorization": "Bearer undefined"
};

export const getQuery = async(query: string, offset: number) => {
  const params = paramsBuilder({
    anime: "slug,canonicalTitle,titles,posterImage,averageRating,subtype,startDate",
    query,
    offset: String(offset)
  });
  const response = await fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  });
  const { data, meta } = await response.json();
  return { data, count: meta.count };
};

export const getNewlyReleased = async(options?: Record<string, any>) => {
  const params = paramsBuilder({
    anime: "synopsis,slug,canonicalTitle,titles,coverImage,posterImage,averageRating,subtype,startDate",
    sort: "-start_date",
    offset: String(options?.offset)
  });
  const response = await fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  });
  const { data, meta } = await response.json();
  return { data, count: meta?.count };
};

export const getPopular = async(options?: Record<string, any>) => {
  const params = paramsBuilder({ offset: String(options?.offset) });
  const response = await fetch(`${KTS_BASE}/trending/anime?${params}`, {
    headers: KTS_headers
  });
  const { data, meta } = await response.json();
  return { data, count: meta?.count };
};

export const getTopRated = async(options?: Record<string, any>) => {
  const params = paramsBuilder({ sort: "-averageRating", offset: String(options?.offset) });
  const response = await fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  });
  const { data, meta } = await response.json();
  return { data, count: meta?.count };
};

export const getAnimeInfo = async(slug: string) => {
  const params = paramsBuilder({
    categories: "slug,title",
    slug: slug,
    include: "categories,animeProductions.producer",
    limit: null,
    streamers: null,
    subtype: null
  });
  const response = await fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  });
  const { data, meta } = await response.json();
  return { data, count: meta?.count };
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
};