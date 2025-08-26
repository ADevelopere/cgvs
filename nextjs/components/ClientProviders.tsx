"use client";

import apolloClient from "@/utils/apollo";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppThemeProvider } from "@/contexts/ThemeContext";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import StorageProvider from "@/contexts/storage/StorageProvider";
import { ApolloProvider } from "@apollo/client/react";

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
        <ApolloProvider client={apolloClient}>
            <AppThemeProvider>
                <AuthProvider>
                    <NotificationsProvider>
                        <StorageProvider>{children}</StorageProvider>
                    </NotificationsProvider>
                </AuthProvider>
            </AppThemeProvider>
        </ApolloProvider>
    );
}
