import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { CommonStoryArgTypesProps } from "./argTypes";

const useStoryTheme = (args: CommonStoryArgTypesProps) => {
  const { theme, language, setLanguage } = useAppTheme();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (args.language !== language) {
      setLanguage(args.language);
    }
    if (args.themeMode !== theme.palette.mode) {
      setTheme(args.themeMode);
    }
  }, [args.language, args.themeMode, language, theme, setLanguage, setTheme]);
};

export default useStoryTheme;