import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Toolbar } from "@mui/material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import useStoryTheme from "../useStoryTheme";

export default {
  title: "Components/Common/ThemeSwitcher",
  component: ThemeSwitcher,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
  },
} as Meta;

type ThemeSwitcherStoryProps = CommonStoryArgTypesProps;

const Template: StoryFn<ThemeSwitcherStoryProps> = (args) => {
  useStoryTheme(args);

  return (
    <AppRouterCacheProvider>
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "background.default",
          color: "onBackground",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 1,
            gap: 2,
          }}
        >
          <Box>Theme:</Box>
          <ThemeSwitcher />
        </Toolbar>
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
};