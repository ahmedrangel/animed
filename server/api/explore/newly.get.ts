export default defineCachedEventHandler(async (event) => {
  const { slug } = getQuery(event);
  const cat_title = categories.find(c => fixSlug(c.name) === slug)?.name || null;
  const cat_type = categories.find(c => fixSlug(c.name) === slug)?.type || null;
  const option = slug ? cat_type === "genre" ? { genres: [cat_title] } : { tags: [cat_title] } : null;
  const { data } = await getNewlyReleased(option) as Record<string, any>;
  data.type = "new";
  data.category = cat_title || null;
  data.slug = slug || null;

  const response = data;

  if (response) return response;
}, { maxAge: !import.meta.dev ? 43200 : 0 }); // 12h cache
