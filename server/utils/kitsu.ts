const KTS_BASE = "https://kitsu.io/api/edge";
const headers = {
  "Accept": "application/vnd.api+json",
  "Authorization": "Bearer undefined"
};

export const getPopular = async() => {
  const response = await fetch(`${KTS_BASE}/trending/anime?limit=20`, {
    headers: headers
  });
  const data = await response.json();
  return data;
};

export const getRecentlyAdded = async() => {
  const response = await fetch(`${KTS_BASE}/anime?filter%5Bstatus%5D=current&page%5Blimit%5D=16&sort=-created_at&filter%5Bstreamers%5D=Hulu%2CNetflix%2CCrunchyroll%2CFunimation%2CHIDIVE&filter%5Bsubtype%5D=tv`, {
    headers: headers
  });
  const data = await response.json();
  return data;
};

export const getTopRated = async() => {
  const response = await fetch(`${KTS_BASE}/anime?page%5Blimit%5D=16&sort=-averageRating&filter%5Bstreamers%5D=Hulu%2CNetflix%2CCrunchyroll%2CFunimation%2CHIDIVE&filter%5Bsubtype%5D=tv`, {
    headers: headers
  });
  const data = await response.json();
  return data;
};

export const getAnimeInfo = async(slug: string) => {
  const response = await fetch(`${KTS_BASE}/anime?fields%5Bcategories%5D=slug%2Ctitle&filter%5Bslug%5D=${slug}&include=categories%2CanimeProductions.producer`, {
    headers: headers
  });
  const data = await response.json();
  return data;
};