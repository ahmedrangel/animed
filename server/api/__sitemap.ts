export default defineEventHandler(() => {
  const routeRules = [] as Record<string, any>;
  for (const c of categories) {
    const slug = fixSlug(c.name);
    const rules = [`/c/${slug}`, `/c/new/${slug}`, `/c/top-rated/${slug}`, `/c/trending/${slug}`, `/c/upcoming/${slug}`];
    for (const r of rules) {
      routeRules.push({ loc: r, lastmod: new Date().toISOString() });
    }
  }
  return routeRules;
});
