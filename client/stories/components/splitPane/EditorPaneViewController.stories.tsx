import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Card,
  CardContent,
  Chip,
  Avatar,
  Tab,
  Tabs
} from "@mui/material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/client/components/appRouter/AppRouterCacheProvider";
import EditorPaneViewController from "@/client/components/editorPane/EditorPaneViewController";
import useStoryTheme from "@/stories/useStoryTheme";
import { Edit, Delete, Folder, Code, Eye, Settings } from "lucide-react";

export default {
  title: "Components/EditorPane/EditorPaneViewController",
  component: EditorPaneViewController,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    title: {
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
    thirdPaneButtonDisabled: {
      control: "boolean",
      description: "Whether the third pane toggle button is disabled",
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
    thirdPaneButtonTooltip: {
      control: "text",
      description: "Tooltip text for the third pane toggle button",
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
    firstPane: {
      table: {
        disable: true,
      },
    },
    middlePane: {
      table: {
        disable: true,
      },
    },
    thirdPane: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

type EditorPaneViewControllerStoryProps = {
  title: string;
  firstPaneButtonDisabled: boolean;
  thirdPaneButtonDisabled: boolean;
  firstPaneButtonTooltip: string;
  thirdPaneButtonTooltip: string;
  storageKey?: string;
} & CommonStoryArgTypesProps;

const Template: StoryFn<EditorPaneViewControllerStoryProps> = (args) => {
  useStoryTheme(args);
  
  // State for file explorer
  const [selectedFile, setSelectedFile] = useState<string | null>("App.tsx");
  const [files] = useState([
    { name: "App.tsx", type: "file", size: "2.4 KB", modified: "2 hours ago" },
    { name: "components", type: "folder", items: 12 },
    { name: "utils", type: "folder", items: 8 },
    { name: "styles", type: "folder", items: 5 },
    { name: "package.json", type: "file", size: "1.2 KB", modified: "1 day ago" },
    { name: "README.md", type: "file", size: "3.1 KB", modified: "3 days ago" },
    { name: "tsconfig.json", type: "file", size: "890 B", modified: "1 week ago" },
  ]);

  // State for properties panel
  const [activeTab, setActiveTab] = useState(0);

  // First pane content - File Explorer
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
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Folder size={20} />
          File Explorer
        </Typography>
      </Box>
      <List sx={{ flex: 1, overflow: "auto", p: 0 }}>
        {files.map((file, index) => (
          <ListItem
            key={`${file.name}-${index}`}
            onClick={() => setSelectedFile(file.name)}
            sx={{
              cursor: "pointer",
              backgroundColor: selectedFile === file.name ? "action.selected" : "transparent",
              "&:hover": {
                backgroundColor: "action.hover",
              },
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Avatar
              sx={{
                width: 24,
                height: 24,
                mr: 2,
                bgcolor: file.type === "folder" ? "warning.main" : "primary.main",
                fontSize: "0.8rem",
              }}
            >
              {file.type === "folder" ? <Folder size={14} /> : <Code size={14} />}
            </Avatar>
            <ListItemText 
              primary={file.name}
              secondary={
                file.type === "file" 
                  ? `${file.size} • ${file.modified}`
                  : `${file.items} items`
              }
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "0.9rem",
                  fontWeight: selectedFile === file.name ? "bold" : "normal",
                },
                "& .MuiListItemText-secondary": {
                  fontSize: "0.8rem",
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  // Middle pane content - Code Editor
  const MiddlePaneContent = () => (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ 
        p: 1.5, 
        borderBottom: "1px solid", 
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}>
        <Code size={18} />
        <Typography variant="h6">
          {selectedFile || "No file selected"}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Chip 
          label="TypeScript" 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      </Box>
      <Box 
        sx={{ 
          flex: 1, 
          p: 2, 
          fontFamily: "monospace",
          backgroundColor: "grey.50",
          overflow: "auto",
        }}
      >
        {selectedFile ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {`// ${selectedFile}`}
            </Typography>
            <Box sx={{ lineHeight: 1.6 }}>
              <Typography variant="body2" component="pre" sx={{ margin: 0 }}>
{`import React from 'react';
import { Box, Typography } from '@mui/material';

interface AppProps {
  title?: string;
  children?: React.ReactNode;
}

const App: React.FC<AppProps> = ({ 
  title = "My Application", 
  children 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'background.default'
    }}>
      <Typography variant="h4" component="h1" sx={{ p: 2 }}>
        {title}
      </Typography>
      <Box sx={{ flex: 1, p: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default App;`}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              height: "100%",
              flexDirection: "column",
              color: "text.secondary"
            }}
          >
            <Code size={48} style={{ opacity: 0.5, marginBottom: 16 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No File Open
            </Typography>
            <Typography variant="body2" textAlign="center">
              Select a file from the explorer to view its contents
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );

  // Third pane content - Properties Panel
  const ThirdPaneContent = () => (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Settings size={20} />
          Properties
        </Typography>
      </Box>
      
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Tab label="Details" />
        <Tab label="Preview" />
        <Tab label="Actions" />
      </Tabs>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        {activeTab === 0 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              File Information
            </Typography>
            {selectedFile ? (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {selectedFile}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Type: {selectedFile.endsWith('.tsx') ? 'TypeScript React' : 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Size: 2.4 KB
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Last Modified: 2 hours ago
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Lines: 34
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Dependencies:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    <Chip label="React" size="small" />
                    <Chip label="@mui/material" size="small" />
                    <Chip label="TypeScript" size="small" />
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No file selected
              </Typography>
            )}
          </Box>
        )}
        
        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Live Preview
            </Typography>
            {selectedFile ? (
              <Card variant="outlined" sx={{ minHeight: 200 }}>
                <CardContent sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexDirection: "column",
                  minHeight: 160
                }}>
                  <Eye size={48} style={{ opacity: 0.5, marginBottom: 16 }} />
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Live preview would appear here for supported file types
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No file selected for preview
              </Typography>
            )}
          </Box>
        )}
        
        {activeTab === 2 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              File Actions
            </Typography>
            {selectedFile ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Edit size={16} />}
                  fullWidth
                >
                  Edit File
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Eye size={16} />}
                  fullWidth
                >
                  Open Preview
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<Delete size={16} />}
                  fullWidth
                >
                  Delete File
                </Button>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No file selected
              </Typography>
            )}
          </Box>
        )}
      </Box>
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
          EditorPaneViewController Demo
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          This component provides a three-pane editor interface with file explorer, main editor, and properties panel.
          The middle pane is always visible while the side panes can be toggled.
        </Typography>
        <Box
          sx={{
            height: "calc(100vh - 200px)",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <EditorPaneViewController
            title={args.title}
            firstPaneButtonDisabled={args.firstPaneButtonDisabled}
            thirdPaneButtonDisabled={args.thirdPaneButtonDisabled}
            firstPaneButtonTooltip={args.firstPaneButtonTooltip}
            thirdPaneButtonTooltip={args.thirdPaneButtonTooltip}
            firstPane={<FirstPaneContent />}
            middlePane={<MiddlePaneContent />}
            thirdPane={<ThirdPaneContent />}
            storageKey={args.storageKey}
          />
        </Box>
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
  title: "Code Editor",
  firstPaneButtonDisabled: false,
  thirdPaneButtonDisabled: false,
  firstPaneButtonTooltip: "Toggle file explorer",
  thirdPaneButtonTooltip: "Toggle properties panel",
  storageKey: "code-editor-panes",
};

export const IDELayout = Template.bind({});
IDELayout.args = {
  ...defaultStoryArgs,
  title: "Integrated Development Environment",
  firstPaneButtonDisabled: false,
  thirdPaneButtonDisabled: false,
  firstPaneButtonTooltip: "Show/hide project explorer",
  thirdPaneButtonTooltip: "Show/hide inspector panel",
  storageKey: "ide-layout-panes",
};

export const ExplorerDisabled = Template.bind({});
ExplorerDisabled.args = {
  ...defaultStoryArgs,
  title: "Simple Code Editor",
  firstPaneButtonDisabled: true,
  thirdPaneButtonDisabled: false,
  firstPaneButtonTooltip: "File explorer is locked",
  thirdPaneButtonTooltip: "Toggle properties panel",
  storageKey: "simple-editor-panes",
};

export const PropertiesDisabled = Template.bind({});
PropertiesDisabled.args = {
  ...defaultStoryArgs,
  title: "Minimal Editor",
  firstPaneButtonDisabled: false,
  thirdPaneButtonDisabled: true,
  firstPaneButtonTooltip: "Toggle file explorer",
  thirdPaneButtonTooltip: "Properties panel is locked",
  storageKey: "minimal-editor-panes",
};

export const ReadOnlyMode = Template.bind({});
ReadOnlyMode.args = {
  ...defaultStoryArgs,
  title: "Code Viewer (Read-only)",
  firstPaneButtonDisabled: true,
  thirdPaneButtonDisabled: true,
  firstPaneButtonTooltip: "Cannot toggle in read-only mode",
  thirdPaneButtonTooltip: "Cannot toggle in read-only mode",
  storageKey: "readonly-editor-panes",
};

export const DocumentEditor = Template.bind({});
DocumentEditor.args = {
  ...defaultStoryArgs,
  title: "Document Editor",
  firstPaneButtonDisabled: false,
  thirdPaneButtonDisabled: false,
  firstPaneButtonTooltip: "Toggle document outline",
  thirdPaneButtonTooltip: "Toggle formatting tools",
  storageKey: "document-editor-panes",
};