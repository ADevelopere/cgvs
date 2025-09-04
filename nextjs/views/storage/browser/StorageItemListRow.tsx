import React from 'react';
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import FileTypeIcon from './FileTypeIcon';
import { StorageItem } from '@/contexts/storage/storage.type';

interface StorageItemListRowProps {
    item: StorageItem;
    isSelected: boolean;
    onClick?: (event: React.MouseEvent) => void;
    onDoubleClick?: () => void;
    onContextMenu?: (event: React.MouseEvent) => void;
}

/**
 * Renders a single row in the list view using Material-UI Table components.
 * Displays file icon, name, size, and last modified date.
 */
const StorageItemListRow: React.FC<StorageItemListRowProps> = ({
    item,
    isSelected,
    onClick,
    onDoubleClick,
    onContextMenu,
}) => {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string): string => {
        try {
            // Handle LocalDateTime format from GraphQL
            const date = new Date(dateString);
            return formatDistanceToNow(date, { addSuffix: true });
        } catch {
            return dateString;
        }
    };

    const isDirectory = item.__typename === 'DirectoryInfo';

    return (
        <TableRow
            selected={isSelected}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onContextMenu={onContextMenu}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                    backgroundColor: 'action.selected',
                    '&:hover': {
                        backgroundColor: 'action.selected',
                    },
                },
            }}
        >
            {/* Icon and Name Column */}
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileTypeIcon 
                        item={item} 
                        sx={{ 
                            fontSize: '1.5rem',
                            color: isDirectory ? 'primary.main' : 'text.secondary',
                        }} 
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: isDirectory ? 500 : 400,
                            wordBreak: 'break-word',
                        }}
                    >
                        {item.path.split('/').pop()}
                    </Typography>
                </Box>
            </TableCell>

            {/* Size Column */}
            <TableCell align="right">
                <Typography variant="body2" color="text.secondary">
                    {isDirectory 
                        ? '—' 
                        : formatFileSize(Number('size' in item ? item.size || 0 : 0))
                    }
                </Typography>
            </TableCell>

            {/* Last Modified Column */}
            <TableCell align="right">
                <Typography variant="body2" color="text.secondary">
                    {isDirectory 
                        ? '—' 
                        : formatDate('lastModified' in item ? item.lastModified || '' : '')
                    }
                </Typography>
            </TableCell>
        </TableRow>
    );
};

export default StorageItemListRow;