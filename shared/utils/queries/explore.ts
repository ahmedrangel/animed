import { type GqlPayloadOptions, gqlQuery } from "gql-payload";
import { Format, Licensor, Sort, Status } from "~~/enums/anilist";

export const queryExplore = (options?: QueryOptions) => {
  for (const key in options) {
    if (!options[key as keyof QueryOptions]) delete options[key as keyof QueryOptions];
  }
  const sharedQuery = (alias: string, options?: QueryOptions): GqlPayloadOptions => ({
    operation: `${alias}: Page`,
    variables: {
      [`${alias}_page`]: { name: "page", type: "Int", value: options?.page || 1 },
      [`${alias}_perPage`]: { name: "perPage", type: "Int", value: options?.perPage || 20 }
    },
    fields: [
      { pageInfo: ["hasNextPage"] },
      { operation: "media",
        variables: {
          [`${alias}_id_in`]: { name: "id_in", type: "[Int]", value: options?.id_in },
          [`${alias}_idMal_in`]: { name: "idMal_in", type: "[Int]", value: options?.idMal_in },
          [`${alias}_type`]: { name: "type", type: "MediaType", value: "ANIME" },
          ...!options?.noFilter && { [`${alias}_format_in`]: { name: "format_in", type: "[MediaFormat]", value: [Format.TV, Format.OVA, Format.ONA, Format.TV_SHORT, Format.MOVIE] } },
          [`${alias}_sort`]: { name: "sort", type: "[MediaSort]", value: options?.sort },
          [`${alias}_status_in`]: { name: "status_in", type: "[MediaStatus]", value: options?.status_in },
          [`${alias}_search`]: { name: "search", type: "String", value: options?.search },
          [`${alias}_isLicensed`]: { name: "isLicensed", type: "Boolean", value: true },
          ...!options?.noFilter && { [`${alias}_licensedById_in`]: { name: "licensedById_in", type: "[Int]", value: [1, Licensor.CRUNCHYROLL, Licensor.HULU, Licensor.NETFLIX, Licensor.HIDIVE, Licensor.AMAZON, Licensor.BILIBILI, Licensor.X] } },
          [`${alias}_genre_in`]: { name: "genre_in", type: "[String]", value: options?.genres },
          [`${alias}_tag_in`]: { name: "tag_in", type: "[String]", value: options?.tags },
          [`${alias}_startDate_greater`]: { name: "startDate_greater", type: "FuzzyDateInt", value: options?.startDate_greater },
          [`${alias}_startDate_lesser`]: { name: "startDate_lesser", type: "FuzzyDateInt", value: options?.startDate_lesser },
          ...!options?.includeNSFW && { [`${alias}_isAdult`]: { name: "isAdult", type: "Boolean", value: false } }
        },
        fields: [
          { operation: "mediaFields",
            namedFragment: true
          }
        ]
      }]
  });

  const todayYear = new Date().getFullYear();
  const queryNewly = sharedQuery("newly", { ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] });
  const queryPopular = sharedQuery("trending", { ...options, sort: [Sort.TRENDING_DESC, Sort.POPULARITY_DESC] });
  const queryTopRated = sharedQuery("topRated", { ...options, sort: Sort.SCORE_DESC });
  const queryUpcoming = sharedQuery("upcoming", { ...options, sort: [Sort.START_DATE, Sort.TRENDING_DESC], status_in: [Status.NOT_YET_RELEASED], startDate_greater: `${todayYear}0000` });

  return gqlQuery([queryNewly, queryPopular, queryTopRated, queryUpcoming], {
    fragments: [{
      name: "mediaFields",
      on: "Media",
      fields: [
        "id",
        { title: ["romaji", "english"] },
        { coverImage: ["extraLarge"] },
        "bannerImage",
        { startDate: ["year", "month", "day"] },
        "description",
        "format",
        "status",
        "averageScore",
        { trailer: ["id", "site"] },
        { nextAiringEpisode: ["airingAt"] }
      ]
    }]
  });
};
