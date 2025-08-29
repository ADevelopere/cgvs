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
import ConnectivityStatus from "@/components/common/ConnectivityStatus";
import useStoryTheme from "../useStoryTheme";

export default {
  title: "Components/Common/ConnectivityStatus",
  component: ConnectivityStatus,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
  },
} as Meta;

type ConnectivityStatusStoryProps = CommonStoryArgTypesProps;

const Template: StoryFn<ConnectivityStatusStoryProps> = (args) => {
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
          <Box>Connectivity Status:</Box>
          <ConnectivityStatus />
        </Toolbar>
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
};