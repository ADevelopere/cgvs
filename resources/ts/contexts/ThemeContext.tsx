import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
    useMemo,
} from "react";
import { ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";
import { createAppTheme } from "@/theme";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
    mode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    theme: Theme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): ThemeMode => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        return savedTheme;
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "system";
    }
    return "system";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>(getInitialTheme);
    const [theme, setTheme] = useState<Theme>(() => createAppTheme(mode));

    useEffect(() => {
        localStorage.setItem("theme", mode);
    }, [mode]);

    const setThemeMode = useCallback((newMode: ThemeMode) => {
        setMode(newMode);
        setTheme(createAppTheme(newMode));
        console.log("Theme mode changed:", newMode);
    }, []);


    const contextValue = useMemo(() => ({ mode, setThemeMode, theme }), [mode, setThemeMode]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useAppTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useAppTheme must be used within a ThemeProvider");
    }
    return context;
};
