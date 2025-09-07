import React from "react";
import { Box, Skeleton } from "@mui/material";
import FileTypeIcon from "./FileTypeIcon";
import { FileInfo, StorageItem } from "@/contexts/storage/storage.type";
import { mimeToContentType } from "@/contexts/storage/storage.constant";
import { Folder as FolderIcon } from "@mui/icons-material";
interface FilePreviewProps {
    item: StorageItem;
    loading?: boolean;
    height?: number | string;
}

function isImage(file: FileInfo) {
    return (
        file.contentType &&
        ((mimeToContentType[file.contentType] &&
            ["JPEG", "PNG", "GIF", "WEBP", "SVG"].includes(
                mimeToContentType[file.contentType],
            )) ||
            // Fallback: check MIME type prefix
            file.contentType.startsWith("image/"))
    );
}

const FolderPreview: React.FC<{
    height?: number | string;
}> = ({ height = 120 }) => (
    <Box
        sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
            borderRadius: 1,
        }}
    >
        <FolderIcon
            sx={{
                fontSize: "4rem",
                color: "primary.main",
            }}
        />
    </Box>
);

const DefaultFilePreview: React.FC<{
    height?: number | string;
    file: FileInfo;
}> = ({ height = 120, file }) => (
    <Box
        sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
            borderRadius: 1,
        }}
    >
        <FileTypeIcon
            item={file}
            sx={{
                fontSize: "4rem",
                color: "text.secondary",
            }}
        />
    </Box>
);

/**
 * Renders the large preview area within the StorageItemGrid card.
 * Initially uses FileTypeIcon, can be enhanced to show actual image previews.
 */
const FilePreview: React.FC<FilePreviewProps> = ({
    item: file,
    loading = false,
    height = 120,
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

    // For files, check if it's an image and could potentially show actual preview
    if (file.__typename === "FileInfo") {
        // Future enhancement: For images, we could check if file has a preview/thumbnail URL
        // and use Material-UI CardMedia component with actual image display
        if (isImage(file)) {
            // Reserved for future implementation of actual image previews
        }

        // Default icon display for all file types
        return <DefaultFilePreview file={file} height={height} />;
    } else {
        return <FolderPreview height={height} />;
    }
};

export default FilePreview;
