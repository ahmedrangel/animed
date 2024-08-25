import { gqlQuery } from "gql-payload";
import { Format, Licensor } from "~~/enums/anilist";

export const queryFilter = (options?: Record<string, any>) => {
  for (const key in options) {
    if (!options[key]) delete options[key];
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
          type: { type: "MediaType", value: "ANIME" },
          format_in: { type: "[MediaFormat]", value: [Format.TV, Format.OVA, Format.ONA, Format.TV_SHORT] },
          sort: { type: "[MediaSort]", value: options?.sort },
          status_in: { type: "[MediaStatus]", value: options?.status_in },
          search: options?.search,
          licensedById_in: { type: "[Int]", value: [Licensor.CRUNCHYROLL, Licensor.HULU, Licensor.NETFLIX, Licensor.HIDIVE, Licensor.AMAZON] },
          genre_in: { type: "[String]", value: options?.genres },
          tag_in: { type: "[String]", value: options?.tags },
          startDate_greater: { type: "FuzzyDateInt", value: options?.startDate_greater },
          startDate_lesser: { type: "FuzzyDateInt", value: options?.startDate_lesser }
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
          { nextAiringEpisode: ["airingAt"] }
        ]
      }]
  });
  return query;
};
