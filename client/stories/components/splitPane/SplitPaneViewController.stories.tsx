import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/client/stories/Decorators";
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, TextField } from "@mui/material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/client/stories/argTypes";
import AppRouterCacheProvider from "@/client/components/appRouter/AppRouterCacheProvider";
import SplitPaneViewController from "@/client/components/splitPane/SplitPaneViewController";
import useStoryTheme from "@/client/stories/useStoryTheme";

export default {
  title: "Components/SplitPane/SplitPaneViewController",
  component: SplitPaneViewController,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    titleText: {
      control: "text",
      description: "Title text to display in the controller header",
      table: {
        category: "Content",
      },
    },
    firstPaneButtonDisabled: {
      control: "boolean",
      description: "Whether the first pane toggle button is disabled",
      table: {
        category: "Controls",
      },
    },
    secondPaneButtonDisabled: {
      control: "boolean",
      description: "Whether the second pane toggle button is disabled",
      table: {
        category: "Controls",
      },
    },
    firstPaneButtonTooltip: {
      control: "text",
      description: "Tooltip text for the first pane toggle button",
      table: {
        category: "Controls",
      },
    },
    secondPaneButtonTooltip: {
      control: "text",
      description: "Tooltip text for the second pane toggle button",
      table: {
        category: "Controls",
      },
    },
    storageKey: {
      control: "text",
      description: "Key for storing pane state in localStorage",
      table: {
        category: "Storage",
      },
    },
    // Disable complex props from controls
    title: {
      table: {
        disable: true,
      },
    },
    firstPane: {
      table: {
        disable: true,
      },
    },
    secondPane: {
      table: {
        disable: true,
      },
    },
    style: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

type SplitPaneViewControllerStoryProps = {
  titleText: string;
  firstPaneButtonDisabled: boolean;
  secondPaneButtonDisabled: boolean;
  firstPaneButtonTooltip: string;
  secondPaneButtonTooltip: string;
  storageKey?: string;
} & CommonStoryArgTypesProps;

const Template: StoryFn<SplitPaneViewControllerStoryProps> = (args) => {
  useStoryTheme(args);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [items, setItems] = useState([
    "Project Alpha",
    "Project Beta", 
    "Project Gamma",
    "Project Delta",
    "Project Epsilon"
  ]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      setItems(prev => [...prev, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setSelectedItem(null);
  };

  // Title component
  const TitleComponent = () => (
    <Typography variant="h6" sx={{ p: 1 }}>
      {args.titleText}
    </Typography>
  );

  // First pane content - List of items
  const FirstPaneContent = () => (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Project List
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            size="small"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="New project name"
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <Button variant="outlined" onClick={addItem}>
            Add
          </Button>
        </Box>
      </Box>
      <List sx={{ flex: 1, overflow: "auto" }}>
        {items.map((item, index) => (
          <ListItem
            key={`${item}-${index}`}
            onClick={() => setSelectedItem(item)}
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              backgroundColor: selectedItem === item ? "action.selected" : "transparent",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemText 
              primary={item}
              secondary={`Project #${index + 1}`}
            />
            <Button
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(index);
              }}
            >
              Remove
            </Button>
          </ListItem>
        ))}
        {items.length === 0 && (
          <ListItem>
            <ListItemText 
              primary="No projects"
              secondary="Add a project to get started"
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );

  // Second pane content - Details view
  const SecondPaneContent = () => (
    <Paper
      sx={{
        height: "100%",
        p: 3,
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Project Details
      </Typography>
      {selectedItem ? (
        <Box>
          <Typography variant="h5" sx={{ mb: 2, color: "primary.main" }}>
            {selectedItem}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This is a detailed view for the selected project. Here you can see all the information
            and perform various actions related to the project.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Project Information:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Status: Active
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Created: {new Date().toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Team Members: 5
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Progress: 65%
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" sx={{ mr: 1 }}>
              Edit Project
            </Button>
            <Button variant="outlined">
              View Reports
            </Button>
          </Box>
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            flex: 1,
            flexDirection: "column",
            color: "text.secondary"
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No Project Selected
          </Typography>
          <Typography variant="body2" textAlign="center">
            Select a project from the list to view its details and manage its settings.
          </Typography>
        </Box>
      )}
    </Paper>
  );

  return (
    <AppRouterCacheProvider>
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "background.default",
          color: "onBackground",
          p: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          SplitPaneViewController Demo
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          This component provides a complete split pane interface with built-in controls for toggling pane visibility.
          Try clicking the panel toggle buttons in the top-right corner.
        </Typography>
        <Box
          sx={{
            height: "calc(100vh - 200px)",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <SplitPaneViewController
            title={<TitleComponent />}
            firstPaneButtonDisabled={args.firstPaneButtonDisabled}
            secondPaneButtonDisabled={args.secondPaneButtonDisabled}
            firstPaneButtonTooltip={args.firstPaneButtonTooltip}
            secondPaneButtonTooltip={args.secondPaneButtonTooltip}
            firstPane={<FirstPaneContent />}
            secondPane={<SecondPaneContent />}
            storageKey={args.storageKey}
            style={{
              height: "100%",
            }}
          />
        </Box>
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
  titleText: "Project Manager",
  firstPaneButtonDisabled: false,
  secondPaneButtonDisabled: false,
  firstPaneButtonTooltip: "Toggle project list",
  secondPaneButtonTooltip: "Toggle details panel",
  storageKey: "project-manager-split",
};

export const FileExplorer = Template.bind({});
FileExplorer.args = {
  ...defaultStoryArgs,
  titleText: "File Explorer",
  firstPaneButtonDisabled: false,
  secondPaneButtonDisabled: false,
  firstPaneButtonTooltip: "Show/hide file tree",
  secondPaneButtonTooltip: "Show/hide file preview",
  storageKey: "file-explorer-split",
};

export const DisabledControls = Template.bind({});
DisabledControls.args = {
  ...defaultStoryArgs,
  titleText: "Dashboard (Read-only)",
  firstPaneButtonDisabled: true,
  secondPaneButtonDisabled: true,
  firstPaneButtonTooltip: "Cannot toggle - view only mode",
  secondPaneButtonTooltip: "Cannot toggle - view only mode",
  storageKey: "readonly-split",
};

export const LeftPanelDisabled = Template.bind({});
LeftPanelDisabled.args = {
  ...defaultStoryArgs,
  titleText: "Settings Panel",
  firstPaneButtonDisabled: true,
  secondPaneButtonDisabled: false,
  firstPaneButtonTooltip: "Navigation panel is locked",
  secondPaneButtonTooltip: "Toggle settings panel",
  storageKey: "settings-split",
};

export const RightPanelDisabled = Template.bind({});
RightPanelDisabled.args = {
  ...defaultStoryArgs,
  titleText: "Code Editor",
  firstPaneButtonDisabled: false,
  secondPaneButtonDisabled: true,
  firstPaneButtonTooltip: "Toggle file explorer",
  secondPaneButtonTooltip: "Editor panel is locked",
  storageKey: "editor-split",
};