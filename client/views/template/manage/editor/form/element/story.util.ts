import {
  Font,
  TemplateTextVariable,
  TemplateSelectVariable,
  TemplateNumberVariable,
} from "@/client/graphql/generated/gql/graphql";

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
  {
    id: 1,
    name: "Course Level",
    __typename: "TemplateSelectVariable",
    options: [],
  },
  {
    id: 2,
    name: "Department",
    __typename: "TemplateSelectVariable",
    options: [],
  },
];

export const mockNumberVariables: TemplateNumberVariable[] = [
  {
    __typename: "TemplateNumberVariable",
    id: 1,
    name: "Student GPA",
    description: "Student's grade point average",
    required: true,
    minValue: 0,
    maxValue: 4.0,
    decimalPlaces: 2,
    previewValue: "3.75",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    __typename: "TemplateNumberVariable",
    id: 2,
    name: "Course Hours",
    description: "Total course hours completed",
    required: false,
    minValue: 0,
    maxValue: 200,
    decimalPlaces: 0,
    previewValue: "120",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    __typename: "TemplateNumberVariable",
    id: 3,
    name: "Score Percentage",
    description: "Final exam score percentage",
    required: true,
    minValue: 0,
    maxValue: 100,
    decimalPlaces: 1,
    previewValue: "95.5",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
