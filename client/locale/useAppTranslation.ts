import { useAppTheme } from "@/client/contexts/ThemeContext";
import translations from "@/client/locale/translations";
import { useMemo } from "react";
import { AppLanguage } from "../graphql/generated/gql/graphql";

export const useAppTranslation = () => {
  const { language } = useAppTheme();
  const ts = useMemo(() => {
    // Check if language exists in translations
    if (language in translations) {
      return translations[language];
    }
    // Fallback to default language (guaranteed to exist)
    return translations[AppLanguage.Ar];
  }, [language]);

  return ts;
};

export const useAppTranslationForLanguage = (language: AppLanguage) => {
  const ts = useMemo(() => {
    // Check if language exists in translations
    if (language in translations) {
      return translations[language];
    }
    // Fallback to default language (guaranteed to exist)
    return translations[AppLanguage.Ar];
  }, [language]);

  return ts;
};
