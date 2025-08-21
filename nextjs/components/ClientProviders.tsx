"use client";

import { ApolloProvider } from "@apollo/client/react/context/ApolloProvider";
import apolloClient from "@/utils/apollo";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppThemeProvider } from "@/contexts/ThemeContext";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import StorageProvider from "@/contexts/storage/StorageProvider";

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
            <AuthProvider>
                <AppThemeProvider>
                    <NotificationsProvider>
                        <StorageProvider>{children}</StorageProvider>
                    </NotificationsProvider>
                </AppThemeProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}
