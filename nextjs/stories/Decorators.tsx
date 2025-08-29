/* eslint-disable @next/next/no-page-custom-font */
import { AppThemeProvider } from "@/contexts/ThemeContext";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import React from "react";

const withGlobalStyles = (Story: React.ComponentType) => {
    return (
        <>
            <link
                href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined&display=optional"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL@20..48,100..700,0..1&display=optional"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL@20..48,100..700,0..1&display=optional"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL@20..48,100..700,0..1&display=optional"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap&display=optional"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap&display=optional"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap&display=optional"
                rel="stylesheet"
            />

            <AppThemeProvider>
                <NotificationsProvider>
                    {" "}
                    <Story />
                </NotificationsProvider>
            </AppThemeProvider>
        </>
    );
};

export default withGlobalStyles;
