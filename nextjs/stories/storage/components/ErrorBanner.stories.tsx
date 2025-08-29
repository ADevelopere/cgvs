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
import ErrorBanner, {
    ErrorBannerProps,
} from "@/views/storage/components/ErrorBanner";

type ErrorBannerStoryProps = CommonStoryArgTypesProps & {
    errorType:
        | "network"
        | "auth"
        | "forbidden"
        | "notfound"
        | "timeout"
        | "server"
        | "custom"
        | "none";
    customErrorMessage: string;
    showRetryAction: boolean;
};

const mockErrorMessages = {
    network: "Network error: Failed to connect to server",
    auth: "Unauthorized access - 401",
    forbidden: "Access forbidden - 403",
    notfound: "Content not found - 404",
    timeout: "Request timeout occurred",
    server: "Internal server error - 500",
    custom: "",
    none: "",
};

const MockErrorBannerWrapper: React.FC<{
    errorType:
        | "network"
        | "auth"
        | "forbidden"
        | "notfound"
        | "timeout"
        | "server"
        | "custom"
        | "none";
    customErrorMessage: string;
    showRetryAction: boolean;
}> = ({ errorType, customErrorMessage, showRetryAction }) => {
    const errorMessage =
        errorType === "custom"
            ? customErrorMessage
            : errorType === "none"
              ? undefined
              : mockErrorMessages[errorType];

    const handleRetry = () => {
        // eslint-disable-next-line no-console
        console.log("Retry clicked for error:", errorType);
    };

    const errorBannerProps: ErrorBannerProps = {
        error: errorMessage,
        onRetry: showRetryAction ? handleRetry : undefined,
    };

    return (
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
                    Testing different error types and retry functionality.
                </Typography>

                {/* Main Error Banner */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Current Error Banner
                    </Typography>
                    <ErrorBanner {...errorBannerProps} />

                    {!errorMessage && (
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: "success.light",
                                color: "success.contrastText",
                                borderRadius: 1,
                                mt: 2,
                            }}
                        >
                            <Typography variant="body2">
                                ✅ No error - ErrorBanner is hidden when error
                                is undefined
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Demo info */}
                {errorMessage && (
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
                                <strong>Retry Action:</strong>{" "}
                                {showRetryAction ? "Enabled" : "Disabled"}
                            </Typography>
                        </Stack>
                    </Box>
                )}

                {/* All Error Types Examples */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        All Error Types Examples:
                    </Typography>
                    <Stack spacing={2}>
                        {Object.entries(mockErrorMessages)
                            .filter(
                                ([type]) =>
                                    type !== "custom" && type !== "none",
                            )
                            .map(([type, message]) => (
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
                                                `Example retry for ${type} error`,
                                            );
                                        }}
                                    />
                                </Box>
                            ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default {
    title: "Storage/Components/ErrorBanner",
    component: ErrorBanner,
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
                "none",
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
        showRetryAction: {
            control: { type: "boolean" },
            description: "Whether to show the retry button",
            table: {
                category: "Actions",
                order: 1,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Displays error messages with user-friendly text and retry functionality. Automatically maps common error types to localized messages. Now uses props for better testability.",
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
                showRetryAction={args.showRetryAction}
            />
        </AppRouterCacheProvider>
    );
};

export const NetworkError = Template.bind({});
NetworkError.args = {
    ...defaultStoryArgs,
    errorType: "network",
    customErrorMessage: "",
    showRetryAction: true,
};

export const AuthenticationError = Template.bind({});
AuthenticationError.args = {
    ...defaultStoryArgs,
    errorType: "auth",
    customErrorMessage: "",
    showRetryAction: true,
};

export const ForbiddenError = Template.bind({});
ForbiddenError.args = {
    ...defaultStoryArgs,
    errorType: "forbidden",
    customErrorMessage: "",
    showRetryAction: true,
};

export const NotFoundError = Template.bind({});
NotFoundError.args = {
    ...defaultStoryArgs,
    errorType: "notfound",
    customErrorMessage: "",
    showRetryAction: true,
};

export const TimeoutError = Template.bind({});
TimeoutError.args = {
    ...defaultStoryArgs,
    errorType: "timeout",
    customErrorMessage: "",
    showRetryAction: true,
};

export const ServerError = Template.bind({});
ServerError.args = {
    ...defaultStoryArgs,
    errorType: "server",
    customErrorMessage: "",
    showRetryAction: true,
};

export const CustomError = Template.bind({});
CustomError.args = {
    ...defaultStoryArgs,
    errorType: "custom",
    customErrorMessage:
        "Something unexpected happened. Please contact support if this persists.",
    showRetryAction: true,
};

export const NoError = Template.bind({});
NoError.args = {
    ...defaultStoryArgs,
    errorType: "none",
    customErrorMessage: "",
    showRetryAction: true,
};

export const WithoutRetryAction = Template.bind({});
WithoutRetryAction.args = {
    ...defaultStoryArgs,
    errorType: "network",
    customErrorMessage: "",
    showRetryAction: false,
};
