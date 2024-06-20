export enum API {
  GRAPHQL = "https://graphql.anilist.co"
}

export enum Status {
  AIRING = "RELEASING",
  FINISHED = "FINISHED",
  NOT_YET_RELEASED = "NOT_YET_RELEASED"
}

export enum Format {
  TV = "TV",
  TV_SHORT = "TV_SHORT",
  ONA = "ONA",
  OVA = "OVA"
}

export enum Sort {
  TRENDING_DESC = "TRENDING_DESC",
  POPULARITY_DESC = "POPULARITY_DESC",
  SEARCH_MATCH = "SEARCH_MATCH",
  START_DATE = "START_DATE",
  START_DATE_DESC = "START_DATE_DESC",
  SCORE_DESC = "SCORE_DESC",
  ROLE = "ROLE",
  RELEVANCE = "RELEVANCE",
  ID = "ID",
  RATING_DESC = "RATING_DESC"
}

export enum Licensor {
  CRUNCHYROLL = 5,
  HULU = 7,
  NETFLIX = 10,
  HIDIVE = 20,
  AMAZON = 21
}

export enum Language {
  JAPANESE = "JAPANESE"
}
