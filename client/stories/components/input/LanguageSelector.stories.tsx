import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";

import withGlobalStyles from "@/stories/Decorators";
import { Box } from "@mui/material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/client/components/appRouter/AppRouterCacheProvider";
import LanguageSelector, { LanguageSelectorProps } from "@/client/components/input/LanguageSelector";
import AppLanguage from "@/locale/AppLanguage";
import useStoryTheme from "../../useStoryTheme";

export default {
  title: "Components/Input/LanguageSelector",
  component: LanguageSelector,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    language: {
      table: {
        disable: true,
      },
    },
    setLanguage: {
      table: {
        disable: true,
      },
    },
    label: {
      table: {
        disable: true,
      },
    },
    style: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

type LanguageSelectorStoryProps = LanguageSelectorProps & CommonStoryArgTypesProps;

const Template: StoryFn<LanguageSelectorStoryProps> = (
  args: LanguageSelectorStoryProps,
) => {
  const [language, setLanguage] = useState(AppLanguage.default);
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
        <LanguageSelector {...args} language={language} setLanguage={setLanguage} />
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