import { useAppTheme } from "@/client/contexts/ThemeContext";
import AppLanguage from "@/client/locale/AppLanguage";
import translations, { Translations } from "@/client/locale/translations";
import { useMemo } from "react";

// const someTranslation = useAppTranslation("key");
export const useAppTranslation = <T extends keyof Translations>(
  namespace: T
) => {
  const { language } = useAppTheme();
  const ts = useMemo(() => {
    // Check if language exists in translations
    if (language in translations) {
      return translations[language];
    }
    // Fallback to default language (guaranteed to exist)
    return translations[AppLanguage.default];
  }, [language]);

  // Return the namespace - guaranteed to exist due to fallback
  return ts[namespace];
};
