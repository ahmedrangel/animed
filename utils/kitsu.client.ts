export const KTS_BASE = "https://kitsu.io/api/edge";
export const KTS_headers = {
  "Accept": "application/vnd.api+json",
  "Authorization": "Bearer undefined"
};

export const getQuery = async(query: string, offset: number) => {
  const params = paramsBuilder({
    anime: "slug,canonicalTitle,titles,posterImage,averageRating",
    query,
    offset: String(offset)
  });
  const response = await fetch(`${KTS_BASE}/anime?${params}`, {
    headers: KTS_headers
  });
  const { data, meta } = await response.json();
  return { data, count: meta.count };
};