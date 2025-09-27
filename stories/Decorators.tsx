import { AppThemeProvider } from "@/contexts/ThemeContext";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import React from "react";

const withGlobalStyles = (Story: React.ComponentType) => {
    return (
        <AppThemeProvider>
            <NotificationsProvider>
                {" "}
                <Story />
            </NotificationsProvider>
        </AppThemeProvider>
    );
};

export default withGlobalStyles;
