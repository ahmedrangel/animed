export const getRating = (percent: number) => {
  const stars = (percent / 100) * 5;
  return stars.toFixed(1);
};

export const formatRating = (rating: number) => {
  if (rating >= 1000000) {
    return (rating / 1000000).toFixed(2) + "m";
  }
  else if (rating >= 1000) {
    return (rating / 1000).toFixed(1) + "k";
  }
  return rating.toString();
};

export const onScreen = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth);
};

export const paramsBuilder = (options?: Record<string, string | null>) => {
  const params: Record<string, any> = {
    fields: {
      anime: options?.anime,
      categories: options?.categories,
    },
    filter: {
      streamers: options?.streamers === null ? undefined : "Hulu,Netflix,Crunchyroll,Funimation,HIDIVE",
      subtype: options?.subtype === null ? undefined : "tv",
      text: options?.query,
      slug: options?.slug,
      status: options?.status
    },
    page: {
      limit: options?.limit === null ? undefined : 20,
      offset: options?.offset
    },
    include: options?.include,
    sort: options?.sort,
  };

  return Object.keys(params)
    .map(key => {
      if (params[key]) {
        if (typeof params[key] === "object") {
          return Object.keys(params[key])
            .map(subkey => {
              if (params[key][subkey]) {
                return `${key}${encodeURIComponent(`[${subkey}]`)}=${encodeURIComponent(params[key][subkey])}`;
              }
              return "";
            })
            .filter(Boolean) // Elimina elementos vacíos
            .join("&");
        }
        return `${key}=${encodeURIComponent(params[key])}`;
      }
      return "";
    })
    .filter(Boolean) // Elimina elementos vacíos
    .join("&");
};