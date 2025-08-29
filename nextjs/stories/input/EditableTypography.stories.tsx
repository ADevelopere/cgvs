import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import EditableTypography from "@/components/input/EditableTypography";
import withGlobalStyles from "@/stories/Decorators";
import { Box } from "@mui/material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";

export default {
  title: "Components/Input/EditableTypography",
  component: EditableTypography,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    typography: {
      control: "object",
    },
    textField: {
      control: "object",
    },
    doubleClickToEdit: {
      control: "boolean",
    },
    startEditing: {
      control: "boolean",
    },
  },
} as Meta;

type EditableTypographyStoryProps = {
  initialValue: string;
  doubleClickToEdit: boolean;
  startEditing: boolean;
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2";
  multiline: boolean;
} & CommonStoryArgTypesProps;

const Template: StoryFn<EditableTypographyStoryProps> = (args) => {
  const [value, setValue] = useState(args.initialValue);
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
        <EditableTypography
          typography={{
            variant: args.variant,
          }}
          textField={{
            fullWidth: true,
            multiline: args.multiline,
            minRows: args.multiline ? 3 : 1,
          }}
          value={value}
          onSave={setValue}
          doubleClickToEdit={args.doubleClickToEdit}
          startEditing={args.startEditing}
        />
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
  initialValue: "Click to edit this text",
  doubleClickToEdit: true,
  startEditing: false,
  variant: "body1",
  multiline: false,
};

export const Heading = Template.bind({});
Heading.args = {
  ...defaultStoryArgs,
  initialValue: "Editable Heading",
  doubleClickToEdit: true,
  startEditing: false,
  variant: "h3",
  multiline: false,
};

export const MultilineText = Template.bind({});
MultilineText.args = {
  ...defaultStoryArgs,
  initialValue: "This is a multiline\neditable text\nTry editing it!",
  doubleClickToEdit: true,
  startEditing: false,
  variant: "body1",
  multiline: true,
};

export const SingleClick = Template.bind({});
SingleClick.args = {
  ...defaultStoryArgs,
  initialValue: "Single click to edit this text",
  doubleClickToEdit: false,
  startEditing: false,
  variant: "body1",
  multiline: false,
};