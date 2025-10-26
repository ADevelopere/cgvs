"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Theme,
  ThemeProvider,
  // Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material/styles"; // Import CssVarsProvider
import { CssBaseline, Box } from "@mui/material";
import {
  ltrLightTheme,
  rtlLightTheme,
  rtlDarkTheme,
  ltrDarkTheme,
} from "@/client/theme";
import ThemeMode from "@/client/theme/ThemeMode";
import { jssPreset, StylesProvider } from "@mui/styles";
import rtl from "jss-rtl";
import { create } from "jss";
import AppLanguage from "@/client/locale/AppLanguage";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { loadFromLocalStorage } from "@/client/utils/localStorage";

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
  // Only access window on the client
  if (typeof window !== "undefined") {
    const initialLanguage = (
      window as unknown as { __INITIAL_LANGUAGE__: string }
    ).__INITIAL_LANGUAGE__;
    return (
      initialLanguage || loadFromLocalStorage("language") || AppLanguage.default
    );
  }
  // On server, return default
  return AppLanguage.default;
};

export function matchMedia(query: string): MediaQueryList | undefined {
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
  ) {
    return window.matchMedia(query);
  }
  return undefined;
}

const getStoredThemeMode = (): ThemeMode => {
  const savedTheme = loadFromLocalStorage("themeMode") as ThemeMode | null;
  if (savedTheme && Object.values(ThemeMode).includes(savedTheme)) {
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
  initialLanguage?: string;
  initialTheme?: ThemeMode;
};

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(ltrLightTheme);
  const [currentThemeMode, setCurrentThemeMode] = useState<ThemeMode>(
    ThemeMode.System
  );
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(
    AppLanguage.default as AppLanguage
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"rtl" | "ltr">(
    "ltr"
  );
  const isInitialized = useRef(false);

  // Effect to set theme and language from client-side storage after mount
  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    const storedMode = getStoredThemeMode();

    updateLanguage(storedLanguage);
    setCurrentLanguage(storedLanguage as AppLanguage);
    setCurrentThemeMode(storedMode);

    const isRtl = storedLanguage === "ar";
    const isDarkMode =
      storedMode === ThemeMode.Dark ||
      (storedMode === ThemeMode.System &&
        matchMedia("(prefers-color-scheme: dark)")?.matches);

    if (isRtl) {
      setCurrentTheme(isDarkMode ? rtlDarkTheme : rtlLightTheme);
    } else {
      setCurrentTheme(isDarkMode ? ltrDarkTheme : ltrLightTheme);
    }

    // Mark as initialized after theme setup is complete
    isInitialized.current = true;
  }, []);

  // Add effect to listen for system theme changes when in system mode
  useEffect(() => {
    if (currentThemeMode === ThemeMode.System) {
      const mediaQuery = matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        const isRtl = currentLanguage === "ar";
        setCurrentTheme(
          isRtl
            ? e.matches
              ? rtlDarkTheme
              : rtlLightTheme
            : e.matches
              ? ltrDarkTheme
              : ltrLightTheme
        );
      };

      mediaQuery?.addEventListener("change", handleChange);
      return () => mediaQuery?.removeEventListener("change", handleChange);
    }
  }, [currentThemeMode, currentLanguage]); // Removed setColorSchemeMode dependency

  const handleSetLanguage = useCallback(
    (newLanguage: string | AppLanguage) => {
      const language = newLanguage as AppLanguage;

      // Set transition direction based on the new language
      setTransitionDirection(language === "ar" ? "rtl" : "ltr");
      setIsTransitioning(true);

      // After 150ms (mid-transition), update the language and theme
      setTimeout(() => {
        updateLanguage(language);
        setCurrentLanguage(language);

        const isRtl = language === "ar";
        const isDarkMode =
          currentThemeMode === ThemeMode.Dark ||
          (currentThemeMode === ThemeMode.System &&
            matchMedia("(prefers-color-scheme: dark)")?.matches);

        setCurrentTheme(
          isRtl
            ? isDarkMode
              ? rtlDarkTheme
              : rtlLightTheme
            : isDarkMode
              ? ltrDarkTheme
              : ltrLightTheme
        );
      }, 150);

      // After 300ms (end of transition), reset transitioning state
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    },
    [currentThemeMode]
  );

  const handleSetThemeMode = useCallback(
    (newMode: ThemeMode) => {
      updateTheme(newMode);
      setCurrentThemeMode(newMode);

      const effectiveMode =
        newMode === ThemeMode.System
          ? matchMedia("(prefers-color-scheme: dark)")?.matches
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
            : ltrLightTheme
      );
    },
    [currentLanguage]
  ); // Removed setColorSchemeMode dependency

  const isRtl = useMemo(() => currentLanguage === "ar", [currentLanguage]);
  const isDark = useMemo(() => {
    if (currentThemeMode === ThemeMode.System) {
      return matchMedia("(prefers-color-scheme: dark)")?.matches ?? false;
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
    ]
  );

  // Don't render children until theme initialization is complete
  // This prevents race conditions with useStoryTheme in Storybook
  if (!isInitialized.current) {
    return null;
  }

  return (
    <AppThemeContext.Provider value={contextValue}>
      <StylesProvider jss={jss}>
        <CacheProvider value={cacheRtl}>
          {/* Use CssVarsProvider instead of MuiThemeProvider */}
          {/* <CssVarsProvider theme={currentTheme}> */}
          <ThemeProvider theme={currentTheme}>
            <CssBaseline enableColorScheme /> {/* Add enableColorScheme prop */}
            <Box
              sx={{
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning
                  ? transitionDirection === "rtl"
                    ? "translateX(20px)"
                    : "translateX(-20px)"
                  : "translateX(0)",
                transition:
                  "opacity 300ms ease-in-out, transform 300ms ease-in-out",
              }}
            >
              {children}
            </Box>
          </ThemeProvider>
          {/* </CssVarsProvider> */}
        </CacheProvider>
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
