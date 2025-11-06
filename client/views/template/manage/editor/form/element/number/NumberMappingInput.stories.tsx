import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/console";
import { NumberMappingInput } from "./NumberMappingInput";
import { useState } from "react";

const meta: Meta<typeof NumberMappingInput> = {
  title: "Template/Editor/Form/Element/Number/NumberMappingInput",
  component: NumberMappingInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NumberMappingInput>;

const NumberMappingInputWithState = (
  props: Omit<React.ComponentProps<typeof NumberMappingInput>, "value" | "onChange">
) => {
  const [value, setValue] = useState<Record<string, string>>({
    ar: "2",
    en: "2",
  });

  return (
    <NumberMappingInput
      {...props}
      value={value}
      onChange={newValue => {
        logger.info("Mapping changed:", newValue);
        setValue(newValue);
      }}
    />
  );
};

export const Default: Story = {
  render: () => <NumberMappingInputWithState />,
};

export const WithValue: Story = {
  args: {
    value: { ar: "2", en: "2", fr: "3" },
    onChange: mapping => logger.info("Mapping:", mapping),
  },
};

export const WithErrors: Story = {
  args: {
    value: { ar: "2", en: "-1", fr: "abc" },
    onChange: mapping => logger.info("Mapping:", mapping),
    errors: {
      en: "Decimal places must be a non-negative number",
      fr: "Decimal places must be a non-negative number",
    },
  },
};

export const Empty: Story = {
  args: {
    value: {},
    onChange: mapping => logger.info("Mapping:", mapping),
  },
};

export const Disabled: Story = {
  args: {
    value: { ar: "2", en: "2" },
    onChange: mapping => logger.info("Mapping:", mapping),
    disabled: true,
  },
};
