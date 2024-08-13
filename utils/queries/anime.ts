import * as gql from "gql-query-builder";
import { Sort } from "~~/enums/anilist";

export const queryAnime = (options?: Record<string, any>) => {
  for (const key in options) {
    if (!options[key]) delete options[key];
  }
  const query = gql.query({
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
      "synonyms",
      "source",
      "averageScore",
      "hashtag",
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
              { startDate: ["year", "month", "day"] },
              { coverImage: ["extraLarge"] },
              "averageScore"
            ] }
          ] }
        ]
      }
    ]
  });
  return JSON.stringify(query);
};

export const queryAnimeSlug = (id: number) => {
  const query = gql.query({
    operation: "Media",
    variables: { id },
    fields: [
      "id",
      { title: ["romaji"] }
    ]
  });
  return JSON.stringify(query);
};

export const queryAnimeCharacters = (options?: Record<string, any>) => {
  for (const key in options) {
    if (!options[key]) delete options[key];
  }
  const query = gql.query({
    operation: "Media",
    variables: { id: Number(options?.id) },
    fields: [
      "id",
      { title: ["romaji", "english", "native"] },
      { coverImage: ["extraLarge"] },
      "bannerImage",
      "format",
      "averageScore",
      { streamingEpisodes: ["title"] },
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
            "name",
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
  return JSON.stringify(query);
};

export const queryAnimeEpisodes = (options?: Record<string, any>) => {
  for (const key in options) {
    if (!options[key]) delete options[key];
  }
  const query = gql.query({
    operation: "Media",
    variables: { id: Number(options?.id) },
    fields: [
      "id",
      { title: ["romaji", "english", "native"] },
      { coverImage: ["extraLarge"] },
      "bannerImage",
      "format",
      "averageScore",
      { streamingEpisodes: ["site", "title", "thumbnail", "url"] }
    ]
  });
  return JSON.stringify(query);
};
