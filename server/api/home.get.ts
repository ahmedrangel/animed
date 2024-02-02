export default defineEventHandler(async () => {
  const popular = (await getPopular()).data;
  const rated = (await getTopRated()).data;
  const recent = (await getRecentlyAdded()).data;
  return [
    { title: "Trending", data: popular, },
    { title: "Recently Added", data: recent },
    { title: "Top Rated", data: rated, }
  ];
});