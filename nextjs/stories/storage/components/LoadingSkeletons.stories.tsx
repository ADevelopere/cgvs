import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Paper, Typography } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import LoadingSkeletons from "@/views/storage/components/LoadingSkeletons";

type LoadingSkeletonsStoryProps = CommonStoryArgTypesProps & {
    count: number;
    variant: "list" | "grid" | "toolbar" | "stats";
    showInContainer: boolean;
};

const MockLoadingSkeletonsWrapper: React.FC<{
    count: number;
    variant: "list" | "grid" | "toolbar" | "stats";
    showInContainer: boolean;
}> = ({ count, variant, showInContainer }) => {
    const content = <LoadingSkeletons count={count} variant={variant} />;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "background.default",
                color: "text.primary",
                p: showInContainer ? 3 : 0,
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ px: 3, pt: 3 }}>
                Loading Skeletons -{" "}
                {variant.charAt(0).toUpperCase() + variant.slice(1)} Variant
            </Typography>

            {showInContainer ? (
                <Paper
                    sx={{
                        backgroundColor: "background.paper",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    {content}
                </Paper>
            ) : (
                content
            )}

            <Box sx={{ px: 3, pb: 3 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    <strong>Variant:</strong> {variant} |{" "}
                    <strong>Count:</strong> {count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    These loading skeletons are shown while storage data is
                    being fetched.
                </Typography>
            </Box>
        </Box>
    );
};

export default {
    title: "Storage/Components/LoadingSkeletons",
    component: MockLoadingSkeletonsWrapper,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        count: {
            control: { type: "number", min: 1, max: 20 },
            description: "Number of skeleton items to show",
            table: {
                category: "Display",
                order: 1,
            },
        },
        variant: {
            control: { type: "select" },
            options: ["list", "grid", "toolbar", "stats"],
            description: "Skeleton variant to display",
            table: {
                category: "Display",
                order: 2,
            },
        },
        showInContainer: {
            control: { type: "boolean" },
            description: "Whether to show skeletons in a paper container",
            table: {
                category: "Display",
                order: 3,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Loading skeleton placeholders for different storage UI areas. Provides visual feedback while data is loading.",
            },
        },
    },
} as Meta;

const Template: StoryFn<LoadingSkeletonsStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockLoadingSkeletonsWrapper
                count={args.count}
                variant={args.variant}
                showInContainer={args.showInContainer}
            />
        </AppRouterCacheProvider>
    );
};

export const ListSkeleton = Template.bind({});
ListSkeleton.args = {
    ...defaultStoryArgs,
    count: 6,
    variant: "list",
    showInContainer: true,
};

export const GridSkeleton = Template.bind({});
GridSkeleton.args = {
    ...defaultStoryArgs,
    count: 8,
    variant: "grid",
    showInContainer: true,
};

export const ToolbarSkeleton = Template.bind({});
ToolbarSkeleton.args = {
    ...defaultStoryArgs,
    count: 1, // Count doesn't apply to toolbar
    variant: "toolbar",
    showInContainer: true,
};

export const StatsSkeleton = Template.bind({});
StatsSkeleton.args = {
    ...defaultStoryArgs,
    count: 1, // Count doesn't apply to stats
    variant: "stats",
    showInContainer: false,
};

export const ManyListItems = Template.bind({});
ManyListItems.args = {
    ...defaultStoryArgs,
    count: 15,
    variant: "list",
    showInContainer: true,
};

export const FewGridItems = Template.bind({});
FewGridItems.args = {
    ...defaultStoryArgs,
    count: 3,
    variant: "grid",
    showInContainer: true,
};

export const WithoutContainer = Template.bind({});
WithoutContainer.args = {
    ...defaultStoryArgs,
    count: 6,
    variant: "list",
    showInContainer: false,
};
