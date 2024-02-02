const KTS_BASE = "https://kitsu.io/api/edge";
const headers = {
  "Accept": "application/vnd.api+json",
  "Authorization": "Bearer undefined"
};

export const getPopular = async() => {
  const response = await fetch(`${KTS_BASE}/trending/anime`, {
    headers: headers
  });
  const data = await response.json();
  return data;
};

export const getTopAiring = async() => {
  const response = await fetch(`${KTS_BASE}/anime?filter%5Bstatus%5D=current&page%5Blimit%5D=18&sort=-userCount&filter%5Bstreamers%5D=Hulu%2CNetflix%2CCrunchyroll%2CFunimation%2CHIDIVE&filter%5Bsubtype%5D=tv`, {
    headers: headers
  });
  const data = await response.json();
  return data;
};

export const getTopRated = async() => {
  const response = await fetch(`${KTS_BASE}/anime?page%5Blimit%5D=18&sort=-averageRating&filter%5Bstreamers%5D=Hulu%2CNetflix%2CCrunchyroll%2CFunimation%2CHIDIVE&filter%5Bsubtype%5D=tv`, {
    headers: headers
  });
  const data = await response.json();
  return data;
};