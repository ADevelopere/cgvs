import React, { useState } from "react";
import { TableRow, TableCell, Typography, Box } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import FileTypeIcon from "./FileTypeIcon";
import { StorageItem, StorageClipboardState } from "@/client/views/storage/core/storage.type";
import FileMenu from "../menu/FileMenu";
import FolderMenu from "../menu/FolderMenu";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useStorageState } from "@/client/views/storage/contexts/StorageStateContext";

interface StorageItemListRowProps {
  item: StorageItem;
  isSelected: boolean;
  isCut: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  params: Graphql.FilesListInput;
  clipboard: StorageClipboardState | null;
  onNavigate: (path: string, currentParams: Graphql.FilesListInput) => Promise<void>;
  onRefresh: () => Promise<void>;
  onCopyItems: (items: StorageItem[]) => void;
  onCutItems: (items: StorageItem[]) => void;
  onPasteItems: () => Promise<boolean>;
  onRenameItem: (path: string, newName: string) => Promise<boolean>;
  onDeleteItems: (paths: string[]) => Promise<boolean>;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

/**
 * Renders a single row in the list view using Material-UI Table components.
 * Displays file icon, name, size, and last modified date.
 */
const StorageItemListRow: React.FC<StorageItemListRowProps> = ({
  item,
  isSelected,
  isCut,
  onClick,
  onDoubleClick,
  onContextMenu,
  params,
  clipboard,
  onNavigate,
  onRefresh,
  onCopyItems,
  onCutItems,
  onPasteItems,
  onRenameItem,
  onDeleteItems,
}) => {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<
    undefined | { top: number; left: number }
  >(undefined);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const { focusedItem } = useStorageState();

  const isFocused = React.useMemo(
    () => focusedItem === item.path,
    [focusedItem, item.path]
  );

  const handleCloseContextMenu = React.useCallback(() => {
    setContextMenuOpen(false);
    setContextMenuAnchor(undefined);
  }, []);

  // Global context menu management to close this menu when others open
  React.useEffect(() => {
    const handleGlobalContextMenu = () => {
      // Close this context menu when any new context menu is about to open
      handleCloseContextMenu();
    };

    // Listen for context menu events globally
    document.addEventListener("contextmenu", handleGlobalContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleGlobalContextMenu);
    };
  }, [handleCloseContextMenu]);

  const isDirectory = item.__typename === "DirectoryInfo";

  // Handle context menu
  const handleContextMenu = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation(); // Prevent view area context menu from opening

      handleCloseContextMenu();

      // Small delay to ensure previous menu is closed
      setTimeout(() => {
        setContextMenuAnchor({
          top: event.clientY,
          left: event.clientX,
        });
        setContextMenuOpen(true);
      }, 0);

      // Call the parent's context menu handler if provided
      if (onContextMenu) {
        onContextMenu(event);
      }
    },
    [handleCloseContextMenu, onContextMenu]
  );

  return (
    <>
      <TableRow
        selected={isSelected}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={handleContextMenu}
        data-storage-item="true"
        className="storage-item"
        sx={{
          height: 52,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "action.hover",
          },
          "&.Mui-selected": {
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: "action.selected",
            },
          },
          // Add focus indicator
          ...(isFocused && {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: "-2px",
          }),
          opacity: isCut ? 0.5 : 1,
        }}
      >
        {/* Icon and Name Column */}
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FileTypeIcon
              item={item}
              sx={{
                fontSize: "1.5rem",
                color: isDirectory ? "primary.main" : "text.secondary",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: isDirectory ? 500 : 400,
                wordBreak: "break-word",
              }}
            >
              {item.path.split("/").pop()}
            </Typography>
          </Box>
        </TableCell>

        {/* Size Column */}
        <TableCell align="right">
          <Typography variant="body2" color="text.secondary">
            {isDirectory
              ? "—"
              : formatFileSize(Number("size" in item ? item.size || 0 : 0))}
          </Typography>
        </TableCell>

        {/* Last Modified Column */}
        <TableCell align="right">
          <Typography variant="body2" color="text.secondary">
            {isDirectory
              ? "—"
              : formatDate(
                  "lastModified" in item ? item.lastModified || "" : ""
                )}
          </Typography>
        </TableCell>
      </TableRow>

      {/* Context Menus */}
      {isDirectory ? (
        <FolderMenu
          anchorPosition={contextMenuAnchor}
          open={contextMenuOpen}
          onClose={handleCloseContextMenu}
          folder={item}
          params={params}
          onNavigate={onNavigate}
          onRefresh={onRefresh}
          onCopyItems={onCopyItems}
          onCutItems={onCutItems}
          onPasteItems={onPasteItems}
          clipboard={clipboard}
          onRenameItem={onRenameItem}
          onDeleteItems={onDeleteItems}
        />
      ) : (
        <FileMenu
          anchorPosition={contextMenuAnchor}
          open={contextMenuOpen}
          onClose={handleCloseContextMenu}
          file={item as Graphql.FileInfo}
          onCopyItems={onCopyItems}
          onCutItems={onCutItems}
          onRenameItem={onRenameItem}
          onDeleteItems={onDeleteItems}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};

export default StorageItemListRow;
