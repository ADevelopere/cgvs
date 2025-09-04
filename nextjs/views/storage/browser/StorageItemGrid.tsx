import React, { useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import FilePreview from './FilePreview';
import { StorageItem } from '@/contexts/storage/storage.type';
import FileMenu from '../menu/FileMenu';
import FolderMenu from '../menu/FolderMenu';
import * as Graphql from '@/graphql/generated/types';
import { useStorageManagementUI } from '@/contexts/storage/StorageManagementUIContext';

interface StorageItemGridProps {
    item: StorageItem;
    isSelected: boolean;
    onClick?: (event: React.MouseEvent) => void;
    onDoubleClick?: () => void;
    onContextMenu?: (event: React.MouseEvent) => void;
}

/**
 * Renders a single "card" in the grid view using Material-UI Card components.
 * Displays a preview/icon and the item name with text truncation.
 */
const StorageItemGrid: React.FC<StorageItemGridProps> = ({
    item,
    isSelected,
    onClick,
    onDoubleClick,
    onContextMenu,
}) => {
    const isDirectory = item.__typename === 'DirectoryInfo';
    const [contextMenuPosition, setContextMenuPosition] = useState<{
        top: number;
        left: number;
    } | undefined>(undefined);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const { focusedItem } = useStorageManagementUI();
    
    const isFocused = focusedItem === item.path;

    // Global context menu management to close this menu when others open
    React.useEffect(() => {
        const handleGlobalContextMenu = () => {
            // Close this context menu when any new context menu is about to open
            handleCloseContextMenu();
        };

        // Listen for context menu events globally
        document.addEventListener('contextmenu', handleGlobalContextMenu);
        
        return () => {
            document.removeEventListener('contextmenu', handleGlobalContextMenu);
        };
    }, []);

    // Handle context menu
    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent view area context menu from opening
        
        handleCloseContextMenu();
        
        // Small delay to ensure previous menu is closed
        setTimeout(() => {
            setContextMenuPosition({
                top: event.clientY,
                left: event.clientX,
            });
            setContextMenuOpen(true);
        }, 0);
        
        // Call the parent's context menu handler if provided
        if (onContextMenu) {
            onContextMenu(event);
        }
    };

    const handleCloseContextMenu = () => {
        setContextMenuOpen(false);
        setContextMenuPosition(undefined);
    };

    return (
        <>
            <Card
                data-storage-item
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                onContextMenu={handleContextMenu}
                sx={{
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'action.selected' : 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: isSelected ? 'action.selected' : 'action.hover',
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                    },
                    border: isSelected ? 1 : 0,
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    // Add focus indicator
                    ...(isFocused && {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '2px',
                    }),
                }}
            >
                {/* Preview Area */}
                <Box sx={{ p: 1 }}>
                    <FilePreview file={item} height={120} />
                </Box>

                {/* Content Area */}
                <CardContent 
                    sx={{ 
                        pt: 0, 
                        pb: 1, 
                        px: 1,
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        '&:last-child': {
                            pb: 1,
                        },
                    }}
                >
                    <Typography
                        variant="body2"
                        component="div"
                        sx={{
                            fontWeight: isDirectory ? 500 : 400,
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3,
                            width: '100%',
                        }}
                        title={item.name}
                    >
                        {item.name}
                    </Typography>
                </CardContent>
            </Card>

            {/* Context Menus */}
            {isDirectory ? (
                <FolderMenu
                    anchorPosition={contextMenuPosition}
                    open={contextMenuOpen}
                    onClose={handleCloseContextMenu}
                    folder={item}
                />
            ) : (
                <FileMenu
                    anchorPosition={contextMenuPosition}
                    open={contextMenuOpen}
                    onClose={handleCloseContextMenu}
                    file={item as Graphql.FileInfo}
                />
            )}
        </>
    );
};

export default StorageItemGrid;