import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import {
    Box,
    Breadcrumbs,
    Typography,
    IconButton,
    Link,
    Chip,
} from "@mui/material";
import {
    ArrowUpward as ArrowUpIcon,
    NavigateNext as NavigateNextIcon,
    Folder as FolderIcon,
    Storage as StorageIcon,
} from "@mui/icons-material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import {
    MockStorageProvider,
    createMockQueryParams,
} from "../MockStorageProvider";
import useAppTranslation from "@/locale/useAppTranslation";

type BreadcrumbsStoryProps = CommonStoryArgTypesProps & {
    currentPath: string;
    showUpButton: boolean;
    locationLabel: string;
};

// Mock StorageBreadcrumbs component that uses args directly
const MockStorageBreadcrumbs: React.FC<{
    currentPath: string;
    showUpButton: boolean;
    locationLabel: string;
}> = ({ currentPath, showUpButton, locationLabel }) => {
    const translations = useAppTranslation("storageTranslations");

    const pathParts = currentPath ? currentPath.split("/").filter(Boolean) : [];

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            // eslint-disable-next-line no-console
            console.log("Navigate to root storage locations");
        } else {
            const targetPath = pathParts.slice(0, index + 1).join("/");
            // eslint-disable-next-line no-console
            console.log("Navigate to:", targetPath);
        }
    };

    const handleGoUp = () => {
        // eslint-disable-next-line no-console
        console.log("Go up one level");
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 2,
                backgroundColor: "background.paper",
                borderBottom: 1,
                borderColor: "divider",
            }}
        >
            {/* Go Up Button */}
            {showUpButton && pathParts.length > 0 && (
                <IconButton
                    onClick={handleGoUp}
                    size="small"
                    sx={{
                        mr: 1,
                        backgroundColor: "action.hover",
                        "&:hover": {
                            backgroundColor: "action.selected",
                        },
                    }}
                    title={translations.goUpOneLevel || "Go up one level"}
                >
                    <ArrowUpIcon />
                </IconButton>
            )}

            {/* Breadcrumb Navigation */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label={
                    translations.breadcrumbNavigation || "Breadcrumb navigation"
                }
                sx={{ flex: 1 }}
            >
                {/* Root/Home */}
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => handleBreadcrumbClick(-1)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        textDecoration: "none",
                        color: "primary.main",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                    }}
                >
                    <StorageIcon fontSize="small" />
                    {translations.storageLocations || "Storage Locations"}
                </Link>

                {/* Path segments */}
                {pathParts.map((part, index) => {
                    const isLast = index === pathParts.length - 1;
                    const isFirstSegment = index === 0;
                    const key = pathParts.slice(0, index + 1).join("/") || part;

                    if (isLast) {
                        // Current folder - not clickable
                        return (
                            <Chip
                                key={key}
                                icon={<FolderIcon />}
                                label={isFirstSegment ? locationLabel : part}
                                size="small"
                                variant="filled"
                                color="primary"
                                sx={{
                                    "& .MuiChip-label": {
                                        fontWeight: 600,
                                    },
                                }}
                            />
                        );
                    }

                    // Parent folders - clickable
                    return (
                        <Link
                            key={key}
                            component="button"
                            variant="body2"
                            onClick={() => handleBreadcrumbClick(index)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                textDecoration: "none",
                                color: "text.primary",
                                "&:hover": {
                                    textDecoration: "underline",
                                    color: "primary.main",
                                },
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            <FolderIcon fontSize="small" />
                            {isFirstSegment ? locationLabel : part}
                        </Link>
                    );
                })}
            </Breadcrumbs>

            {/* Current Path Info */}
            {pathParts.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                    {translations.chooseStorageLocationBreadcrumb ||
                        "Choose a storage location"}
                </Typography>
            )}
        </Box>
    );
};

const MockBreadcrumbsWrapper: React.FC<{
    currentPath: string;
    showUpButton: boolean;
    locationLabel: string;
}> = ({ currentPath, showUpButton, locationLabel }) => {
    const mockContextValue = {
        items: [],
        loading: false,
        error: undefined,
        selectedPaths: [],
        params: createMockQueryParams({ path: currentPath }),
        navigateTo: (path: string) => {
            // eslint-disable-next-line no-console
            console.log("Navigate to:", path);
        },
        goUp: () => {
            // eslint-disable-next-line no-console
            console.log("Go up clicked");
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
                <MockStorageBreadcrumbs
                    currentPath={currentPath}
                    showUpButton={showUpButton}
                    locationLabel={locationLabel}
                />

                {/* Demo content below */}
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Current Path: &quot;{currentPath || "(root)"}&quot;
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Click on breadcrumb segments to navigate. The up arrow
                        button appears when not at root.
                    </Typography>
                </Box>
            </Box>
        </MockStorageProvider>
    );
};

export default {
    title: "Storage/Components/StorageBreadcrumbs",
    component: MockBreadcrumbsWrapper,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        currentPath: {
            control: { type: "text" },
            description: "Current path in the storage system",
            table: {
                category: "Navigation",
                order: 1,
            },
        },
        showUpButton: {
            control: { type: "boolean" },
            description: "Whether to show the up navigation button",
            table: {
                category: "Navigation",
                order: 2,
            },
        },
        locationLabel: {
            control: { type: "text" },
            description: "Label for the storage location (first segment)",
            table: {
                category: "Navigation",
                order: 3,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Breadcrumb navigation for storage locations. Shows the current path and allows navigation to parent directories.",
            },
        },
    },
} as Meta;

const Template: StoryFn<BreadcrumbsStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockBreadcrumbsWrapper
                currentPath={args.currentPath}
                showUpButton={args.showUpButton}
                locationLabel={args.locationLabel}
            />
        </AppRouterCacheProvider>
    );
};

export const Root = Template.bind({});
Root.args = {
    ...defaultStoryArgs,
    currentPath: "",
    showUpButton: true,
    locationLabel: "Template Covers",
};

export const SingleLevel = Template.bind({});
SingleLevel.args = {
    ...defaultStoryArgs,
    currentPath: "templateCovers",
    showUpButton: true,
    locationLabel: "Template Covers",
};

export const DeepPath = Template.bind({});
DeepPath.args = {
    ...defaultStoryArgs,
    currentPath: "templateCovers/categories/business/logos",
    showUpButton: true,
    locationLabel: "Template Covers",
};

export const VeryDeepPath = Template.bind({});
VeryDeepPath.args = {
    ...defaultStoryArgs,
    currentPath:
        "templateCovers/categories/business/logos/tech/startups/modern",
    showUpButton: true,
    locationLabel: "Template Covers",
};

export const NoUpButton = Template.bind({});
NoUpButton.args = {
    ...defaultStoryArgs,
    currentPath: "templateCovers/images",
    showUpButton: false,
    locationLabel: "Template Covers",
};

export const CustomLocationLabel = Template.bind({});
CustomLocationLabel.args = {
    ...defaultStoryArgs,
    currentPath: "userUploads/documents/2024",
    showUpButton: true,
    locationLabel: "User Documents",
};
