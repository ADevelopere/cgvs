import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { DateStaticSourceInput } from "./DateStaticSourceInput";

const meta: Meta<typeof DateStaticSourceInput> = {
  title: "Template/Editor/Form/Element/Date/DateStaticSourceInput",
  component: DateStaticSourceInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DateStaticSourceInput>;

export const Default: Story = {
  args: {
    value: "2024-01-15",
    onChange: value => logger.info("Date changed", { value }),
  },
};

export const Empty: Story = {
  args: {
    value: "",
    onChange: value => logger.info("Date changed", { value }),
  },
};

export const WithError: Story = {
  args: {
    value: "",
    onChange: value => logger.info("Date changed", { value }),
    error: "Date is required",
  },
};

export const Disabled: Story = {
  args: {
    value: "2024-01-15",
    onChange: value => logger.info("Date changed", { value }),
    disabled: true,
  },
};
