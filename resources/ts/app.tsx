import "./bootstrap";
import "../css/app.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./utils/apollo";
import { AppThemeProvider } from "@/contexts/ThemeContext";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayoutProvider } from "@/contexts/DashboardLayoutContext";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import GraphqlProviders from "./contexts/GraphqlProviders";

const App: React.FC = () => {
    return (
        <React.StrictMode>
            <ErrorBoundary>
                <ApolloProvider client={apolloClient}>
                    <GraphqlProviders>
                        <AuthProvider>
                            <AppThemeProvider>
                                <NotificationsProvider>
                                    <DashboardLayoutProvider>
                                        <RouterProvider router={router} />
                                    </DashboardLayoutProvider>
                                </NotificationsProvider>
                            </AppThemeProvider>
                        </AuthProvider>
                    </GraphqlProviders>
                </ApolloProvider>
            </ErrorBoundary>
        </React.StrictMode>
    );
};

const container = document.getElementById("app");
if (!container) {
    throw new Error("App container not found");
}
const root = createRoot(container);
root.render(<App />);
