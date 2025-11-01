import React, { useState } from "react";
import {
  Box,
  ButtonGroup,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import {
  Download as DownloadIcon,
  DriveFileMove as MoveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as CopyIcon,
  ContentCut as CutIcon,
  ContentPaste as PasteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAppTranslation } from "@/client/locale";
import {
  StorageItemUnion,
  StorageClipboardState,
} from "@/client/views/storage/core/storage.type";
import DeleteConfirmationDialog from "../dialogs/DeleteConfirmationDialog";
import MoveToDialog from "../dialogs/MoveToDialog";
import RenameDialog from "../dialogs/RenameDialog";
interface StorageSelectionActionsProps {
  selectedItems: string[];
  searchMode: boolean;
  searchResults: StorageItemUnion[];
  items: StorageItemUnion[];
  clipboard: StorageClipboardState | null;
  onCopyItems: (items: StorageItemUnion[]) => void;
  onCutItems: (items: StorageItemUnion[]) => void;
  onPasteItems: () => Promise<boolean>;
  onRenameItem: (path: string, newName: string) => Promise<boolean>;
  onDeleteItems: (paths: string[]) => Promise<boolean>;
  onMove: (paths: string[], destination: string) => Promise<boolean>;
  clearSelection: () => void;
}

/**
 * Selection action toolbar component for the storage browser.
 * Displays action buttons when one or more items are selected.
 * Provides download, move, delete, rename, copy, cut, and paste operations.
 */
const StorageSelectionActions: React.FC<StorageSelectionActionsProps> = ({
  selectedItems,
  searchMode,
  searchResults,
  items,
  clipboard,
  onCopyItems,
  onCutItems,
  onPasteItems,
  onRenameItem,
  onDeleteItems,
  onMove,
  clearSelection,
}) => {
  const {
    storageTranslations: { ui: translations },
  } = useAppTranslation();

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  // Get the current items list (search results or regular items)
  const currentItems = searchMode ? searchResults : items;

  // Get selected item objects
  const selectedItemObjects: StorageItemUnion[] = currentItems.filter(item =>
    selectedItems.includes(item.path)
  );

  const selectedCount = selectedItems.length;
  const isSingleSelection = selectedCount === 1;
  const hasClipboard = clipboard && clipboard.items.length > 0;

  // Dialog close handlers
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleCloseMoveDialog = () => {
    setMoveDialogOpen(false);
  };

  const handleCloseRenameDialog = () => {
    setRenameDialogOpen(false);
  };

  // Handle download action
  const handleDownload = () => {
    selectedItemObjects.forEach(item => {
      if (
        item.__typename === "FileInfo" &&
        "mediaLink" in item &&
        item.mediaLink
      ) {
        // Create a temporary link to trigger download
        const fileItem = item as unknown as {
          mediaLink: string;
          name: string;
        };
        const link = document.createElement("a");
        link.href = fileItem.mediaLink;
        link.download = fileItem.name;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  // Handle move to action
  const handleMoveTo = () => {
    setMoveDialogOpen(true);
  };

  // Handle rename action
  const handleRename = () => {
    setRenameDialogOpen(true);
  };

  // Handle delete action
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  // Handle copy action
  const handleCopy = () => {
    onCopyItems(selectedItemObjects);
  };

  // Handle cut action
  const handleCut = () => {
    onCutItems(selectedItemObjects);
  };

  // Handle paste action
  const handlePaste = async () => {
    await onPasteItems();
  };

  // Check if download is available for selected items
  const canDownload = selectedItemObjects.some(
    item =>
      item.__typename === "FileInfo" && "mediaLink" in item && item.mediaLink
  );

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* Selection Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="primary" fontWeight="medium">
            {translations.selectedItems.replace(
              "%{count}",
              selectedCount.toString()
            )}
          </Typography>

          <Tooltip title={translations.clearSelection}>
            <IconButton
              size="small"
              onClick={clearSelection}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Primary Actions */}
        <ButtonGroup variant="outlined" size="small">
          {/* Download Button */}
          {canDownload && (
            <Tooltip title={translations.download}>
              <Button startIcon={<DownloadIcon />} onClick={handleDownload}>
                {translations.download}
              </Button>
            </Tooltip>
          )}

          {/* Move To Button */}
          <Tooltip title={translations.moveTo || "Move to"}>
            <Button startIcon={<MoveIcon />} onClick={handleMoveTo}>
              {translations.moveTo || "Move to"}
            </Button>
          </Tooltip>

          {/* Rename Button - Only for single selection */}
          {isSingleSelection && (
            <Tooltip title={translations.rename}>
              <Button startIcon={<EditIcon />} onClick={handleRename}>
                {translations.rename}
              </Button>
            </Tooltip>
          )}

          {/* Delete Button */}
          <Tooltip title={translations.delete}>
            <Button
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              color="error"
            >
              {translations.delete}
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Clipboard Actions */}
        <ButtonGroup variant="text" size="small">
          {/* Copy Button */}
          <Tooltip title={translations.copy}>
            <IconButton onClick={handleCopy} size="small">
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Cut Button */}
          <Tooltip title={translations.cut}>
            <IconButton onClick={handleCut} size="small">
              <CutIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Paste Button */}
          <Tooltip
            title={
              hasClipboard
                ? translations.paste
                : translations.noItemsInClipboard
            }
          >
            <span>
              <IconButton
                onClick={handlePaste}
                disabled={!hasClipboard}
                size="small"
              >
                <PasteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </ButtonGroup>
      </Stack>

      {/* Clipboard Status */}
      {hasClipboard && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {clipboard.operation === "copy"
              ? translations.itemsCopied.replace(
                  "%{count}",
                  clipboard.items.length.toString()
                )
              : translations.itemsCut.replace(
                  "%{count}",
                  clipboard.items.length.toString()
                )}
          </Typography>
        </Box>
      )}

      {/* Dialogs */}
      <>
        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          items={selectedItemObjects}
          onDelete={onDeleteItems}
        />

        {/* Move To Dialog */}
        <MoveToDialog
          open={moveDialogOpen}
          onClose={handleCloseMoveDialog}
          items={selectedItemObjects}
          onMove={onMove}
        />

        {/* Rename Dialog */}
        <RenameDialog
          open={renameDialogOpen}
          onClose={handleCloseRenameDialog}
          item={isSingleSelection ? selectedItemObjects[0] : null}
          onRename={onRenameItem}
        />
      </>
    </Box>
  );
};

export default StorageSelectionActions;
