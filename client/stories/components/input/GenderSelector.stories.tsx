import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";

import withGlobalStyles from "@/client/stories/Decorators";
import { Box } from "@mui/material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/client/stories/argTypes";
import AppRouterCacheProvider from "@/client/components/appRouter/AppRouterCacheProvider";
import GenderSelector, { GenderSelectorProps } from "@/client/components/input/GenderSelector";
import useStoryTheme from "../../useStoryTheme";
import { Gender } from "@/lib/enum";

export default {
  title: "Components/Input/GenderSelector",
  component: GenderSelector,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    gender: {
      table: {
        disable: true,
      },
    },
    setGender: {
      table: {
        disable: true,
      },
    },
    error: {
      table: {
        disable: true,
      },
    },
    setError: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

type GenderSelectorStoryProps = GenderSelectorProps & CommonStoryArgTypesProps;

const Template: StoryFn<GenderSelectorStoryProps> = (
  args: GenderSelectorStoryProps,
) => {
  const [gender, setGender] = useState(Gender.OTHER);
  const [error, setError] = useState(false);
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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <GenderSelector
          gender={gender}
          setGender={setGender}
          error={error}
          setError={setError}
        />
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
  gender: Gender.OTHER,
};