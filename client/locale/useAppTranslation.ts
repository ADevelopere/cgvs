import { useAppTheme } from "@/client/contexts/ThemeContext";
import translations from "@/client/locale/translations";
import { AppLanguage } from "@/lib/enum";
import { useMemo } from "react";

export const useAppTranslation = () => {
  const { language } = useAppTheme();
  const ts = useMemo(() => {
    // Check if language exists in translations
    if (language in translations) {
      return translations[language];
    }
    // Fallback to default language (guaranteed to exist)
    return translations[AppLanguage.default];
  }, [language]);

  return ts;
};
