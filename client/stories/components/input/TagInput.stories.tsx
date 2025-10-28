import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import TagInput from "../../../components/input/TagInput";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Input/TagInput",
  component: TagInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    initialTags: { control: "object" },
  },
  // Use `fn` to spy on the onChange arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onChange: fn() },
  decorators: [
    Story => (
      <div style={{ width: "500px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
};

export const WithInitialTags: Story = {
  args: {
    initialTags: ["React", "TypeScript", "Material-UI", "Storybook"],
  },
};

export const CustomLabel: Story = {
  args: {
    label: "Enter your favorite technologies",
    initialTags: ["JavaScript", "CSS"],
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Add a tag and press Enter...",
  },
};

export const WithOnChange: Story = {
  args: {
    label: "Technologies (check Actions panel below)",
    placeholder: "Type and press Enter or comma",
    initialTags: ["Node.js"],
  },
};

export const ManyTags: Story = {
  args: {
    label: "Popular Programming Languages",
    initialTags: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C#",
      "Go",
      "Rust",
      "Ruby",
      "PHP",
      "Swift",
      "Kotlin",
    ],
  },
};
