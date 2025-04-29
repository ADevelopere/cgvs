import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import createAppTheme from "@/theme";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
    mode: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
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

    useEffect(() => {
        localStorage.setItem("theme", mode);
    }, [mode]);

    const setTheme = (newMode: ThemeMode) => {
        setMode(newMode);
    };

    return (
        <ThemeContext.Provider value={{ mode, setTheme }}>
            <MuiThemeProvider theme={createAppTheme(mode)}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
