import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { AppThemeProvider } from "../client/contexts/ThemeContext";
import ThemeMode from "../client/theme/ThemeMode";
import AppLanguage from "../client/locale/AppLanguage";
import { Box } from "@mui/material";
import { themes } from "@storybook/theming";

// Create a lightweight mock Apollo Client for Storybook
const mockLink = new ApolloLink(() => {
  return new Observable(subscriber => {
    // Return empty data for all operations
    subscriber.next({ data: {} });
    subscriber.complete();
  });
});

const mockApolloClient = new ApolloClient({
  link: mockLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: "all" },
    query: { errorPolicy: "all" },
    mutate: { errorPolicy: "all" },
  },
});

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
      defaultValue: ThemeMode.Dark,
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
        <ApolloProvider client={mockApolloClient}>
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
        </ApolloProvider>
      );
    },
  ],
};

export default preview;
