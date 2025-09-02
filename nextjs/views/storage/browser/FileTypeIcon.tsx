import React from 'react';
import {
    Folder as FolderIcon,
    InsertDriveFile as FileIcon,
    Image as ImageIcon,
    VideoFile as VideoIcon,
    AudioFile as AudioIcon,
    Description as DocumentIcon,
    Archive as ArchiveIcon,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { StorageItem } from '@/contexts/storage/storage.type';
import { mimeToContentType } from '@/contexts/storage/storage.constant';

interface FileTypeIconProps extends Omit<SvgIconProps, 'component'> {
    item: StorageItem;
}

/**
 * A reusable component that displays the appropriate Material-UI icon based on file type.
 * Ensures consistency between grid and list views.
 */
const FileTypeIcon: React.FC<FileTypeIconProps> = ({ item, ...iconProps }) => {
    // Handle directory items
    if (item.__typename === 'DirectoryEntity') {
        return <FolderIcon {...iconProps} />;
    }

    // Handle file items based on MIME type
    if (item.__typename === 'FileEntity') {
        // Convert MIME type to ContentType using the utility mapping
        if (item.contentType && mimeToContentType[item.contentType]) {
            const contentType = mimeToContentType[item.contentType];
            
            // Map ContentType enum values to appropriate icons
            switch (contentType) {
                case 'JPEG':
                case 'PNG':
                case 'GIF':
                case 'WEBP':
                case 'SVG':
                    return <ImageIcon {...iconProps} />;
                case 'PDF':
                case 'TEXT':
                case 'JSON':
                    return <DocumentIcon {...iconProps} />;
                case 'OTF':
                case 'TTF':
                case 'WOFF':
                case 'WOFF2':
                    return <FileIcon {...iconProps} />;
                default:
                    return <FileIcon {...iconProps} />;
            }
        }

        // Fallback: Determine type from MIME type prefix if not in mapping
        if (item.contentType) {
            const mimeType = item.contentType.toLowerCase();
            
            if (mimeType.startsWith('image/')) {
                return <ImageIcon {...iconProps} />;
            }
            if (mimeType.startsWith('video/')) {
                return <VideoIcon {...iconProps} />;
            }
            if (mimeType.startsWith('audio/')) {
                return <AudioIcon {...iconProps} />;
            }
            if (
                mimeType.includes('pdf') ||
                mimeType.includes('document') ||
                mimeType.includes('text') ||
                mimeType.includes('msword') ||
                mimeType.includes('wordprocessingml') ||
                mimeType.includes('spreadsheet') ||
                mimeType.includes('presentation')
            ) {
                return <DocumentIcon {...iconProps} />;
            }
            if (
                mimeType.includes('zip') ||
                mimeType.includes('rar') ||
                mimeType.includes('tar') ||
                mimeType.includes('gzip') ||
                mimeType.includes('archive')
            ) {
                return <ArchiveIcon {...iconProps} />;
            }
        }

        // Final fallback for files
        return <FileIcon {...iconProps} />;
    }

    // Default fallback
    return <FileIcon {...iconProps} />;
};

export default FileTypeIcon;