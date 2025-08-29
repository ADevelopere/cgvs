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
import PaginationControls, {
    PaginationControlsProps,
} from "@/views/storage/components/PaginationControls";

type PaginationControlsStoryProps = CommonStoryArgTypesProps & {
    totalCount: number;
    currentLimit: number;
    currentPage: number;
    showPagination: boolean;
};

const MockPaginationControlsWrapper: React.FC<{
    totalCount: number;
    currentLimit: number;
    currentPage: number;
    showPagination: boolean;
}> = ({ totalCount, currentLimit, currentPage, showPagination }) => {
    const handlePageChange = (page: number) => {
        // eslint-disable-next-line no-console
        console.log("Page changed to:", page);
    };

    const handleLimitChange = (limit: number) => {
        // eslint-disable-next-line no-console
        console.log("Limit changed to:", limit);
    };

    const offset = (currentPage - 1) * currentLimit;

    const paginationControlsProps: PaginationControlsProps = {
        pagination: showPagination
            ? {
                  totalCount,
                  limit: currentLimit,
                  offset,
                  hasMore: offset + currentLimit < totalCount,
              }
            : null,
        currentLimit,
        onPageChange: handlePageChange,
        onLimitChange: handleLimitChange,
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
                    Pagination Controls Demo
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Testing pagination controls with different data scenarios.
                </Typography>

                {/* Config Info */}
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                        <strong>Current Configuration:</strong>
                        <br />• Total Items: {totalCount}
                        <br />• Items Per Page: {currentLimit}
                        <br />• Current Page: {currentPage}
                        <br />• Show Pagination:{" "}
                        {showPagination ? "Yes" : "No (null pagination)"}
                    </Typography>
                </Alert>
            </Box>

            {/* Mock content area to show context */}
            <Box
                sx={{
                    backgroundColor: "background.paper",
                    mx: 3,
                    mb: 3,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>
                        Mock File List Area
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This would contain the actual file/folder items. Showing
                        items {offset + 1} to{" "}
                        {Math.min(offset + currentLimit, totalCount)} of{" "}
                        {totalCount}.
                    </Typography>
                </Box>

                {/* The PaginationControls component */}
                <PaginationControls {...paginationControlsProps} />
            </Box>
        </Box>
    );
};

export default {
    title: "Storage/Components/PaginationControls",
    component: PaginationControls,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        totalCount: {
            control: { type: "number", min: 0, max: 1000 },
            description: "Total number of items in the dataset",
            table: {
                category: "Data",
                order: 1,
            },
        },
        currentLimit: {
            control: { type: "select" },
            options: [10, 25, 50, 100],
            description: "Current items per page limit",
            table: {
                category: "Pagination",
                order: 1,
            },
        },
        currentPage: {
            control: { type: "number", min: 1, max: 20 },
            description: "Current page number",
            table: {
                category: "Pagination",
                order: 2,
            },
        },
        showPagination: {
            control: { type: "boolean" },
            description:
                "Whether to show pagination (false simulates null pagination)",
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
                    "Pagination controls for navigating through storage items. Displays item counts, page size selector, and pagination when multiple pages exist. Now uses props for better testability.",
            },
        },
    },
} as Meta;

const Template: StoryFn<PaginationControlsStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockPaginationControlsWrapper
                totalCount={args.totalCount}
                currentLimit={args.currentLimit}
                currentPage={args.currentPage}
                showPagination={args.showPagination}
            />
        </AppRouterCacheProvider>
    );
};

export const SmallDataset = Template.bind({});
SmallDataset.args = {
    ...defaultStoryArgs,
    totalCount: 15,
    currentLimit: 10,
    currentPage: 1,
    showPagination: true,
};

export const LargeDataset = Template.bind({});
LargeDataset.args = {
    ...defaultStoryArgs,
    totalCount: 250,
    currentLimit: 25,
    currentPage: 5,
    showPagination: true,
};

export const SinglePage = Template.bind({});
SinglePage.args = {
    ...defaultStoryArgs,
    totalCount: 8,
    currentLimit: 25,
    currentPage: 1,
    showPagination: true,
};

export const LastPage = Template.bind({});
LastPage.args = {
    ...defaultStoryArgs,
    totalCount: 127,
    currentLimit: 50,
    currentPage: 3,
    showPagination: true,
};

export const NoPagination = Template.bind({});
NoPagination.args = {
    ...defaultStoryArgs,
    totalCount: 100,
    currentLimit: 25,
    currentPage: 1,
    showPagination: false,
};

export const VeryLargeDataset = Template.bind({});
VeryLargeDataset.args = {
    ...defaultStoryArgs,
    totalCount: 987,
    currentLimit: 100,
    currentPage: 7,
    showPagination: true,
};
