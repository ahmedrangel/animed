import * as gql from "gql-query-builder";
import { Sort } from "~/enums/anilist";

export const queryStaff = (options?: Record<string, any>) => {
  for (const key in options) {
    if (!options[key]) delete options[key];
  }

  const generalFields = (page: number) => {
    if (!page || page === 1) {
      return [
        "id",
        { name: ["native", "userPreferred", "alternative"] },
        { image: ["large"] },
        "languageV2",
        "age",
        "gender",
        "bloodType",
        "yearsActive",
        "primaryOccupations",
        "homeTown",
        { dateOfBirth: ["year", "month", "day"] },
        { dateOfDeath: ["year", "month", "day"] },
        { operation: "description",
          variables: { asHtml: true },
          fields: []
        }
      ];
    }
    return ["id"];
  };
  const query = gql.query({
    operation: "Staff",
    variables: {
      id: Number(options?.id)
    },
    fields: [
      ...generalFields(options?.page),
      { operation: "characterMedia",
        variables: {
          mediaPage: { name: "page", type: "Int", value: options?.page || 1 },
          mediaSort: { name: "sort", type: "[MediaSort]", value: [Sort.START_DATE_DESC] },
          mediaPerPage: { name: "perPage", type: "Int", value: 25 }
        },
        fields: [
          { pageInfo: ["hasNextPage"] },
          { edges: [
            "characterRole",
            {
              characters: [
                { name: ["userPreferred"] },
                { image: ["large"] }
              ]
            },
            { node: [
              "id",
              "format",
              { title: ["romaji", "english"] },
              { coverImage: ["large"] },
              { startDate: ["year", "month", "day"] }
            ] }
          ] }
        ]
      }
    ]
  });
  return JSON.stringify(query);
};

export const queryStaffSlug = (id: number) => {
  const query = gql.query({
    operation: "Staff",
    variables: {
      id: Number(id)
    },
    fields: [
      "id",
      { name: ["userPreferred"] }
    ]
  });
  return JSON.stringify(query);
};
