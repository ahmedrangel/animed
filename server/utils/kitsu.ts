export const getPopular = async() => {
  const params = paramsBuilder();
  const response = await fetch(`${KTS_BASE}/trending/anime?${params}`, {
    headers: KTS_headers
  });
  const data = await response.json();
  return data;
};

export const getNewlyReleased = async() => {
  const params = paramsBuilder({ status: "current", sort: "-start_date" });
  const response = await fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  });
  const data = await response.json();
  return data;
};

export const getTopRated = async() => {
  const params = paramsBuilder({ sort: "-averageRating" });
  const response = await fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  });
  const data = await response.json();
  return data;
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
  const data = await response.json();
  return data;
};