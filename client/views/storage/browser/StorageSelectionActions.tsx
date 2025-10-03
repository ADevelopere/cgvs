import React, { useState } from 'react';
import {
    Box,
    ButtonGroup,
    Button,
    IconButton,
    Tooltip,
    Typography,
    Divider,
    Stack,
} from '@mui/material';
import {
    Download as DownloadIcon,
    DriveFileMove as MoveIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    FileCopy as CopyIcon,
    ContentCut as CutIcon,
    ContentPaste as PasteIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useStorageManagementUI } from '@/client/contexts/storage/StorageManagementUIContext';
import useAppTranslation from '@/locale/useAppTranslation';
import { StorageItem } from '@/client/contexts/storage/storage.type';
import DeleteConfirmationDialog from '../dialogs/DeleteConfirmationDialog';
import MoveToDialog from '../dialogs/MoveToDialog';
import RenameDialog from '../dialogs/RenameDialog';

/**
 * Selection action toolbar component for the storage browser.
 * Displays action buttons when one or more items are selected.
 * Provides download, move, delete, rename, copy, cut, and paste operations.
 */
const StorageSelectionActions: React.FC = () => {
    const {
        selectedItems,
        items,
        searchResults,
        searchMode,
        clipboard,
        clearSelection,
        copyItems,
        cutItems,
        pasteItems,
        loading,
    } = useStorageManagementUI();
    const { ui: translations } = useAppTranslation('storageTranslations');

    // Dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);

    // Get the current items list (search results or regular items)
    const currentItems = searchMode ? searchResults : items;
    
    // Get selected item objects
    const selectedItemObjects: StorageItem[] = currentItems.filter(item =>
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
            if (item.__typename === 'FileInfo' && 'mediaLink' in item && item.mediaLink) {
                // Create a temporary link to trigger download
                const fileItem = item as unknown as { mediaLink: string; name: string };
                const link = document.createElement('a');
                link.href = fileItem.mediaLink;
                link.download = fileItem.name;
                link.style.display = 'none';
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
        copyItems(selectedItemObjects);
    };

    // Handle cut action
    const handleCut = () => {
        cutItems(selectedItemObjects);
    };

    // Handle paste action
    const handlePaste = async () => {
        await pasteItems();
    };

    // Check if download is available for selected items
    const canDownload = selectedItemObjects.some(item =>
        item.__typename === 'FileInfo' && 'mediaLink' in item && item.mediaLink
    );

    return (
        <Box
            sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                {/* Selection Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="primary" fontWeight="medium">
                        {translations.selectedItems.replace('%{count}', selectedCount.toString())}
                    </Typography>
                    
                    <Tooltip title={translations.clearSelection}>
                        <IconButton
                            size="small"
                            onClick={clearSelection}
                            sx={{ color: 'text.secondary' }}
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
                            <Button
                                startIcon={<DownloadIcon />}
                                onClick={handleDownload}
                                disabled={loading.delete || loading.move}
                            >
                                {translations.download}
                            </Button>
                        </Tooltip>
                    )}

                    {/* Move To Button */}
                    <Tooltip title={translations.moveTo || 'Move to'}>
                        <Button
                            startIcon={<MoveIcon />}
                            onClick={handleMoveTo}
                            disabled={loading.delete || loading.move}
                        >
                            {translations.moveTo || 'Move to'}
                        </Button>
                    </Tooltip>

                    {/* Rename Button - Only for single selection */}
                    {isSingleSelection && (
                        <Tooltip title={translations.rename}>
                            <Button
                                startIcon={<EditIcon />}
                                onClick={handleRename}
                                disabled={loading.rename}
                            >
                                {translations.rename}
                            </Button>
                        </Tooltip>
                    )}

                    {/* Delete Button */}
                    <Tooltip title={translations.delete}>
                        <Button
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                            disabled={loading.delete}
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
                        <IconButton
                            onClick={handleCopy}
                            disabled={loading.copy}
                            size="small"
                        >
                            <CopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Cut Button */}
                    <Tooltip title={translations.cut}>
                        <IconButton
                            onClick={handleCut}
                            disabled={loading.move}
                            size="small"
                        >
                            <CutIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Paste Button */}
                    <Tooltip 
                        title={hasClipboard ? translations.paste : translations.noItemsInClipboard}
                    >
                        <span>
                            <IconButton
                                onClick={handlePaste}
                                disabled={!hasClipboard || loading.copy || loading.move}
                                size="small"
                            >
                                <PasteIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </ButtonGroup>

                {/* Loading Indicator */}
                {(loading.delete || loading.move || loading.copy || loading.rename) && (
                    <Typography variant="caption" color="text.secondary">
                        {translations.loading}...
                    </Typography>
                )}
            </Stack>

            {/* Clipboard Status */}
            {hasClipboard && (
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        {clipboard.operation === 'copy'
                            ? translations.itemsCopied.replace('%{count}', clipboard.items.length.toString())
                            : translations.itemsCut.replace('%{count}', clipboard.items.length.toString())
                        }
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
                />

                {/* Move To Dialog */}
                <MoveToDialog
                    open={moveDialogOpen}
                    onClose={handleCloseMoveDialog}
                    items={selectedItemObjects}
                />

                {/* Rename Dialog */}
                <RenameDialog
                    open={renameDialogOpen}
                    onClose={handleCloseRenameDialog}
                    item={isSingleSelection ? selectedItemObjects[0] : null}
                />
            </>
        </Box>
    );
};

export default StorageSelectionActions;