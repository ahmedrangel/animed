import { gqlQuery } from "gql-payload";
import { Language, Sort } from "~~/enums/anilist";

export const queryAnime = (options?: QueryOptions) => {
  for (const key in options) {
    if (!options[key as keyof QueryOptions]) delete options[key as keyof QueryOptions];
  }
  const query = gqlQuery({
    operation: "Media",
    variables: { id: Number(options?.id) },
    fields: [
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
      { trailer: ["id", "site"] },
      { nextAiringEpisode: ["airingAt", "timeUntilAiring", "episode"] },
      { studios: [
        { edges: [
          "isMain",
          { node: ["id", "name"] }
        ] }
      ] },
      { externalLinks: ["site", "url", "icon", "color"] },
      { streamingEpisodes: ["site", "title", "thumbnail", "url"] },
      { tags: ["name"] },
      { operation: "characters",
        variables: {
          perPageCharacters: { name: "perPage", type: "Int", value: 9 },
          characterSort: { name: "sort", type: "[CharacterSort]", value: [Sort.ROLE, Sort.RELEVANCE, Sort.ID] }
        },
        fields: [
          { edges: [
            "id",
            "role",
            { node: [
              "id",
              { name: ["userPreferred"] },
              { image: ["large"] }
            ] },
            { operation: "voiceActors",
              variables: {
                staffLanguage: { name: "language", type: "StaffLanguage", value: options?.staffLanguage || Language.JAPANESE },
                staffSort: { name: "sort", type: "[StaffSort]", value: [Sort.RELEVANCE, Sort.ID] }
              },
              fields: [
                "id",
                { name: ["userPreferred"] },
                { image: ["large"] },
                "languageV2"
              ]
            }
          ] }
        ]
      }, /*
      { operation: "staff",
        variables: {
          staffSort: { name: "sort", type: "[StaffSort]", value: [Sort.RELEVANCE, Sort.ID] }
        },
        fields: [
          { edges: [
            "role",
            { node: [
              "id",
              { name: ["userPreferred"] },
              { image: ["medium"] }
            ] }
          ] }
        ]
      }, */
      { operation: "recommendations",
        variables: {
          perPageRecommendation: { name: "perPage", type: "Int", value: 6 },
          recommendationSort: { name: "sort", type: "[RecommendationSort]", value: [Sort.RATING_DESC, Sort.ID] }
        },
        fields: [
          { nodes: [
            { mediaRecommendation: [
              "id",
              { title: ["romaji", "english", "native"] },
              "format",
              "status",
              { nextAiringEpisode: ["airingAt", "timeUntilAiring", "episode"] },
              { startDate: ["year", "month", "day"] },
              { coverImage: ["extraLarge"] },
              "averageScore"
            ] }
          ] }
        ]
      }
    ]
  });
  return query;
};

export const queryAnimeSlug = (id: QueryOptions["id"]) => {
  const query = gqlQuery({
    operation: "Media",
    variables: { id },
    fields: [
      "id",
      { title: ["romaji"] }
    ]
  });
  return query;
};

export const queryAnimeCharacters = (options?: QueryOptions) => {
  for (const key in options) {
    if (!options[key as keyof QueryOptions]) delete options[key as keyof QueryOptions];
  }
  const query = gqlQuery({
    operation: "Media",
    variables: { id: Number(options?.id) },
    fields: [
      ...options?.withInfo ? [
        "id",
        { title: ["romaji", "english", "native"] },
        { coverImage: ["extraLarge"] },
        "bannerImage",
        "format",
        "averageScore",
        { streamingEpisodes: ["title"] },
        { nextAiringEpisode: ["airingAt", "timeUntilAiring", "episode"] }
      ] : [],
      { operation: "characters",
        variables: {
          page: { type: "Int", value: options?.page || 1 },
          characterSort: { name: "sort", type: "[CharacterSort]", value: [Sort.ROLE, Sort.RELEVANCE, Sort.ID] }
        },
        fields: [
          { pageInfo: ["hasNextPage"] },
          { edges: [
            "id",
            "role",
            { node: [
              "id",
              { name: ["userPreferred"] },
              { image: ["large"] }
            ] },
            { operation: "voiceActors",
              variables: {
                staffLanguage: { name: "language", type: "StaffLanguage", value: options?.staffLanguage },
                staffSort: { name: "sort", type: "[StaffSort]", value: [Sort.RELEVANCE, Sort.ID] }
              },
              fields: [
                "id",
                { name: ["userPreferred"] },
                { image: ["large"] },
                "languageV2"
              ]
            }
          ] }
        ]
      }
    ]
  });
  return query;
};

export const queryAnimeEpisodes = (options?: QueryOptions) => {
  for (const key in options) {
    if (!options[key as keyof QueryOptions]) delete options[key as keyof QueryOptions];
  }
  const query = gqlQuery({
    operation: "Media",
    variables: { id: Number(options?.id) },
    fields: [
      "id",
      { title: ["romaji", "english", "native"] },
      { coverImage: ["extraLarge"] },
      "bannerImage",
      "format",
      "averageScore",
      { streamingEpisodes: ["site", "title", "thumbnail", "url"] },
      { nextAiringEpisode: ["airingAt", "timeUntilAiring", "episode"] }
    ]
  });
  return query;
};
