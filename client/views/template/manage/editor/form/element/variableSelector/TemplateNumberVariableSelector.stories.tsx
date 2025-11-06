import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/console";
import { TemplateNumberVariableSelector } from "./TemplateNumberVariableSelector";
import { mockNumberVariables } from "../story.util";
import { useState } from "react";

const meta: Meta<typeof TemplateNumberVariableSelector> = {
  title: "Template/Editor/Form/Element/VariableSelector/TemplateNumberVariableSelector",
  component: TemplateNumberVariableSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TemplateNumberVariableSelector>;

const TemplateNumberVariableSelectorWithState = (
  props: Omit<React.ComponentProps<typeof TemplateNumberVariableSelector>, "value" | "onChange">
) => {
  const [value, setValue] = useState<number | null>(null);

  return (
    <TemplateNumberVariableSelector
      {...props}
      value={value}
      onChange={newValue => {
        logger.info("Variable changed:", newValue);
        setValue(newValue);
      }}
    />
  );
};

export const Default: Story = {
  render: () => <TemplateNumberVariableSelectorWithState numberVariables={mockNumberVariables} />,
};

export const WithValue: Story = {
  args: {
    value: 1,
    onChange: variableId => logger.info("Selected variable:", variableId),
    numberVariables: mockNumberVariables,
  },
};

export const WithError: Story = {
  args: {
    value: null,
    onChange: variableId => logger.info("Selected variable:", variableId),
    numberVariables: mockNumberVariables,
    error: "Template number variable is required",
  },
};

export const Disabled: Story = {
  args: {
    value: 1,
    onChange: variableId => logger.info("Selected variable:", variableId),
    numberVariables: mockNumberVariables,
    disabled: true,
  },
};

export const Empty: Story = {
  args: {
    value: null,
    onChange: variableId => logger.info("Selected variable:", variableId),
    numberVariables: [],
  },
};
