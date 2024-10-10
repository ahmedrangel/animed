import { gqlQuery, type FieldsOption } from "gql-payload";
import { Sort } from "~~/enums/anilist";

export const queryStaff = (options?: QueryOptions) => {
  for (const key in options) {
    if (!options[key as keyof QueryOptions]) delete options[key as keyof QueryOptions];
  }

  const generalFields = (page: QueryOptions["page"]): FieldsOption => {
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
  const query = gqlQuery({
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
  return query;
};

export const queryStaffSlug = (id: QueryOptions["id"]) => {
  const query = gqlQuery({
    operation: "Staff",
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
