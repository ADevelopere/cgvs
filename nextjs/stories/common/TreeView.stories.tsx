import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Typography, Chip } from "@mui/material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import { TreeView, BaseTreeItem } from "@/components/common/TreeView";
import useStoryTheme from "../useStoryTheme";

export default {
  title: "Components/Common/TreeView",
  component: TreeView,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    items: {
      table: {
        disable: true,
      },
    },
    onSelectItem: {
      table: {
        disable: true,
      },
    },
    selectedItemId: {
      table: {
        disable: true,
      },
    },
    itemHeight: {
      control: "number",
      description: "Height of each tree item in pixels",
    },
    header: {
      control: "text",
      description: "Header text for the tree view",
    },
    noItemsMessage: {
      control: "text",
      description: "Message to show when no items are found",
    },
    searchText: {
      control: "text",
      description: "Placeholder text for the search input",
    },
  },
} as Meta;

// Sample tree data
interface SampleTreeItem extends BaseTreeItem {
  label: string;
  type?: string;
  disabled?: boolean;
  children?: SampleTreeItem[];
}

const sampleTreeData: SampleTreeItem[] = [
  {
    id: "1",
    label: "Documents",
    type: "folder",
    children: [
      {
        id: "1-1",
        label: "Work Documents",
        type: "folder",
        children: [
          { id: "1-1-1", label: "Project Plan.pdf", type: "file" },
          { id: "1-1-2", label: "Budget.xlsx", type: "file" },
          { id: "1-1-3", label: "Presentation.pptx", type: "file" },
        ],
      },
      {
        id: "1-2",
        label: "Personal Documents",
        type: "folder",
        children: [
          { id: "1-2-1", label: "Resume.pdf", type: "file" },
          { id: "1-2-2", label: "Cover Letter.docx", type: "file" },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Images",
    type: "folder",
    children: [
      { id: "2-1", label: "vacation.jpg", type: "image" },
      { id: "2-2", label: "profile.png", type: "image" },
      {
        id: "2-3",
        label: "Screenshots",
        type: "folder",
        children: [
          { id: "2-3-1", label: "screenshot1.png", type: "image" },
          { id: "2-3-2", label: "screenshot2.png", type: "image" },
        ],
      },
    ],
  },
  {
    id: "3",
    label: "Projects",
    type: "folder",
    children: [
      {
        id: "3-1",
        label: "Web App",
        type: "folder",
        children: [
          { id: "3-1-1", label: "index.html", type: "file" },
          { id: "3-1-2", label: "styles.css", type: "file" },
          { id: "3-1-3", label: "script.js", type: "file" },
        ],
      },
      {
        id: "3-2",
        label: "Mobile App",
        type: "folder",
        disabled: true,
        children: [
          { id: "3-2-1", label: "MainActivity.java", type: "file" },
        ],
      },
    ],
  },
];

type TreeViewStoryProps = {
  itemHeight: number;
  header: string;
  noItemsMessage: string;
  searchText: string;
} & CommonStoryArgTypesProps;

const Template: StoryFn<TreeViewStoryProps> = (args) => {
  const [selectedItemId, setSelectedItemId] = useState<string>();
  useStoryTheme(args);

  const handleSelectItem = (item: SampleTreeItem) => {
    setSelectedItemId(item.id.toString());
  };

  const itemRenderer = (item: SampleTreeItem) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" sx={{ flexGrow: 1 }}>
        {item.label}
      </Typography>
      {item.type && (
        <Chip
          label={item.type}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.7rem", height: "20px" }}
        />
      )}
    </Box>
  );

  return (
    <AppRouterCacheProvider>
      <Box
        sx={{
          height: "100vh",
          paddingX: { xs: "1em", sm: "2em", md: "10em", lg: "20em" },
          paddingY: "2em",
          backgroundColor: "background.default",
          color: "onBackground",
        }}
      >
        <Box
          sx={{
            height: "80vh",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <TreeView
            items={sampleTreeData}
            onSelectItem={handleSelectItem}
            selectedItemId={selectedItemId}
            itemHeight={args.itemHeight}
            itemRenderer={itemRenderer}
            header={args.header}
            noItemsMessage={args.noItemsMessage}
            searchText={args.searchText}
          />
        </Box>
        {selectedItemId && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: "action.hover", borderRadius: 1 }}>
            <Typography variant="body2">
              Selected Item ID: <strong>{selectedItemId}</strong>
            </Typography>
          </Box>
        )}
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryArgs,
  itemHeight: 40,
  header: "File Explorer",
  noItemsMessage: "No files or folders found",
  searchText: "Search files and folders...",
};

export const CompactView = Template.bind({});
CompactView.args = {
  ...defaultStoryArgs,
  itemHeight: 32,
  header: "Compact Tree",
  noItemsMessage: "No items available",
  searchText: "Search...",
};

export const NoHeader = Template.bind({});
NoHeader.args = {
  ...defaultStoryArgs,
  itemHeight: 40,
  header: "",
  noItemsMessage: "No items found",
  searchText: "Type to search...",
};