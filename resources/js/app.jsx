import "./bootstrap";
import "../css/app.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React, { useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import createAppTheme from "./theme";
import store from "./store";
import router from "./routes";
import { checkAuth } from "./store/authSlice";
import { selectTheme } from "./store/themeSlice";
import ErrorBoundary from "./components/common/ErrorBoundary";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return (
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>
    );
};

const ThemedApp = () => {
    const themeMode = useSelector(selectTheme);

    // Listen for system theme changes
    useEffect(() => {
        if (themeMode === "system") {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            const handleChange = () => {
                // Force a re-render by updating a state
                dispatch({ type: "theme/systemThemeChanged" });
            };
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [themeMode]);

    const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
};

const Root = () => (
    <React.StrictMode>
        <Provider store={store}>
            <ThemedApp />
        </Provider>
    </React.StrictMode>
);

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<Root />);
