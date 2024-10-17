export default defineCachedEventHandler(async (event) => {
  const { slug } = getQuery(event) as { slug?: string };
  const cat_title = categories.find(c => fixSlug(c.name) === slug)?.name;
  const cat_type = categories.find(c => fixSlug(c.name) === slug)?.type || null;
  const option = slug ? cat_type === "genre" ? { genres: cat_title ? [cat_title] : null } : { tags: cat_title ? [cat_title] : null } : null;
  const { data } = await getUpcoming(option);
  data.type = "upcoming";
  data.category = cat_title || null;
  data.slug = slug || null;

  const response = data;

  if (response) return response;
}, { maxAge: !import.meta.dev ? 43200 : 1 }); // 12h cache
