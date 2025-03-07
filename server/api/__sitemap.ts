export default defineEventHandler(() => {
  const routeRules = [] as Record<string, any>;
  const extraCategories = [{ name: "all" }];
  for (const c of [...extraCategories, ...categories]) {
    const slug = fixSlug(c.name);
    const rules = [`/c/${slug}`, `/c/${slug}/new`, `/c/${slug}/top-rated`, `/c/${slug}/trending`, `/c/${slug}/upcoming`];
    for (const r of rules) {
      routeRules.push({ loc: r, lastmod: new Date().toISOString() });
    }
  }
  return routeRules;
});
