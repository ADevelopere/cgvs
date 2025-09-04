import React from 'react';
import StorageItemGrid from './StorageItemGrid';
import StorageItemListRow from './StorageItemListRow';
import { useStorageManagementUI } from '@/contexts/storage/StorageManagementUIContext';
import { StorageItem as StorageItemType } from '@/contexts/storage/storage.type';

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

    const isSelected = selectedItems.includes(item.path);
    const isCut = clipboard?.operation === 'cut' && 
                  clipboard.items.some(clipItem => clipItem.path === item.path);
    const isDirectory = item.__typename === 'DirectoryInfo';

    // Handle click events for selection
    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        
        // Set focused item for keyboard navigation
        setFocusedItem(item.path);
        
        // Handle different selection behaviors based on modifier keys
        if (event.shiftKey && lastSelectedItem) {
            // Shift+click: Select range from last selected to current
            selectRange(lastSelectedItem, item.path);
        } else if (event.ctrlKey || event.metaKey) {
            // Ctrl+click (or Cmd+click on Mac): Toggle selection
            toggleSelect(item.path);
        } else if (!isSelected || selectedItems.length > 1) {
            // Regular click: Clear all selections and select only this item
            // Only change selection if item is not selected or multiple items are selected
            clearSelection();
            toggleSelect(item.path);
        }
    };

    // Handle double-click for navigation
    const handleDoubleClick = () => {
        if (isDirectory) {
            navigateTo(item.path);
        } else {
            // For files, we could trigger preview or download
            // For now, do nothing for files
        }
    };

    // Handle context menu (right-click)
    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent view area context menu from opening
        
        // If item is not selected, select it first
        if (!isSelected) {
            clearSelection();
            toggleSelect(item.path);
            setFocusedItem(item.path);
        }

        // The actual context menu handling is done by the child components
    };

    // Common props for both view types
    const commonProps = {
        item,
        isSelected,
        onClick: handleClick,
        onDoubleClick: handleDoubleClick,
        onContextMenu: handleContextMenu,
        'data-storage-item': true, // Mark for view area click detection
    };

    // Apply cut styling if item is cut to clipboard
    const cutStyle = isCut ? {
        opacity: 0.5,
        filter: 'grayscale(50%)',
    } : {};

    // Render appropriate component based on view mode
    if (viewMode === 'grid') {
        return (
            <div style={cutStyle}>
                <StorageItemGrid {...commonProps} />
            </div>
        );
    } else {
        return (
            <div style={cutStyle}>
                <StorageItemListRow {...commonProps} />
            </div>
        );
    }
};

export default StorageItem;