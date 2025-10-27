import React from "react";
import {
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Description as DocumentIcon,
  Archive as ArchiveIcon,
} from "@mui/icons-material";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { StorageItemUnion } from "@/client/views/storage/core/storage.type";
interface FileTypeIconProps extends Omit<SvgIconProps, "component"> {
  item: StorageItemUnion;
}

/**
 * A reusable component that displays the appropriate Material-UI icon based on file type.
 * Ensures consistency between grid and list views.
 */
const FileTypeIcon: React.FC<FileTypeIconProps> = ({ item, ...iconProps }) => {
  // Handle file items based on MIME type
  if (item.__typename === "FileInfo") {
    // Work directly with MIME type strings
    if (item.contentType) {
      const mimeType = item.contentType.toLowerCase();

      if (mimeType.startsWith("image/")) {
        return <ImageIcon {...iconProps} />;
      }
      if (mimeType.startsWith("video/")) {
        return <VideoIcon {...iconProps} />;
      }
      if (mimeType.startsWith("audio/")) {
        return <AudioIcon {...iconProps} />;
      }
      if (
        mimeType.includes("pdf") ||
        mimeType.includes("document") ||
        mimeType.includes("text") ||
        mimeType.includes("msword") ||
        mimeType.includes("wordprocessingml") ||
        mimeType.includes("spreadsheet") ||
        mimeType.includes("presentation")
      ) {
        return <DocumentIcon {...iconProps} />;
      }
      if (
        mimeType.includes("zip") ||
        mimeType.includes("rar") ||
        mimeType.includes("tar") ||
        mimeType.includes("gzip") ||
        mimeType.includes("archive")
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
