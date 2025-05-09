import React, { ErrorInfo } from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import AppLanguage from "@/locale/AppLanguage";
import ThemeMode from "@/theme/ThemeMode";
import { createAppTheme } from "@/theme";
import translations from "@/locale/translations";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    themeMode: ThemeMode;
    language: AppLanguage;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const storedThemeMode =
            (localStorage.getItem("themeMode") as ThemeMode) || ThemeMode.Dark;
        const storedLanguage =
            (localStorage.getItem("language") as AppLanguage) ||
            AppLanguage.default;

        this.state = {
            hasError: false,
            error: null,
            themeMode: storedThemeMode,
            language: storedLanguage,
        };
    }

    componentDidMount() {
        // Listen for storage events
        window.addEventListener("storage", this.handleStorageChange);
        window.addEventListener("languageChange", this.handleStorageChange);
        window.addEventListener("themeModeChange", this.handleStorageChange);
    }

    componentWillUnmount() {
        // Clean up event listeners
        window.removeEventListener("storage", this.handleStorageChange);
        window.removeEventListener("languageChange", this.handleStorageChange);
        window.removeEventListener("themeModeChange", this.handleStorageChange);
    }

    handleStorageChange = () => {
        const storedThemeMode =
            (localStorage.getItem("themeMode") as ThemeMode) || ThemeMode.Dark;
        const storedLanguage =
            (localStorage.getItem("language") as AppLanguage) ||
            AppLanguage.default;

        this.setState({
            themeMode: storedThemeMode,
            language: storedLanguage,
        });
    };

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error("Error caught by boundary:", error, info);
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            const direction = this.state.language === "ar" ? "rtl" : "ltr";
            const theme = createAppTheme(this.state.themeMode, direction);
            const ts =
                translations[this.state.language]?.errorTranslations ||
                translations[AppLanguage.default].errorTranslations;

            return (
                <Container
                    maxWidth="sm"
                    sx={{
                        bgcolor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                    }}
                >
                    <Box sx={{ mt: 8, mb: 4 }}>
                        <Paper
                            sx={{
                                p: 4,
                                bgcolor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h1"
                                gutterBottom
                                color="error"
                            >
                                {ts.componentError}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                component="p"
                            >
                                {this.state.error?.message || ts.unexpectedError}
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<RefreshIcon />}
                                onClick={() => {
                                    this.setState({ hasError: false });
                                    window.location.reload();
                                }}
                                sx={{
                                    mt: 2,
                                    bgcolor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    "&:hover": {
                                        bgcolor: theme.palette.primary.dark,
                                    },
                                }}
                            >
                                {ts.retry}
                            </Button>
                        </Paper>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
