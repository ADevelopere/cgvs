import AppLanguage from "@/locale/AppLanguage";
import ThemeMode from "@/theme/ThemeMode";

export type CommonStoryArgTypesProps = {
  language: AppLanguage;
  themeMode: ThemeMode;
};

export const commonStoryArgTypes = {
  language: {
    control: { type: "select" },
    options: Object.values(AppLanguage),
    table: {
      category: "Settings",
      order: 1,
    },
  },
  themeMode: {
    control: { type: "select" },
    options: Object.values(ThemeMode),
    table: {
      category: "Settings",
      order: 2,
    },
  },
};

export const defaultStoryArgs = {
  language: AppLanguage.default,
  themeMode: ThemeMode.Dark,
};