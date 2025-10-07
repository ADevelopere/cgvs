import React, { createContext, useContext, useMemo } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/client/stories/Decorators";
import { Box, Toolbar, IconButton, Tooltip, useTheme } from "@mui/material";
import { Wifi, WifiOff, Sync } from "@mui/icons-material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/client/stories/argTypes";
import AppRouterCacheProvider from "@/client/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/client/stories/useStoryTheme";
import { NetworkConnectivityContextType } from "@/client/contexts/AppApolloProvider";
import useAppTranslation from "@/client/locale/useAppTranslation";
import {ConnectivityTranslations} from "@/client/locale/components";

// Mock NetworkConnectivityContext
const MockNetworkConnectivityContext = createContext<
    NetworkConnectivityContextType | undefined
>(undefined);

// Mock Provider Component
const MockNetworkConnectivityProvider: React.FC<{
    children: React.ReactNode;
    isConnected: boolean;
    isChecking: boolean;
    lastChecked?: string;
}> = ({ children, isConnected, isChecking, lastChecked }) => {
    const contextValue = useMemo(
        (): NetworkConnectivityContextType => ({
            isConnected,
            isChecking,
            lastChecked: lastChecked ? new Date(lastChecked) : null,
            checkConnectivity: async () => {
                // eslint-disable-next-line no-console
                console.log("Mock connectivity check triggered");
                return isConnected;
            },
            setConnected: (connected: boolean) => {
                // eslint-disable-next-line no-console
                console.log("Mock setConnected called with:", connected);
            },
            notifyIfDisconnected: () => {
                // eslint-disable-next-line no-console
                console.log("Mock notifyIfDisconnected called");
            },
            authToken: null,
            updateAuthToken: (token: string) => {
                // eslint-disable-next-line no-console
                console.log("Mock updateAuthToken called with:", token);
            },
            clearAuthData: () => {
                // eslint-disable-next-line no-console
                console.log("Mock clearAuthToken called");
            },
        }),
        [isConnected, isChecking, lastChecked],
    );

    return (
        <MockNetworkConnectivityContext.Provider value={contextValue}>
            {children}
        </MockNetworkConnectivityContext.Provider>
    );
};

// Custom hook that uses our mock context instead of the real one
const useMockNetworkConnectivity = (): NetworkConnectivityContextType => {
    const context = useContext(MockNetworkConnectivityContext);
    if (!context) {
        throw new Error(
            "useMockNetworkConnectivity must be used within a MockNetworkConnectivityProvider",
        );
    }
    return context;
};

// Recreate the ConnectivityStatus component but using our mock hook
const MockedConnectivityStatus: React.FC = () => {
    const { isConnected, isChecking, checkConnectivity, lastChecked } =
        useMockNetworkConnectivity();
    const theme = useTheme();
    const strings: ConnectivityTranslations = useAppTranslation(
        "connectivityTranslations",
    );

    const getColor = () => {
        if (isChecking) return theme.palette.warning.main;
        return isConnected
            ? theme.palette.success.main
            : theme.palette.error.main;
    };

    const getTooltipText = () => {
        if (isChecking) return strings.checkingConnection;
        if (isConnected) {
            const baseText = strings.connected;
            return lastChecked
                ? `${baseText} (${strings.lastChecked}: ${lastChecked.toLocaleTimeString()})`
                : baseText;
        }
        return `${strings.disconnected} - ${strings.clickToRetry}`;
    };

    const getIcon = () => {
        if (isChecking) return <Sync />;
        return isConnected ? <Wifi /> : <WifiOff />;
    };

    return (
        <Tooltip title={getTooltipText()}>
            <IconButton
                onClick={checkConnectivity}
                disabled={isChecking}
                sx={{
                    color: getColor(),
                    animation: isChecking ? "spin 1s linear infinite" : "none",
                    transition: "color 0.3s ease",
                    "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                    },
                    "&:hover": {
                        backgroundColor: `${getColor()}15`, // 15% opacity
                    },
                }}
                size="medium"
            >
                {getIcon()}
            </IconButton>
        </Tooltip>
    );
};

type ConnectivityStatusStoryProps = CommonStoryArgTypesProps & {
    isConnected: boolean;
    isChecking: boolean;
    lastChecked?: string;
};

export default {
    title: "Components/Common/ConnectivityStatus/ConnectivityStatus",
    component: MockedConnectivityStatus,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        isConnected: {
            control: { type: "boolean" },
            description: "Whether the app is connected to the server",
            table: {
                category: "Connectivity",
                order: 1,
            },
        },
        isChecking: {
            control: { type: "boolean" },
            description: "Whether a connectivity check is in progress",
            table: {
                category: "Connectivity",
                order: 2,
            },
        },
        lastChecked: {
            control: { type: "text" },
            description:
                "ISO string of when connectivity was last checked (optional)",
            table: {
                category: "Connectivity",
                order: 3,
            },
        },
    },
} as Meta;

const Template: StoryFn<ConnectivityStatusStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockNetworkConnectivityProvider
                isConnected={args.isConnected}
                isChecking={args.isChecking}
                lastChecked={args.lastChecked}
            >
                <Box
                    sx={{
                        height: "100vh",
                        backgroundColor: "background.default",
                        color: "onBackground",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Toolbar
                        sx={{
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            borderRadius: 1,
                            gap: 2,
                        }}
                    >
                        <Box>
                            Connectivity Status (Approach 1 - Mock Context):
                        </Box>
                        <MockedConnectivityStatus />
                    </Toolbar>
                </Box>
            </MockNetworkConnectivityProvider>
        </AppRouterCacheProvider>
    );
};

export const Connected = Template.bind({});
Connected.args = {
    ...defaultStoryArgs,
    isConnected: true,
    isChecking: false,
    lastChecked: new Date().toISOString(),
};

export const Disconnected = Template.bind({});
Disconnected.args = {
    ...defaultStoryArgs,
    isConnected: false,
    isChecking: false,
};

export const Checking = Template.bind({});
Checking.args = {
    ...defaultStoryArgs,
    isConnected: false,
    isChecking: true,
};
