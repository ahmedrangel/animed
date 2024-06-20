import * as gql from "gql-query-builder";
import { Format, Licensor, Sort, Status } from "../../enums/anilist";

export const queryExplore = (options?: Record<string, any> | null) => {
  const multiQuery = (options: Record<string, any>) => {
    return {
      operation: `${options.alias}: Page`,
      variables: {
        [`${options.alias}_page`]: { name: "page", type: "Int", value: 1 },
        [`${options.alias}_perPage`]: { name: "perPage", type: "Int", value: 20 }
      },
      fields: [
        { operation: "media",
          variables: {
            [`${options.alias}_type`]: { name: "type", type: "MediaType", value: "ANIME" },
            [`${options.alias}_format_in`]: { name: "format_in", type: "[MediaFormat]", value: [Format.TV, Format.OVA, Format.ONA, Format.TV_SHORT] },
            [`${options.alias}_sort`]: { name: "sort", type: "[MediaSort]", value: options?.sort },
            [`${options.alias}_status_in`]: { name: "status_in", type: "[MediaStatus]", value: options?.status_in },
            [`${options.alias}_licensedById_in`]: { name: "licensedById_in", type: "[Int]", value: [Licensor.CRUNCHYROLL, Licensor.HULU, Licensor.NETFLIX, Licensor.HIDIVE, Licensor.AMAZON] },
            [`${options.alias}_genre_in`]: { name: "genre_in", type: "[String]", value: options?.genres },
            [`${options.alias}_tag_in`]: { name: "tag_in", type: "[String]", value: options?.tags }
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
            { trailer: ["id", "site"] }
          ]
        }]
    };
  };
  const queryNewly = multiQuery({ alias: "newly", ...options, sort: Sort.START_DATE_DESC, status_in: [Status.AIRING, Status.FINISHED] });
  const queryTopRated = multiQuery({ alias: "top", ...options, sort: Sort.SCORE_DESC });
  const queryTrending = multiQuery({ alias: "trending", ...options, sort: [Sort.TRENDING_DESC, Sort.POPULARITY_DESC] });
  const query = gql.query([queryNewly, queryTopRated, queryTrending]);
  return JSON.stringify(query);
};
