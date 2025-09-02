import React from 'react';
import { Box, Skeleton } from '@mui/material';
import FileTypeIcon from './FileTypeIcon';
import { StorageItem } from '@/contexts/storage/storage.type';
import { mimeToContentType } from '@/contexts/storage/storage.constant';

interface FilePreviewProps {
    file: StorageItem;
    loading?: boolean;
    height?: number | string;
}

/**
 * Renders the large preview area within the StorageItemGrid card.
 * Initially uses FileTypeIcon, can be enhanced to show actual image previews.
 */
const FilePreview: React.FC<FilePreviewProps> = ({ 
    file, 
    loading = false, 
    height = 120 
}) => {
    if (loading) {
        return (
            <Skeleton 
                variant="rectangular" 
                height={height}
                sx={{ borderRadius: 1 }}
            />
        );
    }

    // For directories, always show the folder icon
    if (file.__typename === 'DirectoryEntity') {
        return (
            <Box
                sx={{
                    height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                }}
            >
                <FileTypeIcon 
                    item={file} 
                    sx={{ 
                        fontSize: '4rem',
                        color: 'primary.main',
                    }} 
                />
            </Box>
        );
    }

        // For files, check if it's an image and could potentially show actual preview
    if (file.__typename === 'FileEntity') {
        // Use utility function to determine if this is an image file
        const isImage = file.contentType && (
            // Check if MIME type maps to an image content type
            (mimeToContentType[file.contentType] && ['JPEG', 'PNG', 'GIF', 'WEBP', 'SVG'].includes(mimeToContentType[file.contentType])) ||
            // Fallback: check MIME type prefix
            file.contentType.startsWith('image/')
        );

        // Future enhancement: For images, we could check if file has a preview/thumbnail URL
        // and use Material-UI CardMedia component with actual image display
        if (isImage) {
            // Reserved for future implementation of actual image previews
        }

        // Default icon display for all file types
        return (
            <Box
                sx={{
                    height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                }}
            >
                <FileTypeIcon 
                    item={file} 
                    sx={{ 
                        fontSize: '4rem',
                        color: 'text.secondary',
                    }} 
                />
            </Box>
        );
    }

    // Fallback
    return (
        <Box
            sx={{
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.paper',
                borderRadius: 1,
            }}
        >
            <FileTypeIcon 
                item={file} 
                sx={{ 
                    fontSize: '4rem',
                    color: 'text.secondary',
                }} 
            />
        </Box>
    );
};

export default FilePreview;