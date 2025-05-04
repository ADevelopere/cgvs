import { Theme, ThemeOptions } from "@mui/material/styles";
import { createTheme, PaletteMode } from "@mui/material";

const getThemeConfig = (mode: PaletteMode): ThemeOptions => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                  // Light mode palette
                  primary: {
                      main: "#1976d2",
                  },
                  secondary: {
                      main: "#dc004e",
                  },
                  background: {
                      default: "#f5f5f5",
                      paper: "#ffffff",
                  },
              }
            : {
                  // Dark mode palette
                  primary: {
                      main: "#90caf9",
                  },
                  secondary: {
                      main: "#f48fb1",
                  },
                  background: {
                      default: "#121212",
                      paper: "#1e1e1e",
                  },
              }),
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow:
                        mode === "light"
                            ? "0 1px 3px rgba(0,0,0,0.12)"
                            : "0 1px 3px rgba(255,255,255,0.12)",
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                "input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active":
                    {
                        transitionDelay: "5000s",
                    },

                "*::-webkit-scrollbar": {
                    width: "8px",
                    backgroundColor: "transparent",
                },
                "*::-webkit-scrollbar-track": {
                    background:
                        mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.05)",
                    borderRadius: "8px",
                    margin: "8px 0",
                },
                "*::-webkit-scrollbar-thumb": {
                    background:
                        mode === "dark"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                    border:
                        mode === "dark"
                            ? "2px solid rgba(30, 30, 30, 0.9)"
                            : "2px solid rgba(255, 255, 255, 0.9)",
                },
                "*::-webkit-scrollbar-thumb:hover": {
                    background:
                        mode === "dark"
                            ? "rgba(255, 255, 255, 0.3)"
                            : "rgba(0, 0, 0, 0.3)",
                },
                "*": {
                    scrollbarWidth: "thin",
                    scrollbarColor:
                        mode === "dark"
                            ? "rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)",
                },
            },
        },
    },
});

export const createAppTheme = (mode: "light" | "dark" | "system"): Theme => {
    let effectiveMode: PaletteMode = mode as PaletteMode;
    if (mode === "system") {
        effectiveMode = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
    }
    return createTheme({
        colorSchemes: { light: true, dark: true },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 600,
                lg: 1200,
                xl: 1536,
            },
        },
        ...getThemeConfig(effectiveMode),
    });
};
