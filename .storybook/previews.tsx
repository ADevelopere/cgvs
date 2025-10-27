import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import { AppThemeProvider } from "../client/contexts/ThemeContext";
import ThemeMode from "../client/theme/ThemeMode";
import AppLanguage from "../client/locale/AppLanguage";
import { Box } from "@mui/material";
import { themes } from "@storybook/theming";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    docs: {
      theme: themes.dark,
    },
  },

  // Global argTypes for theme and language controls
  globalTypes: {
    themeMode: {
      description: "Theme mode",
      defaultValue: ThemeMode.Light,
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: ThemeMode.Light, title: "Light", icon: "sun" },
          { value: ThemeMode.Dark, title: "Dark", icon: "moon" },
          { value: ThemeMode.System, title: "System", icon: "browser" },
        ],
        dynamicTitle: true,
      },
    },
    language: {
      description: "Language",
      defaultValue: AppLanguage.default,
      toolbar: {
        title: "Language",
        icon: "globe",
        items: [
          { value: AppLanguage.default, title: "العربية", icon: "circle" },
          { value: AppLanguage.en, title: "English", icon: "circle" },
        ],
        dynamicTitle: true,
      },
    },
  },

  // Global decorator to wrap all stories with AppThemeProvider
  decorators: [
    (Story, context) => {
      const themeMode = context.globals.themeMode as ThemeMode;
      const language = context.globals.language as string;

      return (
        <AppThemeProvider initialTheme={themeMode} initialLanguage={language}>
          <Box
            sx={{
              backgroundColor: "background.default",
              p: 2,
              boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <Story />
          </Box>
        </AppThemeProvider>
      );
    },
  ],
};

export default preview;
