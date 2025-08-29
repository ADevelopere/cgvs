import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Typography, Paper } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import SearchBar from "@/views/storage/components/SearchBar";
import logger from "@/utils/logger";

type SearchBarStoryProps = CommonStoryArgTypesProps & {
    placeholder: string;
    debounceMs: number;
    initialValue: string;
    disabled: boolean;
};

const MockSearchBarWrapper: React.FC<{
    placeholder: string;
    debounceMs: number;
    initialValue: string;
}> = ({ placeholder, debounceMs, initialValue }) => {
    const [value, setValue] = useState(initialValue);
    const [lastSearched, setLastSearched] = useState("");

    const handleChange = (newValue: string) => {
        setValue(newValue);
        setLastSearched(newValue);
        logger.log("Search changed:", newValue);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "background.default",
                color: "text.primary",
                p: 3,
            }}
        >
            <Box sx={{ maxWidth: 600, mx: "auto" }}>
                <Typography variant="h4" gutterBottom>
                    Storage Search Bar
                </Typography>

                <Paper
                    sx={{
                        p: 3,
                        mb: 3,
                        backgroundColor: "background.paper",
                    }}
                >
                    <SearchBar
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        debounceMs={debounceMs}
                    />
                </Paper>

                {/* Debug info */}
                <Paper
                    sx={{
                        p: 2,
                        backgroundColor: "action.hover",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography variant="subtitle2" gutterBottom>
                        Debug Information:
                    </Typography>
                    <Typography variant="body2" component="div">
                        <strong>Current Value:</strong> &quot;{value}&quot;
                    </Typography>
                    <Typography variant="body2" component="div">
                        <strong>Last Searched:</strong> &quot;{lastSearched}
                        &quot;
                    </Typography>
                    <Typography variant="body2" component="div">
                        <strong>Debounce:</strong> {debounceMs}ms
                    </Typography>
                </Paper>

                {/* Instructions */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Try these actions:</strong>
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        component="ul"
                    >
                        <li>Type to see debounced search</li>
                        <li>Press Enter for immediate search</li>
                        <li>Press Escape to clear</li>
                        <li>Click the clear button (×) when text is present</li>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default {
    title: "Storage/Components/SearchBar",
    component: MockSearchBarWrapper,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        placeholder: {
            control: { type: "text" },
            description: "Placeholder text for the search input",
            table: {
                category: "Props",
                order: 1,
            },
        },
        debounceMs: {
            control: { type: "number", min: 0, max: 2000, step: 100 },
            description: "Debounce delay in milliseconds",
            table: {
                category: "Props",
                order: 2,
            },
        },
        initialValue: {
            control: { type: "text" },
            description: "Initial search value",
            table: {
                category: "Props",
                order: 3,
            },
        },
        disabled: {
            control: { type: "boolean" },
            description: "Whether the search bar is disabled",
            table: {
                category: "State",
                order: 1,
            },
        },
    },
} as Meta;

const Template: StoryFn<SearchBarStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockSearchBarWrapper
                placeholder={args.placeholder}
                debounceMs={args.debounceMs}
                initialValue={args.initialValue}
            />
        </AppRouterCacheProvider>
    );
};

export const Default = Template.bind({});
Default.args = {
    ...defaultStoryArgs,
    placeholder: "Search files and folders...",
    debounceMs: 300,
    initialValue: "",
    disabled: false,
};

export const WithInitialValue = Template.bind({});
WithInitialValue.args = {
    ...defaultStoryArgs,
    placeholder: "Search files and folders...",
    debounceMs: 300,
    initialValue: "documents",
    disabled: false,
};

export const CustomPlaceholder = Template.bind({});
CustomPlaceholder.args = {
    ...defaultStoryArgs,
    placeholder: "Find your templates...",
    debounceMs: 300,
    initialValue: "",
    disabled: false,
};

export const FastDebounce = Template.bind({});
FastDebounce.args = {
    ...defaultStoryArgs,
    placeholder: "Search files and folders...",
    debounceMs: 100,
    initialValue: "",
    disabled: false,
};

export const SlowDebounce = Template.bind({});
SlowDebounce.args = {
    ...defaultStoryArgs,
    placeholder: "Search files and folders...",
    debounceMs: 1000,
    initialValue: "",
    disabled: false,
};

export const NoDebounce = Template.bind({});
NoDebounce.args = {
    ...defaultStoryArgs,
    placeholder: "Search files and folders...",
    debounceMs: 0,
    initialValue: "",
    disabled: false,
};
