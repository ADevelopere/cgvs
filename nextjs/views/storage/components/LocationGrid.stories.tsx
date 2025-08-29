import type { Meta, StoryObj } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";
import LocationGrid from "./LocationGrid";

const meta: Meta<typeof LocationGrid> = {
    title: "Storage/Components/LocationGrid",
    component: LocationGrid,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "A grid displaying available storage locations with descriptions and navigation functionality.",
            },
        },
    },
    argTypes: {
        onNavigateTo: {
            action: "navigateTo",
            description: "Callback when a location is selected for navigation",
            table: { category: "Events" },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Action handler with logging
const actionHandlers = {
    onNavigateTo: action("navigateTo"),
};

export const Default: Story = {
    args: {
        ...actionHandlers,
    },
};

export const WithClickLogging: Story = {
    args: {
        onNavigateTo: (path: string) => {
            action("navigateTo")(path);
            // eslint-disable-next-line no-console
            console.log("Navigating to:", path);
        },
    },
    parameters: {
        docs: {
            description: {
                story: "Click on any location card to see the navigation action logged in the Actions panel.",
            },
        },
    },
};

export const Interactive: Story = {
    args: {
        onNavigateTo: (path: string) => {
            action("navigateTo")(path);
            alert(`Would navigate to: ${path}`);
        },
    },
    parameters: {
        docs: {
            description: {
                story: "Interactive version showing an alert when clicking location cards.",
            },
        },
    },
};
