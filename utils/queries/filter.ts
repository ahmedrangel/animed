const query = `
  query MediaQuery(
    $page: Int,
    $type: MediaType,
    $format: [MediaFormat],
    $sort: [MediaSort],
    $status: MediaStatus,
    $licensedBy: [Int],
    $search: String,
    $genres: [String],
    $tags: [String],
    $status_in: [MediaStatus]
  ) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(
        type: $type,
        format_in: $format,
        sort: $sort,
        status: $status,
        status_in: $status_in
        search: $search,
        licensedById_in: $licensedBy,
        genre_in: $genres,
        tag_in: $tags
      ) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
        }
        bannerImage
        startDate {
          year
          month
          day
        }
        description
        format
        status(version: 2)
        episodes
        isAdult
        averageScore
        trailer {
          id
          site
        }
      }
    }
  }
`;

export const queryFilter = (options?: Record<string, any>) => {
  const variables = {
    page: options?.page || 1,
    type: "ANIME",
    format: ["TV", "OVA", "ONA"],
    sort: options?.sort,
    status: options?.status,
    status_in: options?.status_in,
    search: options?.search,
    licensedBy: ["5", "7", "10", "20"],
    genres: options?.genres,
    tags: options?.tags,
  };
  return { query, variables };
};