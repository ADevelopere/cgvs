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
import { useStorageManagementUI } from "@/contexts/storage/StorageManagementUIContext";
import { useStorageManagementCore } from "@/contexts/storage/StorageManagementCoreContext";
import useAppTranslation from "@/locale/useAppTranslation";
import logger from "@/utils/logger";

export interface ViewAreaMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
}

const ViewAreaMenu: React.FC<ViewAreaMenuProps> = ({
    anchorEl,
    open,
    onClose,
}) => {
    const theme = useTheme();
    const { ui: translations } = useAppTranslation("storageTranslations");
    const {
        pasteItems,
        refresh,
        selectAll,
        clipboard,
        params,
    } = useStorageManagementUI();
    const { createFolder } = useStorageManagementCore();

    const [isPasting, setIsPasting] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    // Handle menu actions
    const handlePaste = async () => {
        setIsPasting(true);
        const success = await pasteItems();
        setIsPasting(false);
        if (success) {
            refresh();
        }
        onClose();
    };

    const handleUploadFiles = () => {
        // TODO: This will trigger the file upload functionality
        // For now, we can create a file input element
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.style.display = "none";
        
        input.onchange = (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files) {
                // TODO: Integrate with StorageUploadContext
                logger.log("Selected files for upload:", files);
                // This would call the upload functionality from StorageUploadContext
                // uploadFiles(Array.from(files), queryParams.path);
            }
        };
        
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
        onClose();
    };

    const handleNewFolder = async () => {
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
    };

    const handleRefresh = () => {
        refresh();
        onClose();
    };

    const handleSelectAll = () => {
        selectAll();
        onClose();
    };

    // Check if paste is available
    const isPasteAvailable = clipboard && clipboard.items.length > 0;

    return (
        <Menu
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
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
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

            <MenuItem 
                onClick={handleNewFolder}
                disabled={isCreatingFolder}
            >
                <ListItemIcon>
                    <NewFolderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                    {isCreatingFolder ? translations.loading : translations.newFolder}
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