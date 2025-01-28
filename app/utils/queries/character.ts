import { gqlQuery } from "gql-payload";
import { Sort } from "~~/enums/anilist";

export const queryCharacter = (options: QueryOptions) => {
  const { id } = options;
  const query = gqlQuery({
    operation: "Character",
    variables: {
      id: Number(id)
    },
    fields: [
      "id",
      { name: ["native", "userPreferred", "alternative"] },
      { image: ["large"] },
      "age",
      "gender",
      "bloodType",
      { dateOfBirth: ["year", "month", "day"] },
      { operation: "description",
        variables: { asHtml: true },
        fields: []
      }
    ]
  });
  return query;
};

export const queryCharacterMedias = (options?: QueryOptions) => {
  for (const key in options) {
    if (!options[key as keyof QueryOptions]) delete options[key as keyof QueryOptions];
  }
  const query = gqlQuery({
    operation: "Character",
    variables: {
      id: Number(options?.id)
    },
    fields: [
      "id",
      { operation: "media",
        variables: {
          mediaPage: { name: "page", type: "Int", value: options?.page || 1 },
          mediaSort: { name: "sort", type: "[MediaSort]", value: [options?.sort || Sort.START_DATE_DESC] },
          mediaPerPage: { name: "perPage", type: "Int", value: 25 },
          mediaType: { name: "type", type: "MediaType", value: "ANIME" }
        },
        fields: [
          { pageInfo: ["hasNextPage"] },
          { edges: [
            "id",
            "characterRole",
            { operation: "voiceActorRoles",
              variables: {
                staffSort: { name: "sort", type: "[StaffSort]", value: [Sort.RELEVANCE, Sort.ID] }
              },
              fields: [
                { voiceActor: [
                  "id",
                  "languageV2",
                  { name: ["userPreferred"] },
                  { image: ["large"] }
                ]
                }
              ]
            },
            { node: [
              "id",
              "format",
              { title: ["romaji", "english"] },
              { coverImage: ["extraLarge"] },
              { startDate: ["year", "month", "day"] }
            ]
            }
          ] }
        ]
      }
    ]
  });
  return query;
};

export const queryCharacterSlug = (id: QueryOptions["id"]) => {
  const query = gqlQuery({
    operation: "Character",
    variables: {
      id: Number(id)
    },
    fields: [
      "id",
      { name: ["userPreferred"] }
    ]
  });
  return query;
};
