import { useAppTheme } from "@/contexts/ThemeContext";
import AppLanguage from "@/locale/AppLanguage";
import translations, { Translations } from "@/locale/translations";
import { useMemo } from "react";


// const someTranslation = useAppTranslation("key");
const useAppTranslation = <T extends keyof Translations>(namespace: T) => {
  const { language } = useAppTheme();
  const ts = useMemo(() => {
    if (Object.values(AppLanguage).includes(language )) {
      return translations[language];
    }
    return translations[AppLanguage.default];
  }, [language]);

  return ts[namespace];
};

export default useAppTranslation;
