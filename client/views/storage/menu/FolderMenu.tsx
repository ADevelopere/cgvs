"use client";

import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  Divider,
} from "@mui/material";
import {
  FolderOpen as OpenIcon,
  ContentCut as CutIcon,
  ContentCopy as CopyIcon,
  ContentPaste as PasteIcon,
  Edit as RenameIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { StorageItemUnion, StorageClipboardState } from "@/client/views/storage/core/storage.type";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";
import DeleteConfirmationDialog from "@/client/views/storage/dialogs/DeleteConfirmationDialog";
import RenameDialog from "@/client/views/storage/dialogs/RenameDialog";

export interface FolderMenuProps {
  anchorPosition?: {
    top: number;
    left: number;
  };
  open: boolean;
  onClose: () => void;
  folder: Graphql.DirectoryInfo;
  params: Graphql.FilesListInput;
  onNavigate: (path: string, currentParams: Graphql.FilesListInput) => Promise<void>;
  onRefresh: () => Promise<void>;
  onCopyItems: (items: StorageItemUnion[]) => void;
  onCutItems: (items: StorageItemUnion[]) => void;
  onPasteItems: () => Promise<boolean>;
  clipboard: StorageClipboardState | null;
  onRenameItem: (path: string, newName: string) => Promise<boolean>;
  onDeleteItems: (paths: string[]) => Promise<boolean>;
}

const FolderMenu: React.FC<FolderMenuProps> = ({
  anchorPosition,
  open,
  onClose,
  folder,
  params,
  onNavigate,
  onRefresh,
  onCopyItems,
  onCutItems,
  onPasteItems,
  clipboard,
  onRenameItem,
  onDeleteItems,
}) => {
  const theme = useTheme();
  const {
    storageTranslations: { ui: translations },
  } = useAppTranslation();

  // State for confirmation dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [isPasting, setIsPasting] = useState(false);

  // Handle menu actions
  const handleOpen = React.useCallback(() => {
    onNavigate(folder.path, params);
    onClose();
  }, [folder.path, onClose, onNavigate, params]);

  const handleCopy = React.useCallback(() => {
    onCopyItems([folder as StorageItemUnion]);
    onClose();
  }, [folder, onClose, onCopyItems]);

  const handleCut = React.useCallback(() => {
    onCutItems([folder as StorageItemUnion]);
    onClose();
  }, [folder, onClose, onCutItems]);

  const handlePaste = React.useCallback(async () => {
    setIsPasting(true);
    const success = await onPasteItems();
    setIsPasting(false);
    if (success) {
      onRefresh();
    }
    onClose();
  }, [onClose, onPasteItems, onRefresh]);

  const handleRename = React.useCallback(() => {
    setRenameDialogOpen(true);
    onClose();
  }, [onClose]);

  const handleDeleteClick = React.useCallback(() => {
    setDeleteDialogOpen(true);
    onClose();
  }, [onClose]);

  const handleDeleteSuccess = React.useCallback(async () => {
    setDeleteDialogOpen(false);
    await onRefresh();
  }, [onRefresh]);

  const handleRenameSuccess = React.useCallback(async () => {
    setRenameDialogOpen(false);
    await onRefresh();
  }, [onRefresh]);

  const handleGetInfo = React.useCallback(() => {
    setInfoDialogOpen(true);
    onClose();
  }, [onClose]);

  const handleInfoClose = React.useCallback(() => {
    setInfoDialogOpen(false);
  }, []);

  // Format date for display
  const formatDate = React.useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleString();
  }, []);

  // Check if paste is available
  const isPasteAvailable = React.useMemo(() => clipboard && clipboard.items.length > 0, [clipboard]);

  return (
    <>
      <Menu
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
        <MenuItem onClick={handleOpen}>
          <ListItemIcon>
            <OpenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{translations.open}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleCut}>
          <ListItemIcon>
            <CutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{translations.cut}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleCopy}>
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{translations.copy}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handlePaste} disabled={!isPasteAvailable || isPasting}>
          <ListItemIcon>
            <PasteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{isPasting ? translations.loading : translations.paste}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleRename}>
          <ListItemIcon>
            <RenameIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{translations.rename}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{translations.delete}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleGetInfo}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{translations.getInfo}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        items={[folder as StorageItemUnion]}
        onDelete={async paths => {
          const success = await onDeleteItems(paths);
          if (success) {
            handleDeleteSuccess();
          }
          return success;
        }}
      />

      {/* Rename Dialog */}
      <RenameDialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        item={folder as StorageItemUnion}
        onRename={async (path, newName) => {
          const success = await onRenameItem(path, newName);
          if (success) {
            handleRenameSuccess();
          }
          return success;
        }}
      />

      {/* Folder Info Dialog */}
      <Dialog
        open={infoDialogOpen}
        onClose={handleInfoClose}
        aria-labelledby="info-folder-dialog-title"
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
          },
        }}
      >
        <DialogTitle id="info-folder-dialog-title" sx={{ color: theme.palette.text.primary }}>
          {translations.getInfo}
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div" sx={{ color: theme.palette.text.secondary }}>
            <div style={{ marginBottom: theme.spacing(2) }}>
              <strong>{translations.name}:</strong> {folder.name}
            </div>
            <div style={{ marginBottom: theme.spacing(2) }}>
              <strong>{translations.path}:</strong> {folder.path}
            </div>
            {folder.path && (
              <div style={{ marginBottom: theme.spacing(2) }}>
                <strong>{translations.parentPath}:</strong>{" "}
                {folder.path.split("/").slice(0, -1).join("/") || folder.path}
              </div>
            )}
            <div style={{ marginBottom: theme.spacing(2) }}>
              <strong>{translations.lastModified}:</strong> {formatDate(folder.lastModified)}
            </div>
            <div style={{ marginBottom: theme.spacing(2) }}>
              <strong>{translations.createdAt}:</strong> {formatDate(folder.createdAt)}
            </div>
            {folder.isProtected && (
              <div style={{ marginBottom: theme.spacing(2) }}>
                <strong>{translations.protected}:</strong> {translations.yes}
              </div>
            )}
            {folder.protectChildren && (
              <div style={{ marginBottom: theme.spacing(2) }}>
                <strong>{translations.protectChildren}:</strong> {translations.yes}
              </div>
            )}
            {folder.permissions && (
              <div style={{ marginBottom: theme.spacing(2) }}>
                <strong>{translations.permissions}:</strong>
                <div
                  style={{
                    marginInlineStart: theme.spacing(2),
                    fontSize: "0.9em",
                  }}
                >
                  • {translations.allowUploads}: {folder.permissions.allowUploads ? translations.yes : translations.no}
                  <br />• {translations.allowCreateFolders}:{" "}
                  {folder.permissions.allowCreateSubDirs ? translations.yes : translations.no}
                  <br />• {translations.allowDeleteFiles}:{" "}
                  {folder.permissions.allowDeleteFiles ? translations.yes : translations.no}
                  <br />• {translations.allowMoveFiles}:{" "}
                  {folder.permissions.allowMoveFiles ? translations.yes : translations.no}
                </div>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: theme.spacing(1, 3, 2) }}>
          <Button
            onClick={handleInfoClose}
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            {translations.close}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(FolderMenu);
