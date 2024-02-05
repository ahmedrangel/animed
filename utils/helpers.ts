import { format } from "date-fns";

export const getRating = (percent: number) => {
  const stars = (percent / 90) * 5;
  const fix = stars > 5 ? 5 : stars;
  return fix.toFixed(1);
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
    include: options?.include,
    sort: options?.sort,
    category: options?.category,
    in_category: options?.category ? true : null,
    limit: options?.limit === null ? undefined : (options?.limit !== undefined ? options.limit : 20),
    fields: {
      anime: options?.anime ? options.anime : "synopsis,slug,canonicalTitle,titles,coverImage,posterImage,averageRating,subtype,startDate,youtubeVideoId",
      categories: options?.fields_categories
    },
    filter: {
      streamers: options?.streamers === null ? undefined : "Hulu,Netflix,Crunchyroll,Funimation,HIDIVE",
      subtype: options?.subtype === null ? undefined : "tv,ova,ona",
      text: options?.query,
      slug: options?.slug,
      status: options?.status,
      categories: options?.categories,
    },
    page: {
      limit: options?.limit === null ? undefined : (options?.limit !== undefined ? options.limit : 20),
      offset: options?.offset
    },
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

export const formatDate = (date: string) => {
  return format(new Date(date), "MMM d, yyyy");
};