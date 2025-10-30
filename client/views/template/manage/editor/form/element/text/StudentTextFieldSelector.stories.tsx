import { Meta, StoryObj } from "@storybook/nextjs-vite";
import logger from "@/client/lib/logger";
import { StudentFieldSelector } from "./StudentTextFieldSelector";

const meta: Meta<typeof StudentFieldSelector> = {
  title: "Template/Editor/Form/Element/Text/StudentTextFieldSelector",
  component: StudentFieldSelector,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StudentFieldSelector>;

export const StudentName: Story = {
  args: {
    value: "STUDENT_NAME",
    onChange: (field) => logger.log("Field changed:", field),
    disabled: false,
  },
};

export const StudentEmail: Story = {
  args: {
    value: "STUDENT_EMAIL",
    onChange: (field) => logger.log("Field changed:", field),
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    value: "STUDENT_NAME",
    onChange: (field) => logger.log("Field changed:", field),
    error: "Student field is required",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: "STUDENT_NAME",
    onChange: (field) => logger.log("Field changed:", field),
    disabled: true,
  },
};

