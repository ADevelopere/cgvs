"use client";

import { ApolloProvider } from "@apollo/client/react/context/ApolloProvider";
import apolloClient from "@/utils/apollo";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppThemeProvider } from "@/contexts/ThemeContext";
import { NotificationsProvider } from "@toolpad/core/useNotifications";

export default function ClientProviders({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ApolloProvider client={apolloClient}>
            <AuthProvider>
                <AppThemeProvider>
                    <NotificationsProvider>{children}</NotificationsProvider>
                </AppThemeProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}
