import "./bootstrap";
import "../css/app.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import router from "./routes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayoutProvider } from "@/contexts/DashboardLayoutContext";

const App: React.FC = () => {
    return (
        <React.StrictMode>
            <AuthProvider>
                <ThemeProvider>
                    <DashboardLayoutProvider>
                        <CssBaseline />
                        <ErrorBoundary>
                            <RouterProvider router={router} />
                        </ErrorBoundary>
                    </DashboardLayoutProvider>
                </ThemeProvider>
            </AuthProvider>
        </React.StrictMode>
    );
};

const container = document.getElementById("app");
if (!container) {
    throw new Error("App container not found");
}
const root = createRoot(container);
root.render(<App />);
