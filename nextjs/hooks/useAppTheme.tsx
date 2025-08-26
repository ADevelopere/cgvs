"use client";

import type React from "react";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
    useCallback,
    useMemo,
} from "react";
import {
    type Theme,
    Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material/styles"; // Import CssVarsProvider
import { CssBaseline } from "@mui/material";
import {
    ltrLightTheme,
    rtlLightTheme,
    rtlDarkTheme,
    ltrDarkTheme,
} from "../theme";
import ThemeMode from "../theme/ThemeMode";
import { jssPreset, StylesProvider } from "@mui/styles";
import rtl from "jss-rtl";
import { create } from "jss";
import AppLanguage from "../locale/AppLanguage";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

// Create rtl cache
const cacheRtl = createCache({
    key: "rtl-cache",
    stylisPlugins: [prefixer, rtlPlugin],
});

const jss = create({
    plugins: [...jssPreset().plugins, rtl()],
});

// Utility functions
const updateLanguage = (language: string): void => {
    if (Object.values(AppLanguage).includes(language as AppLanguage)) {
        localStorage.setItem("language", language);
        document.documentElement.lang = language;
        document.body.dir = language === "ar" ? "rtl" : "ltr";
    }
};

const updateTheme = (mode: ThemeMode): void => {
    localStorage.setItem("themeMode", mode);
};

const getStoredLanguage = (): string => {
    // First check for Laravel's initial language
    const initialLanguage = (
        window as unknown as { __INITIAL_LANGUAGE__: string }
    ).__INITIAL_LANGUAGE__;
    // Then check localStorage, and finally fall back to default
    return (
        initialLanguage ||
        loadFromLocalStorage("language") ||
        AppLanguage.default
    );
};

const getStoredThemeMode = (): ThemeMode => {
    const savedTheme = loadFromLocalStorage("themeMode") as ThemeMode | null;
    if (
        savedTheme &&
        Object.values(ThemeMode).includes(savedTheme)
    ) {
        return savedTheme;
    }
    return ThemeMode.System;
};

type ThemeContextType = {
    theme: Theme;
    language: AppLanguage;
    setLanguage: (language: string | AppLanguage) => void;
    setThemeMode: (mode: ThemeMode) => void;
    themeMode: ThemeMode;
    isRtl: boolean;
    isDark: boolean;
};

const AppThemeContext = createContext<ThemeContextType | undefined>(undefined);

type AppThemeProviderProps = {
    children: ReactNode;
};

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
    children,
}) => {
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        const storedMode = getStoredThemeMode();
        const storedLanguage = getStoredLanguage();
        const isRtl = storedLanguage === "ar";
        const isDarkMode =
            storedMode === ThemeMode.Dark ||
            (storedMode === ThemeMode.System &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);

        if (isRtl) {
            return isDarkMode ? rtlDarkTheme : rtlLightTheme;
        }
        return isDarkMode ? ltrDarkTheme : ltrLightTheme;
    });

    const [currentThemeMode, setCurrentThemeMode] =
        useState<ThemeMode>(getStoredThemeMode());
    const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(
        getStoredLanguage() as AppLanguage,
    );

    // Ensure initial language and direction are set
    useEffect(() => {
        const language = getStoredLanguage();
        if (language) {
            updateLanguage(language);
        }
    }, []); // Empty dependency array means this runs once on mount

    // Add effect to listen for system theme changes when in system mode
    useEffect(() => {
        if (currentThemeMode === ThemeMode.System) {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)",
            );
            const handleChange = (e: MediaQueryListEvent) => {
                const isRtl = currentLanguage === "ar";
                setCurrentTheme(
                    isRtl
                        ? e.matches
                            ? rtlDarkTheme
                            : rtlLightTheme
                        : e.matches
                          ? ltrDarkTheme
                          : ltrLightTheme,
                );
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [currentThemeMode, currentLanguage]); // Removed setColorSchemeMode dependency

    const handleSetLanguage = useCallback(
        (newLanguage: string | AppLanguage) => {
            const language = newLanguage as AppLanguage;
            updateLanguage(language);
            setCurrentLanguage(language);

            const isRtl = language === "ar";
            const isDarkMode =
                currentThemeMode === ThemeMode.Dark ||
                (currentThemeMode === ThemeMode.System &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches);

            setCurrentTheme(
                isRtl
                    ? isDarkMode
                        ? rtlDarkTheme
                        : rtlLightTheme
                    : isDarkMode
                      ? ltrDarkTheme
                      : ltrLightTheme,
            );
        },
        [currentThemeMode],
    );

    const handleSetThemeMode = useCallback(
        (newMode: ThemeMode) => {
            updateTheme(newMode);
            setCurrentThemeMode(newMode);

            const effectiveMode =
                newMode === ThemeMode.System
                    ? window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? ThemeMode.Dark
                        : ThemeMode.Light
                    : newMode;

            const isRtl = currentLanguage === "ar";
            const isDarkMode = effectiveMode === ThemeMode.Dark;

            setCurrentTheme(
                isRtl
                    ? isDarkMode
                        ? rtlDarkTheme
                        : rtlLightTheme
                    : isDarkMode
                      ? ltrDarkTheme
                      : ltrLightTheme,
            );
        },
        [currentLanguage],
    ); // Removed setColorSchemeMode dependency

    const isRtl = useMemo(() => currentLanguage === "ar", [currentLanguage]);
    const isDark = useMemo(() => {
        if (currentThemeMode === ThemeMode.System) {
            return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return currentThemeMode === ThemeMode.Dark;
    }, [currentThemeMode]);

    const contextValue = useMemo(
        () => ({
            theme: currentTheme, // Keep providing the theme object for potential direct use
            language: currentLanguage,
            setLanguage: handleSetLanguage,
            setThemeMode: handleSetThemeMode,
            themeMode: currentThemeMode,
            isRtl,
            isDark,
        }),
        [
            currentTheme,
            currentLanguage,
            handleSetLanguage,
            handleSetThemeMode,
            currentThemeMode,
            isRtl,
            isDark,
        ],
    );

    return (
        <AppThemeContext.Provider value={contextValue}>
            <StylesProvider jss={jss}>
                {isRtl ? (
                    <CacheProvider value={cacheRtl}>
                        <CssVarsProvider theme={currentTheme}>
                            <CssBaseline enableColorScheme />
                            {children}
                        </CssVarsProvider>
                    </CacheProvider>
                ) : (
                    <CssVarsProvider theme={currentTheme}>
                        <CssBaseline enableColorScheme />
                        {children}
                    </CssVarsProvider>
                )}
            </StylesProvider>
        </AppThemeContext.Provider>
    );
};

export const useAppTheme = (): ThemeContextType => {
    const context = useContext(AppThemeContext);
    if (!context) {
        throw new Error("useAppTheme must be used within a ThemeProvider");
    }
    return context;
};
