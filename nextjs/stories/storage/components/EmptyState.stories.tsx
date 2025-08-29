import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Typography, Alert } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import EmptyState, {
    EmptyStateProps,
} from "@/views/storage/components/EmptyState";

type EmptyStateStoryProps = CommonStoryArgTypesProps & {
    canUpload: boolean;
    isAtRoot: boolean;
    simulateUploadError: boolean;
};

const MockEmptyStateWrapper: React.FC<{
    canUpload: boolean;
    isAtRoot: boolean;
    simulateUploadError: boolean;
}> = ({ canUpload, isAtRoot, simulateUploadError }) => {
    const handleGoUp = () => {
        // eslint-disable-next-line no-console
        console.log("Go up clicked");
    };

    const handleUpload = async (files: File[]): Promise<void> => {
        // eslint-disable-next-line no-console
        console.log(
            "Upload started with files:",
            files.map((f) => f.name),
        );

        if (simulateUploadError) {
            // eslint-disable-next-line no-console
            console.error("Simulated upload error");
            throw new Error("Simulated upload error");
        }

        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // eslint-disable-next-line no-console
        console.log("Upload completed successfully");
    };

    const emptyStateProps: EmptyStateProps = {
        canUpload,
        isAtRoot,
        onGoUp: !isAtRoot ? handleGoUp : undefined,
        onUpload: canUpload ? handleUpload : undefined,
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
                    Empty State Demo
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Testing different combinations of location and upload
                    permissions.
                </Typography>

                {/* Config Info */}
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                        <strong>Current Configuration:</strong>
                        <br />• Location:{" "}
                        {isAtRoot
                            ? "Root (storage locations)"
                            : "Inside a folder"}
                        <br />• Upload Allowed: {canUpload ? "Yes" : "No"}
                        <br />• Upload Error Mode:{" "}
                        {simulateUploadError ? "Enabled" : "Disabled"}
                    </Typography>
                </Alert>
            </Box>

            {/* The EmptyState component */}
            <EmptyState {...emptyStateProps} />
        </Box>
    );
};

export default {
    title: "Storage/Components/EmptyState",
    component: EmptyState,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        canUpload: {
            control: { type: "boolean" },
            description: "Whether uploads are allowed in current location",
            table: {
                category: "Location",
                order: 1,
            },
        },
        isAtRoot: {
            control: { type: "boolean" },
            description: "Whether user is at the root storage locations view",
            table: {
                category: "Location",
                order: 2,
            },
        },
        simulateUploadError: {
            control: { type: "boolean" },
            description: "Whether to simulate upload errors for testing",
            table: {
                category: "Testing",
                order: 1,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Empty state shown when a storage location has no files. Displays different content and actions based on whether user is at root or in a specific folder, and whether uploads are allowed. Now uses props for better testability.",
            },
        },
    },
} as Meta;

const Template: StoryFn<EmptyStateStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockEmptyStateWrapper
                canUpload={args.canUpload}
                isAtRoot={args.isAtRoot}
                simulateUploadError={args.simulateUploadError}
            />
        </AppRouterCacheProvider>
    );
};

export const RootWithUpload = Template.bind({});
RootWithUpload.args = {
    ...defaultStoryArgs,
    canUpload: true,
    isAtRoot: true,
    simulateUploadError: false,
};

export const RootNoUpload = Template.bind({});
RootNoUpload.args = {
    ...defaultStoryArgs,
    canUpload: false,
    isAtRoot: true,
    simulateUploadError: false,
};

export const FolderWithUpload = Template.bind({});
FolderWithUpload.args = {
    ...defaultStoryArgs,
    canUpload: true,
    isAtRoot: false,
    simulateUploadError: false,
};

export const FolderNoUpload = Template.bind({});
FolderNoUpload.args = {
    ...defaultStoryArgs,
    canUpload: false,
    isAtRoot: false,
    simulateUploadError: false,
};

export const WithUploadError = Template.bind({});
WithUploadError.args = {
    ...defaultStoryArgs,
    canUpload: true,
    isAtRoot: false,
    simulateUploadError: true,
};
