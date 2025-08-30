import { useEffect } from "react";
import { useAppTheme } from "@/contexts/ThemeContext";
import { CommonStoryArgTypesProps } from "./argTypes";

const useStoryTheme = (args: CommonStoryArgTypesProps) => {
    const { language, setLanguage, setThemeMode, themeMode } = useAppTheme();

    useEffect(() => {
        // Update theme when args change after initial mount
        if (args.language !== language) {
            setLanguage(args.language);
        }
        if (args.themeMode !== themeMode) {
            setThemeMode(args.themeMode);
        }
    }, [
        args.language,
        args.themeMode,
        language,
        themeMode,
        setLanguage,
        setThemeMode,
    ]);
};

export default useStoryTheme;
