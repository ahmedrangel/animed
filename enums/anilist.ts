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
  ONA = "ONA",
  OVA = "OVA"
}

export enum Sort {
  TRENDING_DESC = "TRENDING_DESC",
  POPULARITY_DESC = "POPULARITY_DESC",
  SEARCH_MATCH = "SEARCH_MATCH",
  START_DATE_DESC = "START_DATE_DESC",
  SCORE_DESC = "SCORE_DESC"
}

export enum Licensor {
  CRUNCHYROLL = 5,
  HULU = 7,
  NETFLIX = 10,
  HIDIVE = 20
}