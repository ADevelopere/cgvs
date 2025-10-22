import React from "react";
import { Box, Fade } from "@mui/material";
import StorageFilters from "./StorageFilters";
import StorageSelectionActions from "./StorageSelectionActions";
import { StorageItem } from "@/client/views/storage/core/storage.type";
import { LoadingStates } from "@/client/views/storage/core/storage.type";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface StorageToolbarProps {
  selectedItems: string[];
  searchMode: boolean;
  searchResults: StorageItem[];
  loading: LoadingStates;
  items: StorageItem[];
  params: Graphql.FilesListInput;
  updateParams: (updates: Partial<Graphql.FilesListInput>) => void;
}

/**
 * Conditional toolbar container for the storage browser.
 * Switches between StorageFilters and StorageSelectionActions based on selection state.
 * Provides smooth transitions between the two states.
 */
const StorageToolbar: React.FC<StorageToolbarProps> = ({
  selectedItems,
  searchMode,
  searchResults,
  loading,
  items,
  params,
  updateParams,
}) => {

  const hasSelection = selectedItems.length > 0;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: 64, // Ensure consistent height to prevent layout shift
        overflow: "hidden",
      }}
    >
      {/* Filters Component - Visible when no items are selected */}
      <Fade in={!hasSelection} timeout={200}>
        <Box
          sx={{
            position: hasSelection ? "absolute" : "relative",
            top: 0,
            left: 0,
            right: 0,
            visibility: hasSelection ? "hidden" : "visible",
          }}
        >
          <StorageFilters params={params} updateParams={updateParams} />
        </Box>
      </Fade>

      {/* Selection Actions Component - Visible when items are selected */}
      <Fade in={hasSelection} timeout={200}>
        <Box
          sx={{
            position: !hasSelection ? "absolute" : "relative",
            top: 0,
            left: 0,
            right: 0,
            visibility: !hasSelection ? "hidden" : "visible",
          }}
        >
          <StorageSelectionActions
            selectedItems={selectedItems}
            searchMode={searchMode}
            searchResults={searchResults}
            loading={loading}
            items={items}
          />
        </Box>
      </Fade>
    </Box>
  );
};

export default StorageToolbar;
