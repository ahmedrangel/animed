import { Format, Licensor } from "../../enums/anilist";
import * as gql from "gql-query-builder";

export const queryFilter = (options?: Record<string, any>) => {
  const query = gql.query({
    operation: "Page",
    variables: {
      page: { type: "Int", value: options?.page || 1 },
      perPage: { type: "Int", value: 20 }
    },
    fields: [
      { pageInfo: ["total", "perPage", "currentPage", "lastPage", "hasNextPage"] },
      {
        operation: "media",
        variables: {
          type: { type: "MediaType", value: "ANIME" },
          format_in: { type: "[MediaFormat]", value: [Format.TV, Format.OVA, Format.ONA] },
          sort: { type: "[MediaSort]", value: options?.sort },
          status_in: { type: "[MediaStatus]", value: options?.status_in },
          search: options?.search,
          licensedById_in: { type: "[Int]", value: [Licensor.CRUNCHYROLL, Licensor.HULU, Licensor.NETFLIX, Licensor.HIDIVE] },
          genre_in: { type: "[String]", value: options?.genres },
          tag_in: { type: "[String]", value: options?.tags }
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
          "episodes",
          "isAdult",
          "averageScore",
          { trailer: ["id", "site"] }
        ]
      }]
  });
  return JSON.stringify(query);
};