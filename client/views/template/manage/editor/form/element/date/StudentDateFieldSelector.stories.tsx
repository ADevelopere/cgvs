import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { StudentDateFieldSelector } from "./StudentDateFieldSelector";
import { StudentDateField } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof StudentDateFieldSelector> = {
  title: "Template/Editor/Form/Element/Date/StudentDateFieldSelector",
  component: StudentDateFieldSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StudentDateFieldSelector>;

export const Default: Story = {
  args: {
    value: StudentDateField.DateOfBirth,
    onChange: field => logger.info("Student field changed", { field }),
  },
};

export const WithError: Story = {
  args: {
    value: StudentDateField.DateOfBirth,
    onChange: field => logger.info("Student field changed", { field }),
    error: "Student field is required",
  },
};

export const Disabled: Story = {
  args: {
    value: StudentDateField.DateOfBirth,
    onChange: (field) => logger.info("Student field changed", { field }),
    disabled: true,
  },
};

