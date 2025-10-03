import React from "react";
import StorageItemGrid from "./StorageItemGrid";
import StorageItemListRow from "./StorageItemListRow";
import { useStorageManagementUI } from "@/client/contexts/storage/StorageManagementUIContext";
import { StorageItem as StorageItemType } from "@/client/contexts/storage/storage.type";
import FolderDropTarget from "@/client/views/storage/dropzone/FolderDropTarget";
interface StorageItemProps {
    item: StorageItemType;
}

/**
 * The main router for an individual storage item.
 * Handles selection logic and renders either Grid or List Row component.
 * Manages drag-and-drop functionality and context menus.
 */
const StorageItem: React.FC<StorageItemProps> = ({ item }) => {
    const {
        selectedItems,
        lastSelectedItem,
        viewMode,
        toggleSelect,
        selectRange,
        clearSelection,
        navigateTo,
        setFocusedItem,
        clipboard,
    } = useStorageManagementUI();

    const isCut = React.useMemo(
        () =>
            clipboard?.operation === "cut" &&
            clipboard.items.some((clipItem) => clipItem.path === item.path),
        [clipboard?.items, clipboard?.operation, item.path],
    );

    const isDirectory = item.__typename === "DirectoryInfo";

    // Handle click events for selection
    const handleClick = React.useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            event.stopPropagation(); // Prevent event from bubbling up to view area

            // Set focused item for keyboard navigation
            setFocusedItem(item.path);

            // We'll check selection state inside the actual operation functions
            // to avoid stale closures

            // Handle different selection behaviors based on modifier keys
            if (event.shiftKey && lastSelectedItem) {
                // Shift+click: Select range from last selected to current
                selectRange(lastSelectedItem, item.path);
            } else if (event.ctrlKey || event.metaKey) {
                // Ctrl+click (or Cmd+click on Mac): Toggle selection
                toggleSelect(item.path);
            } else {
                // Regular click: Clear all selections and select only this item

                // Always clear and select for regular clicks to maintain consistency
                clearSelection();
                toggleSelect(item.path);
            }
        },
        [
            clearSelection,
            item.path,
            lastSelectedItem,
            selectRange,
            setFocusedItem,
            toggleSelect,
        ],
    );

    // Handle double-click for navigation
    const handleDoubleClick = React.useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            event.stopPropagation(); // Prevent event from bubbling up to view area

            if (isDirectory) {
                navigateTo(item.path).then((r) => r);
            } else {
                // For files, we could trigger preview or download
                // For now, do nothing for files
            }
        },
        [isDirectory, item.path, navigateTo],
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
        [clearSelection, item.path, setFocusedItem, toggleSelect],
    );

    // Common props for both view types
    const commonProps = React.useMemo(
        () => ({
            item,
            isSelected: selectedItems.includes(item.path),
            onClick: handleClick,
            onDoubleClick: handleDoubleClick,
            onContextMenu: handleContextMenu,
        }),
        [
            handleClick,
            handleContextMenu,
            handleDoubleClick,
            item,
            selectedItems,
        ],
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
            <FolderDropTarget folderPath={item.path}>
                {renderItem()}
            </FolderDropTarget>
        );
    }

    // For files, render normally
    return renderItem();
};

export default StorageItem;
