import type { Meta, StoryObj } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";
import { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import LocationSelector from "@/views/storage/filePicker/LocationSelector";
import * as Graphql from "@/graphql/generated/types";
import withGlobalStyles from "@/stories/Decorators";

const meta: Meta<typeof LocationSelector> = {
    title: "Storage/FilePicker/LocationSelector",
    component: LocationSelector,
    decorators: [withGlobalStyles],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "A dropdown selector for choosing storage locations with detailed information about each location including allowed content types.",
            },
        },
    },
    argTypes: {
        value: {
            control: { type: "select" },
            options: [undefined, "TEMPLATE_COVER"],
            description: "Currently selected location",
            table: { category: "Data" },
        },
        disabled: {
            control: { type: "boolean" },
            description: "Disable the selector",
            table: { category: "State" },
        },
        label: {
            control: { type: "text" },
            description: "Custom label for the selector",
            table: { category: "Appearance" },
        },
        fullWidth: {
            control: { type: "boolean" },
            description: "Make selector take full width",
            table: { category: "Appearance" },
        },
        onChange: {
            action: "change",
            description: "Callback when location selection changes",
            table: { category: "Events" },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper component
const LocationSelectorWrapper: React.FC<{
    initialValue?: Graphql.UploadLocation;
    disabled?: boolean;
    label?: string;
    fullWidth?: boolean;
}> = ({ initialValue, disabled = false, label, fullWidth = true }) => {
    const [value, setValue] = useState<Graphql.UploadLocation | undefined>(
        initialValue,
    );

    return (
        <Box sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
                Location Selector Demo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select a storage location to see detailed information about
                allowed file types.
            </Typography>

            <LocationSelector
                value={value}
                onChange={(location) => {
                    setValue(location);
                    action("change")(location);
                }}
                disabled={disabled}
                label={label}
                fullWidth={fullWidth}
            />

            {value && (
                <Paper sx={{ mt: 3, p: 2, backgroundColor: "grey.50" }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Selected Location:
                    </Typography>
                    <Typography variant="body2" color="primary">
                        {value}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export const Default: Story = {
    render: () => <LocationSelectorWrapper />,
};

export const WithPreselection: Story = {
    render: () => <LocationSelectorWrapper initialValue="TEMPLATE_COVER" />,
    parameters: {
        docs: {
            description: {
                story: "Location selector with a pre-selected value.",
            },
        },
    },
};

export const CustomLabel: Story = {
    render: () => (
        <LocationSelectorWrapper
            label="Choose Upload Destination"
            initialValue="TEMPLATE_COVER"
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "Location selector with custom label text.",
            },
        },
    },
};

export const Disabled: Story = {
    render: () => (
        <LocationSelectorWrapper
            disabled={true}
            initialValue="TEMPLATE_COVER"
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "Disabled location selector.",
            },
        },
    },
};

export const NotFullWidth: Story = {
    render: () => (
        <LocationSelectorWrapper
            fullWidth={false}
            initialValue="TEMPLATE_COVER"
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "Location selector with constrained width.",
            },
        },
    },
};

export const InFormContext: Story = {
    render: () => (
        <Box sx={{ p: 3, maxWidth: 800 }}>
            <Typography variant="h6" gutterBottom>
                File Upload Form
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Upload Settings
                </Typography>
                <LocationSelectorWrapper
                    label="Storage Location"
                    initialValue="TEMPLATE_COVER"
                />
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Additional form fields would go here...
                </Typography>
            </Paper>
        </Box>
    ),
    parameters: {
        docs: {
            description: {
                story: "Location selector used within a form context.",
            },
        },
    },
};

export const AllLocations: Story = {
    render: () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                All Available Locations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Each location has different allowed content types and purposes.
                Click to explore.
            </Typography>
            <LocationSelectorWrapper />
        </Box>
    ),
    parameters: {
        docs: {
            description: {
                story: "Showcase all available storage locations and their properties.",
            },
        },
    },
};

// Direct prop testing
export const DirectProps: Story = {
    args: {
        value: "TEMPLATE_COVER",
        onChange: action("change"),
        disabled: false,
        label: "Select Location",
        fullWidth: true,
    },
};
