import React from "react";
import { Box } from "@mui/material";
import StorageBreadcrumb from "./StorageBreadcrumb";
import StorageToolbar from "./StorageToolbar";
import StorageItemsView from "./StorageItemsView";

/**
 * Main content pane for the storage browser.
 * Assembles the breadcrumb navigation, toolbar, and items view into a cohesive layout.
 * This component represents the right pane in the split-pane layout.
 */
const StorageMainView: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "background.default",
      }}
    >
      {/* Breadcrumb Navigation */}
      <StorageBreadcrumb />

      {/* Conditional Toolbar (Filters or Selection Actions) */}
      <StorageToolbar />

      {/* Main Items Display Area */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <StorageItemsView />
      </Box>
    </Box>
  );
};

export default StorageMainView;
