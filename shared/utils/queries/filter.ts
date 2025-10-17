import { gqlQuery } from "gql-payload";
import { Format, Licensor } from "~~/enums/anilist";

export const queryFilter = (options?: QueryOptions) => {
  for (const key in options) {
    if (!options[key as keyof QueryOptions]) delete options[key as keyof QueryOptions];
  }
  const query = gqlQuery({
    operation: "Page",
    variables: {
      page: { type: "Int", value: options?.page || 1 },
      perPage: { type: "Int", value: options?.perPage || 20 }
    },
    fields: [
      { pageInfo: ["hasNextPage"] },
      { operation: "media",
        variables: {
          id_in: { type: "[Int]", value: options?.id_in },
          idMal_in: { type: "[Int]", value: options?.idMal_in },
          type: { type: "MediaType", value: "ANIME" },
          ...!options?.noFilter && { format_in: { type: "[MediaFormat]", value: [Format.TV, Format.OVA, Format.ONA, Format.TV_SHORT, Format.MOVIE] } },
          sort: { type: "[MediaSort]", value: options?.sort },
          status_in: { type: "[MediaStatus]", value: options?.status_in },
          search: options?.search,
          isLicensed: { type: "Boolean", value: true },
          ...!options?.noFilter && { licensedById_in: { type: "[Int]", value: [1, Licensor.CRUNCHYROLL, Licensor.HULU, Licensor.NETFLIX, Licensor.HIDIVE, Licensor.AMAZON, Licensor.BILIBILI, Licensor.X] } },
          genre_in: { type: "[String]", value: options?.genres },
          tag_in: { type: "[String]", value: options?.tags },
          startDate_greater: { type: "FuzzyDateInt", value: options?.startDate_greater },
          startDate_lesser: { type: "FuzzyDateInt", value: options?.startDate_lesser },
          ...!options?.includeNSFW && { isAdult: { type: "Boolean", value: false } }
        },
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
          { nextAiringEpisode: ["airingAt"] },
          ...(Array.isArray(options?.extraFields) ? options.extraFields : [])
        ]
      }]
  });
  return query;
};
