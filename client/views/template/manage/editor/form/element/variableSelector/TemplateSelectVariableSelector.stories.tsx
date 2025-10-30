import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { TemplateSelectVariableSelector } from "./TemplateSelectVariableSelector";
import type { TemplateSelectVariable } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof TemplateSelectVariableSelector> = {
  title: "Template/Editor/Form/Element/TemplateSelectVariableSelector",
  component: TemplateSelectVariableSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TemplateSelectVariableSelector>;

const mockSelectVariables: TemplateSelectVariable[] = [
  { id: 1, name: "Certificate Type", __typename: "TemplateSelectVariable" },
  { id: 2, name: "Achievement Level", __typename: "TemplateSelectVariable" },
  { id: 3, name: "Skill Category", __typename: "TemplateSelectVariable" },
];

export const Default: Story = {
  args: {
    value: 1,
    variables: mockSelectVariables,
    onChange: (variableId) => logger.log("Variable changed:", variableId),
    disabled: false,
  },
};

export const NoSelection: Story = {
  args: {
    value: undefined,
    variables: mockSelectVariables,
    onChange: (variableId) => logger.log("Variable changed:", variableId),
    disabled: false,
  },
};

export const EmptyList: Story = {
  args: {
    value: undefined,
    variables: [],
    onChange: (variableId) => logger.log("Variable changed:", variableId),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    value: undefined,
    variables: mockSelectVariables,
    onChange: (variableId) => logger.log("Variable changed:", variableId),
    error: "Variable is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: 1,
    variables: mockSelectVariables,
    onChange: (variableId) => logger.log("Variable changed:", variableId),
    disabled: true,
  },
};

