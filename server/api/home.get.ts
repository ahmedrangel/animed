export default defineEventHandler(async () => {
  const popular = (await getPopular()).data;
  const rated = (await getTopRated()).data;
  const newly = (await getNewlyReleased()).data;
  return [
    { title: "Trending", data: popular, },
    { title: "Newly Released", data: newly },
    { title: "Top Rated", data: rated, }
  ];
});