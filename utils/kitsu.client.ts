const KTS_BASE = "https://kitsu.io/api/edge";
const headers = {
  "Accept": "application/vnd.api+json",
  "Authorization": "Bearer undefined"
};

export const getQuery = async(query: string) => {
  const response = await fetch(`${KTS_BASE}/anime?fields%5Banime%5D=slug%2CcanonicalTitle%2Ctitles%2CposterImage%2CaverageRating&filter%5Btext%5D=${query}&filter%5Bsubtype%5D=tv&filter%5Bstreamers%5D=Hulu%2CFunimation%2CCrunchyroll%2CNetflix%2CHIDIVE&page%5Blimit%5D=20`, {
    headers: headers
  });
  const { data } = await response.json();
  return data;
};