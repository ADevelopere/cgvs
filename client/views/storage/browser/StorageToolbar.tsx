import React from "react";
import { Box, Fade } from "@mui/material";
import StorageFilters from "./StorageFilters";
import StorageSelectionActions from "./StorageSelectionActions";
import {
  StorageItemUnion,
  StorageClipboardState,
  DirectoryTreeNode,
} from "@/client/views/storage/core/storage.type";
import { LoadingStates } from "@/client/views/storage/core/storage.type";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface StorageToolbarProps {
  selectedItems: string[];
  searchMode: boolean;
  searchResults: StorageItemUnion[];
  loading: LoadingStates;
  items: StorageItemUnion[];
  params: Graphql.FilesListInput;
  updateParams: (updates: Partial<Graphql.FilesListInput>) => void;
  clipboard: StorageClipboardState | null;
  onCopyItems: (items: StorageItemUnion[]) => void;
  onCutItems: (items: StorageItemUnion[]) => void;
  onPasteItems: () => Promise<boolean>;
  onRenameItem: (path: string, newName: string) => Promise<boolean>;
  onDeleteItems: (paths: string[]) => Promise<boolean>;
  onMove: (paths: string[], destination: string) => Promise<boolean>;
  onFetchDirectoryChildren: (path?: string) => Promise<DirectoryTreeNode[] | null>;
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
  clipboard,
  onCopyItems,
  onCutItems,
  onPasteItems,
  onRenameItem,
  onDeleteItems,
  onMove,
  onFetchDirectoryChildren,
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
            clipboard={clipboard}
            onCopyItems={onCopyItems}
            onCutItems={onCutItems}
            onPasteItems={onPasteItems}
            onRenameItem={onRenameItem}
            onDeleteItems={onDeleteItems}
            onMove={onMove}
            onFetchDirectoryChildren={onFetchDirectoryChildren}
          />
        </Box>
      </Fade>
    </Box>
  );
};

export default StorageToolbar;
