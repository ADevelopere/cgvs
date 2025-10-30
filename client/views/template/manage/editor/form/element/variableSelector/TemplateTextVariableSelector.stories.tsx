import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { TemplateTextVariableSelector } from "./TemplateTextVariableSelector";
import type { TemplateTextVariable } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof TemplateTextVariableSelector> = {
  title: "Template/Editor/Form/Element/Variable/TemplateTextVariableSelector",
  component: TemplateTextVariableSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TemplateTextVariableSelector>;

const mockTextVariables: TemplateTextVariable[] = [
  { id: 1, name: "Organization Name", __typename: "TemplateTextVariable" },
  { id: 2, name: "Course Name", __typename: "TemplateTextVariable" },
  { id: 3, name: "Instructor Name", __typename: "TemplateTextVariable" },
];

export const Default: Story = {
  args: {
    value: 1,
    variables: mockTextVariables,
    onChange: variableId => logger.log("Variable changed:", variableId),
    disabled: false,
  },
};

export const NoSelection: Story = {
  args: {
    value: undefined,
    variables: mockTextVariables,
    onChange: variableId => logger.log("Variable changed:", variableId),
    disabled: false,
  },
};

export const EmptyList: Story = {
  args: {
    value: undefined,
    variables: [],
    onChange: variableId => logger.log("Variable changed:", variableId),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    value: undefined,
    variables: mockTextVariables,
    onChange: variableId => logger.log("Variable changed:", variableId),
    error: "Variable is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: 1,
    variables: mockTextVariables,
    onChange: variableId => logger.log("Variable changed:", variableId),
    disabled: true,
  },
};
