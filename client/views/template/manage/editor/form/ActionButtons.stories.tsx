import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionButtons } from "./ActionButtons";

const meta: Meta<typeof ActionButtons> = {
  title: "Template/Editor/Form/Element/ActionButtons",
  component: ActionButtons,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActionButtons>;

export const CreateMode: Story = {
  args: {
    onSubmit: () => alert("Submit clicked"),
    onCancel: () => alert("Cancel clicked"),
    isSubmitting: false,
    submitLabel: "Create",
    disabled: false,
  },
};

export const UpdateMode: Story = {
  args: {
    onSubmit: () => alert("Submit clicked"),
    onCancel: () => alert("Cancel clicked"),
    isSubmitting: false,
    submitLabel: "Update",
    disabled: false,
  },
};

export const Submitting: Story = {
  args: {
    onSubmit: () => alert("Submit clicked"),
    onCancel: () => alert("Cancel clicked"),
    isSubmitting: true,
    submitLabel: "Create",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    onSubmit: () => alert("Submit clicked"),
    onCancel: () => alert("Cancel clicked"),
    isSubmitting: false,
    submitLabel: "Create",
    disabled: true,
  },
};

