import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Typography, Button, Stack, useTheme } from "@mui/material";
import {
    CloudUpload as UploadIcon,
    ArrowUpward as ArrowUpIcon,
    FolderOpen as FolderOpenIcon,
} from "@mui/icons-material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import { MockStorageProvider } from "../MockStorageProvider";
import useAppTranslation from "@/locale/useAppTranslation";

type EmptyStateStoryProps = CommonStoryArgTypesProps & {
    canUpload: boolean;
    isAtRoot: boolean;
    hasError: boolean;
};

// Mock EmptyState component that uses args directly instead of hooks
const MockEmptyState: React.FC<{
    canUpload: boolean;
    isAtRoot: boolean;
}> = ({ canUpload, isAtRoot }) => {
    const theme = useTheme();
    const translations = useAppTranslation("storageTranslations");

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        // eslint-disable-next-line no-console
        console.log(
            "Upload started with files:",
            files.map((f) => f.name),
        );
        event.target.value = "";
    };

    const handleGoUp = () => {
        // eslint-disable-next-line no-console
        console.log("Go up clicked");
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
                textAlign: "center",
                p: 4,
                color: "text.secondary",
            }}
        >
            {/* Icon */}
            <FolderOpenIcon
                sx={{
                    fontSize: 120,
                    color: theme.palette.grey[300],
                    mb: 2,
                }}
            />

            {/* Title */}
            <Typography variant="h5" fontWeight={600} gutterBottom>
                {isAtRoot
                    ? translations.noFilesYet || "No files yet"
                    : translations.thisFolderIsEmpty || "This folder is empty"}
            </Typography>

            {/* Description */}
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 400 }}
            >
                {isAtRoot
                    ? translations.chooseStorageLocation ||
                      "Choose a storage location to get started"
                    : canUpload
                      ? translations.emptyFolderGetStarted ||
                        "Upload files to get started"
                      : translations.emptyFolder ||
                        "This folder contains no files"}
            </Typography>

            {/* Actions */}
            <Stack direction="row" spacing={2} alignItems="center">
                {/* Upload Button - only show if upload is allowed */}
                {canUpload && (
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<UploadIcon />}
                        component="label"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                        }}
                    >
                        {translations.uploadFiles || "Upload Files"}
                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleFileUpload}
                        />
                    </Button>
                )}

                {/* Go Up Button (only for non-root directories) */}
                {!isAtRoot && (
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<ArrowUpIcon />}
                        onClick={handleGoUp}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                        }}
                    >
                        {translations.goUp || "Go Up"}
                    </Button>
                )}
            </Stack>

            {/* Additional Help Text */}
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 3, maxWidth: 500 }}
            >
                {translations.dragAndDropHelpText ||
                    "Tip: You can also drag and drop files directly onto this area"}
            </Typography>
        </Box>
    );
};

const MockEmptyStateWrapper: React.FC<{
    canUpload: boolean;
    isAtRoot: boolean;
    hasError: boolean;
}> = ({ canUpload, isAtRoot, hasError }) => {
    // Mock the storage context
    const mockContextValue = {
        items: [],
        loading: false,
        error: hasError ? "Failed to load storage items" : undefined,
        selectedPaths: [],
        goUp: () => {
            // eslint-disable-next-line no-console
            console.log("Go up clicked");
        },
        startUpload: async (files: File[]) => {
            // eslint-disable-next-line no-console
            console.log(
                "Upload started with files:",
                files.map((f) => f.name),
            );
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
                <MockEmptyState canUpload={canUpload} isAtRoot={isAtRoot} />
            </Box>
        </MockStorageProvider>
    );
};

export default {
    title: "Storage/Components/EmptyState",
    component: MockEmptyStateWrapper,
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
        hasError: {
            control: { type: "boolean" },
            description: "Whether there's an error state",
            table: {
                category: "State",
                order: 1,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Empty state shown when a storage location has no files. Displays different content based on whether user is at root or in a specific folder, and whether uploads are allowed.",
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
                hasError={args.hasError}
            />
        </AppRouterCacheProvider>
    );
};

export const RootWithUpload = Template.bind({});
RootWithUpload.args = {
    ...defaultStoryArgs,
    canUpload: true,
    isAtRoot: true,
    hasError: false,
};

export const RootNoUpload = Template.bind({});
RootNoUpload.args = {
    ...defaultStoryArgs,
    canUpload: false,
    isAtRoot: true,
    hasError: false,
};

export const FolderWithUpload = Template.bind({});
FolderWithUpload.args = {
    ...defaultStoryArgs,
    canUpload: true,
    isAtRoot: false,
    hasError: false,
};

export const FolderNoUpload = Template.bind({});
FolderNoUpload.args = {
    ...defaultStoryArgs,
    canUpload: false,
    isAtRoot: false,
    hasError: false,
};

export const WithError = Template.bind({});
WithError.args = {
    ...defaultStoryArgs,
    canUpload: true,
    isAtRoot: false,
    hasError: true,
};
