import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import FilePreview from './FilePreview';
import { StorageItem } from '@/contexts/storage/storage.type';

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

    return (
        <Card
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onContextMenu={onContextMenu}
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
    );
};

export default StorageItemGrid;