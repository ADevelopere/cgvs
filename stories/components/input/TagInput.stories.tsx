import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";

import withGlobalStyles from "@/stories/Decorators";
import { Box } from "@mui/material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import TagInput from "@/components/input/TagInput";
import useStoryTheme from "../../useStoryTheme";

export default {
  title: "Components/Input/TagInput",
  component: TagInput,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    label: {
      control: "text",
      description: "Label for the tag input field",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when input is empty",
    },
    initialTags: {
      control: "object",
      description: "Initial tags to display",
    },
    onChange: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

type TagInputStoryProps = {
  label?: string;
  placeholder?: string;
  initialTags?: string[];
} & CommonStoryArgTypesProps;

const Template: StoryFn<TagInputStoryProps> = (args: TagInputStoryProps) => {
  const [tags, setTags] = useState<string[]>(args.initialTags || []);
  useStoryTheme(args);

  return (
    <AppRouterCacheProvider>
      <Box
        sx={{
          height: "100vh",
          paddingX: { xs: "1em", sm: "2em", md: "20em", lg: "30em" },
          backgroundColor: "background.default",
          color: "onBackground",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TagInput
          label={args.label}
          placeholder={args.placeholder}
          initialTags={tags}
          onChange={setTags}
        />
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
  label: "Add tags",
  placeholder: "Type and press Enter",
  initialTags: [],
};

export const WithInitialTags = Template.bind({});
WithInitialTags.args = {
  ...defaultStoryArgs,
  label: "Skills",
  placeholder: "Add a skill",
  initialTags: ["React", "TypeScript", "JavaScript", "Node.js"],
};

export const CustomLabel = Template.bind({});
CustomLabel.args = {
  ...defaultStoryArgs,
  label: "Technologies you know",
  placeholder: "Add technology",
  initialTags: ["Python", "Django"],
};

export const EmptyWithLongPlaceholder = Template.bind({});
EmptyWithLongPlaceholder.args = {
  ...defaultStoryArgs,
  label: "Interests",
  placeholder: "Type your interests and press Enter or comma to add",
  initialTags: [],
};

export const ManyTags = Template.bind({});
ManyTags.args = {
  ...defaultStoryArgs,
  label: "Programming Languages",
  placeholder: "Add more languages",
  initialTags: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "Go",
    "Rust",
    "Kotlin",
    "Swift",
    "PHP",
    "Ruby",
    "C#",
  ],
};

export const LongTagNames = Template.bind({});
LongTagNames.args = {
  ...defaultStoryArgs,
  label: "Frameworks and Libraries",
  placeholder: "Add framework or library",
  initialTags: [
    "React with TypeScript",
    "Next.js Full Stack Framework",
    "Material-UI Component Library",
    "Storybook for Component Development",
  ],
};