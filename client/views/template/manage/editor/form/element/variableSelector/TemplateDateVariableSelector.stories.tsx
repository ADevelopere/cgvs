import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/console";
import { TemplateDateVariableSelector } from "./TemplateDateVariableSelector";
import { TemplateDateVariable } from "@/client/graphql/generated/gql/graphql";

const mockDateVariables: TemplateDateVariable[] = [
  {
    __typename: "TemplateDateVariable",
    id: 1,
    name: "Course Start Date",
    description: "The date when the course started",
    required: true,
    format: "YYYY-MM-DD",
    minDate: new Date("2020-01-01"),
    maxDate: new Date("2030-12-31"),
    previewValue: "2024-01-15",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    __typename: "TemplateDateVariable",
    id: 2,
    name: "Graduation Date",
    description: "The date when student graduated",
    required: false,
    format: "DD/MM/YYYY",
    minDate: new Date("2020-01-01"),
    maxDate: new Date("2030-12-31"),
    previewValue: "15/06/2024",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    __typename: "TemplateDateVariable",
    id: 3,
    name: "Certificate Issue Date",
    description: "The date when certificate was issued",
    required: true,
    format: "MMMM DD, YYYY",
    minDate: new Date("2020-01-01"),
    maxDate: new Date("2030-12-31"),
    previewValue: "January 15, 2024",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const meta: Meta<typeof TemplateDateVariableSelector> = {
  title: "Template/Editor/Form/Element/Date/TemplateDateVariableSelector",
  component: TemplateDateVariableSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TemplateDateVariableSelector>;

export const Default: Story = {
  args: {
    value: 1,
    variables: mockDateVariables,
    onChange: variableId => logger.info("Variable changed", { variableId }),
  },
};

export const Empty: Story = {
  args: {
    value: undefined,
    variables: mockDateVariables,
    onChange: variableId => logger.info("Variable changed", { variableId }),
  },
};

export const NoVariables: Story = {
  args: {
    value: undefined,
    variables: [],
    onChange: variableId => logger.info("Variable changed", { variableId }),
  },
};

export const WithError: Story = {
  args: {
    value: undefined,
    variables: mockDateVariables,
    onChange: variableId => logger.info("Variable changed", { variableId }),
    error: "Date variable is required",
  },
};

export const Disabled: Story = {
  args: {
    value: 1,
    variables: mockDateVariables,
    onChange: variableId => logger.info("Variable changed", { variableId }),
    disabled: true,
  },
};
