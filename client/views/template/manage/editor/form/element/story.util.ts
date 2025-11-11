import {
  FontFamily,
  TemplateTextVariable,
  TemplateSelectVariable,
  TemplateNumberVariable,
} from "@/client/graphql/generated/gql/graphql";

export const mockFontFamilies: FontFamily[] = [
  {
    id: 1,
    name: "Cairo",
    category: "sans-serif",
    locale: ["ar", "en"],
    createdAt: new Date(),
    updatedAt: new Date(),
    variants: [
      {
        id: 1,
        familyId: 1,
        variant: "Regular",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        familyId: 1,
        variant: "Bold",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: 2,
    name: "Amiri",
    category: "serif",
    locale: ["ar"],
    createdAt: new Date(),
    updatedAt: new Date(),
    variants: [
      {
        id: 3,
        familyId: 2,
        variant: "Regular",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: 3,
    name: "Tajawal",
    category: "sans-serif",
    locale: ["ar", "en"],
    createdAt: new Date(),
    updatedAt: new Date(),
    variants: [
      {
        id: 4,
        familyId: 3,
        variant: "Regular",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
];

// Legacy export for backward compatibility
export const mockSelfHostedFonts = mockFontFamilies;

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
