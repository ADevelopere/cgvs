import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Toolbar } from "@mui/material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/client/components/appRouter/AppRouterCacheProvider";
import UserMenu from "@/client/components/common/UserMenu";
import useStoryTheme from "@/stories/useStoryTheme";

export default {
  title: "Components/Common/UserMenu",
  component: UserMenu,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
  },
} as Meta;

type UserMenuStoryProps = CommonStoryArgTypesProps;

const Template: StoryFn<UserMenuStoryProps> = (args) => {
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
          <Box>User Menu:</Box>
          <UserMenu />
        </Toolbar>
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
};