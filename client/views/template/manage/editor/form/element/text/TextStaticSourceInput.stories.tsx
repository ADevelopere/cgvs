import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from  "@/client/lib/logger";
import { TextStaticSourceInput } from "./TextStaticSourceInput";

const meta: Meta<typeof TextStaticSourceInput> = {
  title: "Template/Editor/Form/Element/Text/TextStaticSourceInput",
  component: TextStaticSourceInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextStaticSourceInput>;

export const Default: Story = {
  args: {
    value: "Sample static text",
    onChange: (value) => logger.info("Value changed:", value),
    disabled: false,
  },
};

export const Empty: Story = {
  args: {
    value: "",
    onChange: (value) => logger.info("Value changed:", value),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    value: "",
    onChange: (value) => logger.info("Value changed:", value),
    error: "Static value is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: "Sample static text",
    onChange: (value) => logger.info("Value changed:", value),
    disabled: true,
  },
};

