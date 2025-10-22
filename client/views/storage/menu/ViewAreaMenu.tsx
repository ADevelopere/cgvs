"use client";

import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Divider,
} from "@mui/material";
import {
  ContentPaste as PasteIcon,
  CloudUpload as UploadIcon,
  CreateNewFolder as NewFolderIcon,
  Refresh as RefreshIcon,
  SelectAll as SelectAllIcon,
} from "@mui/icons-material";
import { useStorageSelection } from "@/client/views/storage/hooks/useStorageSelection";
import { useStorageClipboard } from "@/client/views/storage/hooks/useStorageClipboard";
import { useStorageNavigation } from "@/client/views/storage/hooks/useStorageNavigation";
import { useStorageUploadOperations } from "@/client/views/storage/hooks/useStorageUploadOperations";
import { useAppTranslation } from "@/client/locale";
import logger from "@/client/lib/logger";
import CreateFolderDialog from "@/client/views/storage/dialogs/CreateFolderDialog";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export interface ViewAreaMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  anchorPosition?: {
    top: number;
    left: number;
  };
  onContextMenu?: (event: React.MouseEvent) => void;
  params: Graphql.FilesListInput;
}

const ViewAreaMenu: React.FC<ViewAreaMenuProps> = ({
  anchorEl,
  open,
  onClose,
  anchorPosition,
  onContextMenu,
  params,
}) => {
  const theme = useTheme();
  const { ui: translations } = useAppTranslation("storageTranslations");
  const { selectAll } = useStorageSelection();
  const { clipboard, pasteItems } = useStorageClipboard();
  const { refresh } = useStorageNavigation();
  const { startUpload } = useStorageUploadOperations();

  const [isPasting, setIsPasting] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);

  // Handle menu actions
  const handlePaste = React.useCallback(async () => {
    setIsPasting(true);
    const success = await pasteItems();
    setIsPasting(false);
    if (success) {
      refresh();
    }
    onClose();
  }, [onClose, pasteItems, refresh]);

  const handleUploadFiles = React.useCallback(() => {
    // Create a file input element to trigger file selection
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.style.display = "none";

    input.onchange = async event => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        try {
          logger.info(
            `Starting upload of ${files.length} files to ${params.path}`
          );

          logger.info("About to call startUpload from context menu", {
            fileCount: files.length,
            uploadPath: params.path,
            fileNames: Array.from(files).map(f => f.name),
            fileSizes: Array.from(files).map(f => f.size),
          });

          await startUpload(Array.from(files), params.path, {
            onComplete: () => {
              logger.info("Upload completed successfully");
              refresh(); // Refresh the file list after upload
            },
          });

          logger.info("startUpload call completed from context menu");
        } catch (error) {
          logger.error("Upload failed:", error);
        }
      }
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
    onClose();
  }, [onClose, params.path, startUpload, refresh]);

  const handleNewFolder = React.useCallback(() => {
    setCreateFolderDialogOpen(true);
    onClose();
  }, [onClose]);

  const handleCreateFolderSuccess = React.useCallback(() => {
    refresh();
  }, [refresh]);

  const handleRefresh = React.useCallback(() => {
    refresh();
    onClose();
  }, [onClose, refresh]);

  const handleSelectAll = React.useCallback(() => {
    selectAll();
    onClose();
  }, [onClose, selectAll]);

  // Check if paste is available
  const isPasteAvailable = React.useMemo(
    () => clipboard && clipboard.items.length > 0,
    [clipboard]
  );

  return (
    <>
      <Menu
        id="storage-view-area-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              minWidth: 200,
            },
          },
          backdrop: {
            onContextMenu: onContextMenu,
          },
        }}
        // Position the menu at the exact cursor position
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={handlePaste}
          disabled={!isPasteAvailable || isPasting}
        >
          <ListItemIcon>
            <PasteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {isPasting ? translations.loading : translations.paste}
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleUploadFiles}>
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{translations.uploadFiles}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleNewFolder}>
          <ListItemIcon>
            <NewFolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{translations.newFolder}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleRefresh}>
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{translations.refresh}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleSelectAll}>
          <ListItemIcon>
            <SelectAllIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{translations.selectAll}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={createFolderDialogOpen}
        onClose={() => setCreateFolderDialogOpen(false)}
        currentPath={params.path}
        onSuccess={handleCreateFolderSuccess}
      />
    </>
  );
};

export default React.memo(ViewAreaMenu);
