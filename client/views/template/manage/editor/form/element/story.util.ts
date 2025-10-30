import { Font, TemplateTextVariable, TemplateSelectVariable } from "@/client/graphql/generated/gql/graphql";

export const mockSelfHostedFonts: Font[] = [
    {
      id: 1,
      name: "Cairo",
      locale: ["all"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Amiri",
      locale: ["all"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "Tajawal",
      locale: ["all"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

export const mockTextVariables: TemplateTextVariable[] = [
  { id: 1, name: "Organization Name", __typename: "TemplateTextVariable" },
  { id: 2, name: "Course Name", __typename: "TemplateTextVariable" },
  { id: 3, name: "Instructor Name", __typename: "TemplateTextVariable" },
];

export const mockSelectVariables: TemplateSelectVariable[] = [
  { id: 1, name: "Course Level", __typename: "TemplateSelectVariable", options: [] },
  { id: 2, name: "Department", __typename: "TemplateSelectVariable", options: [] },
];
  