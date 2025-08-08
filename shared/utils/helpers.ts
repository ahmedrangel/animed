export const fixSlug = (name: string) => {
  return name.replace(/ /g, "-")?.normalize("NFD").replace(/[^a-zA-Z0-9-]/g, "")?.toLowerCase();
};

export const availablePageTypes: { name: ListType, routeType: string, title: string }[] = [
  { name: "new", routeType: "newly", title: "Newly Released" },
  { name: "top-rated", routeType: "rated", title: "Top Rated" },
  { name: "trending", routeType: "popular", title: "Trending" },
  { name: "upcoming", routeType: "upcoming", title: "Upcoming" }
];
