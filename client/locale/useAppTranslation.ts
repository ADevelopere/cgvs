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
    if (Object.values(AppLanguage).includes(language)) {
      return translations[language];
    }
    return translations[AppLanguage.default];
  }, [language]);

  return ts[namespace];
};
