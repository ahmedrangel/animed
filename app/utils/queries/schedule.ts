import { gqlQuery } from "gql-payload";

export const querySchedules = (options?: QueryOptions) => {
  for (const key in options) {
    if (!options[key as keyof QueryOptions]) delete options[key as keyof QueryOptions];
  }
  const query = gqlQuery({
    operation: "Page",
    variables: {
      page: { type: "Int", value: options?.page || 1 },
      perPage: { type: "Int", value: options?.perPage || 50 }
    },
    fields: [
      { pageInfo: ["hasNextPage"] },
      { operation: "airingSchedules",
        variables: {
          airingAt_greater: { type: "Int", value: options?.airingAt_greater },
          airingAt_lesser: { type: "Int", value: options?.airingAt_lesser }
        },
        fields: [
          "id",
          "episode",
          "airingAt",
          { media: [
            "id",
            "idMal",
            { title: ["romaji", "english", "native"] },
            { coverImage: ["extraLarge"] },
            "bannerImage",
            { startDate: ["year", "month", "day"] },
            { endDate: ["year", "month", "day"] },
            "description",
            "season",
            "seasonYear",
            "format",
            "status",
            "episodes",
            "duration",
            "genres",
            "source",
            "averageScore",
            "countryOfOrigin",
            { trailer: ["id", "site"] }
          ] }
        ]
      }
    ]
  });

  return query;
};
