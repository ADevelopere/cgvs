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
import { useStorageClipboard } from "@/client/views/storage/hooks/useStorageClipboard";
import { useStorageFileOperations } from "@/client/views/storage/hooks/useStorageFileOperations";
import { useStorageNavigation } from "@/client/views/storage/hooks/useStorageNavigation";
import { StorageItem } from "@/client/views/storage/hooks/storage.type";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";

export interface FolderMenuProps {
  anchorPosition?: {
    top: number;
    left: number;
  };
  open: boolean;
  onClose: () => void;
  folder: Graphql.DirectoryInfo;
}

const FolderMenu: React.FC<FolderMenuProps> = ({
  anchorPosition,
  open,
  onClose,
  folder,
}) => {
  const theme = useTheme();
  const { ui: translations } = useAppTranslation("storageTranslations");
  const { navigateTo, refresh } = useStorageNavigation();
  const { copyItems, cutItems, pasteItems, clipboard } = useStorageClipboard();
  const { renameItem, deleteItems } = useStorageFileOperations();

  // State for confirmation dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPasting, setIsPasting] = useState(false);

  // Handle menu actions
  const handleOpen = () => {
    navigateTo(folder.path);
    onClose();
  };

  const handleCopy = () => {
    copyItems([folder as StorageItem]);
    onClose();
  };

  const handleCut = () => {
    cutItems([folder as StorageItem]);
    onClose();
  };

  const handlePaste = async () => {
    setIsPasting(true);
    const success = await pasteItems();
    setIsPasting(false);
    if (success) {
      refresh();
    }
    onClose();
  };

  const handleRename = () => {
    // Simple prompt for now - will be replaced with RenameDialog component later
    const folderName = folder.name;
    const newName = prompt("Enter new name:", folderName);
    if (newName && newName !== folderName) {
      renameItem(folder.path, newName);
    }
    onClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    onClose();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const success = await deleteItems([folder.path]);
    setIsDeleting(false);
    setDeleteDialogOpen(false);
    if (success) {
      refresh();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleGetInfo = () => {
    setInfoDialogOpen(true);
    onClose();
  };

  const handleInfoClose = () => {
    setInfoDialogOpen(false);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  // Check if paste is available
  const isPasteAvailable = clipboard && clipboard.items.length > 0;

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
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-folder-dialog-title"
        aria-describedby="delete-folder-dialog-description"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
          },
        }}
      >
        <DialogTitle
          id="delete-folder-dialog-title"
          sx={{ color: theme.palette.text.primary }}
        >
          {translations.delete}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="delete-folder-dialog-description"
            sx={{ color: theme.palette.text.secondary }}
          >
            {translations.deleteConfirmationMessage.replace(
              "%{fileName}",
              folder.name,
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: theme.spacing(1, 3, 2) }}>
          <Button
            onClick={handleDeleteCancel}
            disabled={isDeleting}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            {translations.cancel}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={isDeleting}
            sx={{
              backgroundColor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.error.dark,
              },
            }}
            autoFocus
          >
            {isDeleting ? translations.loading : translations.delete}
          </Button>
        </DialogActions>
      </Dialog>

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
        <DialogTitle
          id="info-folder-dialog-title"
          sx={{ color: theme.palette.text.primary }}
        >
          {translations.getInfo}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            component="div"
            sx={{ color: theme.palette.text.secondary }}
          >
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
              <strong>{translations.lastModified}:</strong>{" "}
              {formatDate(folder.lastModified)}
            </div>
            <div style={{ marginBottom: theme.spacing(2) }}>
              <strong>{translations.createdAt}:</strong>{" "}
              {formatDate(folder.createdAt)}
            </div>
            {folder.isProtected && (
              <div style={{ marginBottom: theme.spacing(2) }}>
                <strong>{translations.protected}:</strong> {translations.yes}
              </div>
            )}
            {folder.protectChildren && (
              <div style={{ marginBottom: theme.spacing(2) }}>
                <strong>{translations.protectChildren}:</strong>{" "}
                {translations.yes}
              </div>
            )}
            {folder.permissions && (
              <div style={{ marginBottom: theme.spacing(2) }}>
                <strong>{translations.permissions}:</strong>
                <div
                  style={{
                    marginLeft: theme.spacing(2),
                    fontSize: "0.9em",
                  }}
                >
                  • {translations.allowUploads}:{" "}
                  {folder.permissions.allowUploads
                    ? translations.yes
                    : translations.no}
                  <br />• {translations.allowCreateFolders}:{" "}
                  {folder.permissions.allowCreateSubDirs
                    ? translations.yes
                    : translations.no}
                  <br />• {translations.allowDeleteFiles}:{" "}
                  {folder.permissions.allowDeleteFiles
                    ? translations.yes
                    : translations.no}
                  <br />• {translations.allowMoveFiles}:{" "}
                  {folder.permissions.allowMoveFiles
                    ? translations.yes
                    : translations.no}
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
