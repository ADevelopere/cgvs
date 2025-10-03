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
import { useStorageManagementUI } from "@/client/contexts/storage/StorageManagementUIContext";
import { useStorageManagementCore } from "@/client/contexts/storage/StorageManagementCoreContext";
import { useStorageUpload } from "@/client/contexts/storage/StorageUploadContext";
import useAppTranslation from "@/locale/useAppTranslation";
import logger from "@/utils/logger";

export interface ViewAreaMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    anchorPosition?: {
        top: number;
        left: number;
    };
    onContextMenu?: (event: React.MouseEvent) => void;
}

const ViewAreaMenu: React.FC<ViewAreaMenuProps> = ({
    anchorEl,
    open,
    onClose,
    anchorPosition,
    onContextMenu,
}) => {
    const theme = useTheme();
    const { ui: translations } = useAppTranslation("storageTranslations");
    const { pasteItems, refresh, selectAll, clipboard, params } =
        useStorageManagementUI();
    const { createFolder } = useStorageManagementCore();
    const { startUpload } = useStorageUpload();

    const [isPasting, setIsPasting] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

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

        input.onchange = async (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                try {
                    logger.info(
                        `Starting upload of ${files.length} files to ${params.path}`,
                    );

                    await startUpload(Array.from(files), params.path, {
                        onComplete: () => {
                            logger.info("Upload completed successfully");
                            refresh(); // Refresh the file list after upload
                        },
                    });
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

    const handleNewFolder = React.useCallback(async () => {
        // Simple prompt for now - will be replaced with a proper dialog later
        const folderName = prompt("Enter folder name:");
        if (folderName?.trim()) {
            setIsCreatingFolder(true);
            const success = await createFolder(params.path, folderName.trim());
            setIsCreatingFolder(false);
            if (success) {
                refresh();
            }
        }
        onClose();
    }, [createFolder, onClose, params.path, refresh]);

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
        [clipboard],
    );

    return (
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

            <MenuItem onClick={handleNewFolder} disabled={isCreatingFolder}>
                <ListItemIcon>
                    <NewFolderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                    {isCreatingFolder
                        ? translations.loading
                        : translations.newFolder}
                </ListItemText>
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
    );
};

export default React.memo(ViewAreaMenu);
