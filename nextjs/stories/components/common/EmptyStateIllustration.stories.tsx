import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box } from "@mui/material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import EmptyStateIllustration from "@/components/common/EmptyStateIllustration";
import useStoryTheme from "@/stories/useStoryTheme";

export default {
  title: "Components/Common/EmptyStateIllustration",
  component: EmptyStateIllustration,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    message: {
      control: "text",
      description: "The message to display in the empty state",
    },
  },
} as Meta;

type EmptyStateIllustrationStoryProps = {
  message: string;
} & CommonStoryArgTypesProps;

const Template: StoryFn<EmptyStateIllustrationStoryProps> = (args) => {
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
        <EmptyStateIllustration message={args.message} />
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
  message: "No items found",
};

export const CustomMessage = Template.bind({});
CustomMessage.args = {
  ...defaultStoryArgs,
  message: "Your search returned no results. Try adjusting your search criteria.",
};

export const ShortMessage = Template.bind({});
ShortMessage.args = {
  ...defaultStoryArgs,
  message: "Empty",
};