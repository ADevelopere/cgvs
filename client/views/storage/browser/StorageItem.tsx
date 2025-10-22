import React from "react";
import StorageItemGrid from "./StorageItemGrid";
import StorageItemListRow from "./StorageItemListRow";
import {
  useStorageState,
  useStorageStateActions,
} from "@/client/views/storage/contexts/StorageStateContext";
import FolderDropTarget from "@/client/views/storage/dropzone/FolderDropTarget";
import {
  StorageItemUnion as StorageItemType,
  ViewMode,
  StorageClipboardState,
} from "@/client/views/storage/core/storage.type";
import logger from "@/client/lib/logger";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface StorageItemProps {
  item: StorageItemType;
  viewMode: ViewMode;
  params: Graphql.FilesListInput;
  currentItems: StorageItemType[];
  onNavigate: (
    path: string,
    currentParams: Graphql.FilesListInput
  ) => Promise<void>;
  clipboard: StorageClipboardState | null;
  onRefresh: () => Promise<void>;
  onCopyItems: (items: StorageItemType[]) => void;
  onCutItems: (items: StorageItemType[]) => void;
  onPasteItems: () => Promise<boolean>;
  onRenameItem: (path: string, newName: string) => Promise<boolean>;
  onDeleteItems: (paths: string[]) => Promise<boolean>;
}

/**
 * The main router for an individual storage item.
 * Handles selection logic and renders either Grid or List Row component.
 * Manages drag-and-drop functionality and context menus.
 */
const StorageItem: React.FC<StorageItemProps> = ({
  item,
  viewMode,
  params,
  currentItems,
  onNavigate,
  clipboard,
  onRefresh,
  onCopyItems,
  onCutItems,
  onPasteItems,
  onRenameItem,
  onDeleteItems,
}) => {
  const { selectedItems, lastSelectedItem } = useStorageState();
  const { toggleSelect, selectRange, clearSelection, setFocusedItem } =
    useStorageStateActions();

  const isCut = React.useMemo(
    () =>
      clipboard?.operation === "cut" &&
      clipboard.items.some(clipItem => clipItem.path === item.path),
    [clipboard?.items, clipboard?.operation, item.path]
  );

  const isDirectory = item.__typename === "DirectoryInfo";

  // Use ref to track if we're in a double-click sequence
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isDoubleClickingRef = React.useRef(false);

  // Handle click events for selection
  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation(); // Prevent event from bubbling up to view area

      // If we're in a double-click sequence, ignore single-click logic
      if (isDoubleClickingRef.current) {
        return;
      }

      // Delay single-click action to check if double-click is coming
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(() => {
        // Set focused item for keyboard navigation
        setFocusedItem(item.path);

        // Handle different selection behaviors based on modifier keys
        if (event.shiftKey && lastSelectedItem) {
          // Shift+click: Select range from last selected to current
          selectRange(lastSelectedItem, item.path, currentItems);
        } else if (event.ctrlKey || event.metaKey) {
          // Ctrl+click (or Cmd+click on Mac): Toggle selection
          toggleSelect(item.path);
        } else {
          // Regular click: Clear all selections and select only this item
          clearSelection();
          toggleSelect(item.path);
        }
      }, 200); // 200ms delay to detect double-click
    },
    [
      clearSelection,
      item.path,
      lastSelectedItem,
      selectRange,
      setFocusedItem,
      toggleSelect,
      currentItems,
    ]
  );

  // Handle double-click for navigation
  const handleDoubleClick = React.useCallback(
    (event: React.MouseEvent) => {
      logger.info("Double-click detected", {
        itemPath: item.path,
        isDirectory,
      });

      event.preventDefault();
      event.stopPropagation(); // Prevent event from bubbling up to view area

      // Mark that we're double-clicking to prevent single-click logic
      isDoubleClickingRef.current = true;

      // Clear any pending single-click timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }

      if (isDirectory) {
        logger.info("Navigating via double-click", { path: item.path });
        onNavigate(item.path, params);
      } else {
        logger.info("File double-clicked - no action", { path: item.path });
        // For files, we could trigger preview or download
        // For now, do nothing for files
      }

      // Reset double-click flag after a short delay
      setTimeout(() => {
        isDoubleClickingRef.current = false;
      }, 300);
    },
    [isDirectory, item.path, onNavigate, params]
  );

  // Handle context menu (right-click)
  const handleContextMenu = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation(); // Prevent view area context menu from opening

      // Always select the item on context menu to ensure it's selected
      // The context functions will handle checking current state
      clearSelection();
      toggleSelect(item.path);
      setFocusedItem(item.path);

      // The actual context menu handling is done by the child components
    },
    [clearSelection, item.path, setFocusedItem, toggleSelect]
  );

  // Common props for both view types
  const commonProps = React.useMemo(
    () => ({
      item,
      isSelected: selectedItems.includes(item.path),
      onClick: handleClick,
      onDoubleClick: handleDoubleClick,
      onContextMenu: handleContextMenu,
      params,
      clipboard,
      onNavigate,
      onRefresh,
      onCopyItems,
      onCutItems,
      onPasteItems,
      onRenameItem,
      onDeleteItems,
    }),
    [
      handleClick,
      clipboard,
      onNavigate,
      onRefresh,
      onCopyItems,
      onCutItems,
      onPasteItems,
      onRenameItem,
      onDeleteItems,
      handleContextMenu,
      handleDoubleClick,
      item,
      selectedItems,
      params,
    ]
  );

  // Render the appropriate component based on view mode
  const renderItem = () => {
    if (viewMode === "grid") {
      return <StorageItemGrid {...commonProps} isCut={isCut} />;
    } else {
      return <StorageItemListRow {...commonProps} isCut={isCut} />;
    }
  };

  // Wrap directories with FolderDropTarget for drag-and-drop upload
  if (isDirectory) {
    return (
      <FolderDropTarget folderPath={item.path}>{renderItem()}</FolderDropTarget>
    );
  }

  // For files, render normally
  return renderItem();
};

export default StorageItem;
