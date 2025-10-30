import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { TextStaticSourceInput } from "./TextStaticSourceInput";

const meta: Meta<typeof TextStaticSourceInput> = {
  title: "Template/Editor/Form/Element/Text/TextStaticSourceInput",
  component: TextStaticSourceInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextStaticSourceInput>;

export const Empty: Story = {
  args: {
    value: "",
    onChange: (value) => logger.log("Value changed:", value),
    disabled: false,
  },
};

export const WithValue: Story = {
  args: {
    value: "Certificate of Completion",
    onChange: (value) => logger.log("Value changed:", value),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    value: "",
    onChange: (value) => logger.log("Value changed:", value),
    error: "Value is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: "Certificate of Completion",
    onChange: (value) => logger.log("Value changed:", value),
    disabled: true,
  },
};

