import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { StudentFieldSelector } from "./StudentTextFieldSelector";
import { StudentTextField } from "@/client/graphql/generated/gql/graphql";

const meta: Meta<typeof StudentFieldSelector> = {
  title: "Template/Editor/Form/Element/Text/StudentFieldSelector",
  component: StudentFieldSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StudentFieldSelector>;

export const StudentName: Story = {
  args: {
    value: StudentTextField.StudentName,
    onChange: (field) => logger.log("Field changed:", field),
    disabled: false,
  },
};

export const StudentEmail: Story = {
  args: {
    value: StudentTextField.StudentEmail,
    onChange: (field) => logger.log("Field changed:", field),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    value: StudentTextField.StudentName,
    onChange: (field) => logger.log("Field changed:", field),
    error: "Field is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: StudentTextField.StudentName,
    onChange: (field) => logger.log("Field changed:", field),
    disabled: true,
  },
};

