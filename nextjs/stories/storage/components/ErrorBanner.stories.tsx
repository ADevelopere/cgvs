import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Typography, Stack } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import { MockStorageProvider } from "../MockStorageProvider";
import ErrorBanner from "@/views/storage/components/ErrorBanner";

type ErrorBannerStoryProps = CommonStoryArgTypesProps & {
    errorType:
        | "network"
        | "auth"
        | "forbidden"
        | "notfound"
        | "timeout"
        | "server"
        | "custom";
    customErrorMessage: string;
    showInContext: boolean;
};

const mockErrorMessages = {
    network: "Network error: Failed to connect to server",
    auth: "Unauthorized access - 401",
    forbidden: "Access forbidden - 403",
    notfound: "Content not found - 404",
    timeout: "Request timeout occurred",
    server: "Internal server error - 500",
    custom: "",
};

const MockErrorBannerWrapper: React.FC<{
    errorType:
        | "network"
        | "auth"
        | "forbidden"
        | "notfound"
        | "timeout"
        | "server"
        | "custom";
    customErrorMessage: string;
    showInContext: boolean;
}> = ({ errorType, customErrorMessage, showInContext }) => {
    const errorMessage =
        errorType === "custom"
            ? customErrorMessage
            : mockErrorMessages[errorType];

    const mockContextValue = {
        items: [],
        loading: false,
        error: showInContext ? errorMessage : undefined,
        selectedPaths: [],
        refresh: async () => {
            // eslint-disable-next-line no-console
            console.log("Refresh clicked");
        },
    };

    return (
        <MockStorageProvider mockValue={mockContextValue}>
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "background.default",
                    color: "text.primary",
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Error Banner Demo
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        {showInContext
                            ? "Error loaded from storage context:"
                            : "Error passed as prop to component:"}
                    </Typography>

                    {/* Standalone usage */}
                    {!showInContext && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Standalone Error Banner
                            </Typography>
                            <ErrorBanner
                                error={errorMessage}
                                onRetry={() => {
                                    // eslint-disable-next-line no-console
                                    console.log("Standalone retry clicked");
                                }}
                            />
                        </Box>
                    )}

                    {/* Context usage */}
                    {showInContext && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Context-driven Error Banner
                            </Typography>
                            <ErrorBanner />
                        </Box>
                    )}

                    {/* Demo info */}
                    <Box
                        sx={{
                            mt: 4,
                            p: 2,
                            backgroundColor: "action.hover",
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            Error Details:
                        </Typography>
                        <Stack spacing={1}>
                            <Typography variant="body2">
                                <strong>Type:</strong> {errorType}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Message:</strong> &quot;{errorMessage}
                                &quot;
                            </Typography>
                            <Typography variant="body2">
                                <strong>Source:</strong>{" "}
                                {showInContext
                                    ? "Storage Context"
                                    : "Component Prop"}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Error type examples */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            All Error Types:
                        </Typography>
                        <Stack spacing={2}>
                            {Object.entries(mockErrorMessages).map(
                                ([type, message]) => (
                                    <Box key={type}>
                                        <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                        >
                                            {type.charAt(0).toUpperCase() +
                                                type.slice(1)}{" "}
                                            Error:
                                        </Typography>
                                        <ErrorBanner
                                            error={message}
                                            onRetry={() => {
                                                // eslint-disable-next-line no-console
                                                console.log(
                                                    `Retry ${type} error`,
                                                );
                                            }}
                                        />
                                    </Box>
                                ),
                            )}
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </MockStorageProvider>
    );
};

export default {
    title: "Storage/Components/ErrorBanner",
    component: MockErrorBannerWrapper,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        errorType: {
            control: { type: "select" },
            options: [
                "network",
                "auth",
                "forbidden",
                "notfound",
                "timeout",
                "server",
                "custom",
            ],
            description: "Type of error to display",
            table: {
                category: "Error",
                order: 1,
            },
        },
        customErrorMessage: {
            control: { type: "text" },
            description:
                "Custom error message (used when errorType is 'custom')",
            table: {
                category: "Error",
                order: 2,
            },
        },
        showInContext: {
            control: { type: "boolean" },
            description:
                "Whether to show error from storage context or as component prop",
            table: {
                category: "Usage",
                order: 1,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Displays error messages with user-friendly text and retry functionality. Automatically maps common error types to localized messages.",
            },
        },
    },
} as Meta;

const Template: StoryFn<ErrorBannerStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockErrorBannerWrapper
                errorType={args.errorType}
                customErrorMessage={args.customErrorMessage}
                showInContext={args.showInContext}
            />
        </AppRouterCacheProvider>
    );
};

export const NetworkError = Template.bind({});
NetworkError.args = {
    ...defaultStoryArgs,
    errorType: "network",
    customErrorMessage: "",
    showInContext: false,
};

export const AuthenticationError = Template.bind({});
AuthenticationError.args = {
    ...defaultStoryArgs,
    errorType: "auth",
    customErrorMessage: "",
    showInContext: false,
};

export const ForbiddenError = Template.bind({});
ForbiddenError.args = {
    ...defaultStoryArgs,
    errorType: "forbidden",
    customErrorMessage: "",
    showInContext: false,
};

export const NotFoundError = Template.bind({});
NotFoundError.args = {
    ...defaultStoryArgs,
    errorType: "notfound",
    customErrorMessage: "",
    showInContext: false,
};

export const TimeoutError = Template.bind({});
TimeoutError.args = {
    ...defaultStoryArgs,
    errorType: "timeout",
    customErrorMessage: "",
    showInContext: false,
};

export const ServerError = Template.bind({});
ServerError.args = {
    ...defaultStoryArgs,
    errorType: "server",
    customErrorMessage: "",
    showInContext: false,
};

export const CustomError = Template.bind({});
CustomError.args = {
    ...defaultStoryArgs,
    errorType: "custom",
    customErrorMessage:
        "Something unexpected happened. Please contact support if this persists.",
    showInContext: false,
};

export const FromStorageContext = Template.bind({});
FromStorageContext.args = {
    ...defaultStoryArgs,
    errorType: "network",
    customErrorMessage: "",
    showInContext: true,
};
