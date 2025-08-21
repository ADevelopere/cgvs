"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Box,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
    useStorageManagement,
} from "@/contexts/storage/StorageManagementContext";
import FileSelector from "./FileSelector";
import { StorageItem } from "@/contexts/storage/storage.type";
import { UploadLocation } from "@/graphql/generated/types";
import UploadList from "./UploadList";
import { UPLOAD_LOCATIONS } from "@/contexts/storage/storage.location";

interface FileSelectorModalProps {
    open: boolean;
    onClose: () => void;
    onSelectFile: (file: StorageItem) => void;
    location: UploadLocation;
    selectedUrl?: string | null;
}

const FileSelectorModalContent: React.FC<Omit<
    FileSelectorModalProps,
    "open"
>> = ({ onClose, onSelectFile, location, selectedUrl }) => {
    const { items, loading, params, navigateTo, startUpload } =
        useStorageManagement();
    const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);

    useEffect(() => {
        const locationInfo = UPLOAD_LOCATIONS[location];
        if (locationInfo) {
            navigateTo(locationInfo.path);
        }
    }, [location, navigateTo]);

    const handleSelect = () => {
        if (selectedItem) {
            onSelectFile(selectedItem);
            onClose();
        }
    };

    const handleFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement | null;
        const files = target?.files;
        if (files && files.length > 0) {
            startUpload(Array.from(files), params.path);
        }
    };

    const triggerUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.onchange = handleFileChange;
        input.click();
    };

    return (
        <>
            <DialogTitle>
                Select File
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <FileSelector
                    items={items.filter(item => item.__typename === 'FileInfo') as any}
                    onSelectItem={setSelectedItem}
                    onUpload={triggerUpload}
                    selectedUrl={selectedItem && selectedItem.__typename === 'FileInfo' ? selectedItem.url ?? selectedUrl : selectedUrl}
                    loading={loading}
                />
            </DialogContent>
            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={onClose} sx={{ mr: 1 }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSelect}
                    variant="contained"
                    disabled={!selectedItem}
                >
                    Select
                </Button>
            </Box>
            <UploadList />
        </>
    );
};

const FileSelectorModal: React.FC<FileSelectorModalProps> = (props) => {
    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
                <FileSelectorModalContent {...props} />
        </Dialog>
    );
};

export default FileSelectorModal;
