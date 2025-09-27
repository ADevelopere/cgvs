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
import CountrySelect, { CountrySelectProps } from "@/components/input/CountrySelect";
import countries from "@/utils/country";
import useStoryTheme from "../../useStoryTheme";

export default {
  title: "Components/Input/CountrySelect",
  component: CountrySelect,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    country: {
      table: {
        disable: true,
      },
    },
    setCountry: {
      table: {
        disable: true,
      },
    },
    autoComplete: {
      table: {
        disable: true,
      },
    },
    label: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

type CountrySelectStoryProps = CountrySelectProps & CommonStoryArgTypesProps;

const Template: StoryFn<CountrySelectStoryProps> = (
  args: CountrySelectStoryProps,
) => {
  const [country, setCountry] = useState(countries[0]);
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
        <CountrySelect {...args} country={country} setCountry={setCountry} />
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
  fullWidth: true,
  required: true,
};