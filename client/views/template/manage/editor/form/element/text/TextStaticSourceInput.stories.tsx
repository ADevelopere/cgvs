import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from  "@/client/lib/logger";
import { StaticSourceInput } from "./TextStaticSourceInput";

const meta: Meta<typeof StaticSourceInput> = {
  title: "Template/Editor/Form/Element/Text/TextStaticSourceInput",
  component: StaticSourceInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StaticSourceInput>;

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

