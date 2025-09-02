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
        viewMode,
        toggleSelect,
        navigateTo,
        setFocusedItem,
        clipboard,
    } = useStorageManagementUI();

    const isSelected = selectedItems.includes(item.path);
    const isCut = clipboard?.operation === 'cut' && 
                  clipboard.items.some(clipItem => clipItem.path === item.path);
    const isDirectory = item.__typename === 'DirectoryEntity';

    // Handle click events for selection
    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        
        // Set focused item for keyboard navigation
        setFocusedItem(item.path);
        
        // For now, all click types use toggleSelect
        // The UI context will handle the different selection behaviors
        toggleSelect(item.path);
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
        
        // If item is not selected, select it first
        if (!isSelected) {
            toggleSelect(item.path);
            setFocusedItem(item.path);
        }

        // Context menu will be implemented in Phase 5 with FileMenu/FolderMenu components
        // For now, just prevent the default browser context menu
    };

    // Common props for both view types
    const commonProps = {
        item,
        isSelected,
        onClick: handleClick,
        onDoubleClick: handleDoubleClick,
        onContextMenu: handleContextMenu,
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