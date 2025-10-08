"use client";

import { AppThemeProvider } from "@/client/contexts/ThemeContext";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { AppApolloProvider } from "@/client/contexts";
import { AuthProvider } from "@/client/contexts/AuthContext";

if (process.env.NODE_ENV !== "production") {
    // Adds messages only in a development environment
    loadDevMessages();
    loadErrorMessages();
}

export default function ClientProviders({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AppThemeProvider>
            <NotificationsProvider>
                <AppApolloProvider>
                    <AuthProvider>{children}</AuthProvider>
                </AppApolloProvider>
            </NotificationsProvider>
        </AppThemeProvider>
    );
}
