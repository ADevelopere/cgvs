import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Divider,
} from "@mui/material";
import {
    Close as CloseIcon,
    CheckCircle as SelectIcon,
} from "@mui/icons-material";
import FileSelector from "./FileSelector";
import * as Graphql from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";
import type { FileInfo } from "@/graphql/generated/types";

export interface FileSelectorDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (files: FileInfo[]) => void;
    location?: Graphql.UploadLocation;
    multiple?: boolean;
    allowUpload?: boolean;
    maxSelection?: number;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    initialSelection?: FileInfo[];
    requireSelection?: boolean;
}

const FileSelectorDialog: React.FC<FileSelectorDialogProps> = ({
    open,
    onClose,
    onSelect,
    location,
    multiple = false,
    allowUpload = true,
    maxSelection,
    title,
    confirmText,
    cancelText,
    initialSelection = [],
    requireSelection = false,
}) => {
    const translations = useAppTranslation("storageTranslations");
    const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>(initialSelection);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Reset selection when dialog opens/closes
    useEffect(() => {
        if (open) {
            setSelectedFiles(initialSelection);
        }
    }, [open, JSON.stringify(initialSelection)]);

    const handleClose = () => {
        setSelectedFiles([]);
        onClose();
    };

    const handleConfirm = () => {
        onSelect(selectedFiles);
        handleClose();
    };

    const getDialogTitle = () => {
        if (title) return title;
        
        if (multiple) {
            return allowUpload 
                ? translations.selectOrUploadFiles 
                : translations.selectFiles;
        } else {
            return allowUpload 
                ? translations.selectOrUploadFile 
                : translations.selectFile;
        }
    };

    const getConfirmText = () => {
        if (confirmText) return confirmText;
        
        if (selectedFiles.length === 0) {
            return translations.select;
        }
        
        return multiple 
            ? `${translations.select} (${selectedFiles.length})`
            : translations.select;
    };

    const canConfirm = !requireSelection || selectedFiles.length > 0;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            sx={{
                "& .MuiDialog-paper": {
                    height: "90vh",
                    maxHeight: "90vh",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                }}
            >
                <Typography variant="h6" component="div">
                    {getDialogTitle()}
                </Typography>
                <IconButton
                    aria-label={translations.close}
                    onClick={handleClose}
                    sx={{ color: "grey.500" }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    p: 0,
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        overflow: "auto",
                        p: 3,
                    }}
                >
                    <FileSelector
                        location={location}
                        value={selectedFiles}
                        onChange={setSelectedFiles}
                        multiple={multiple}
                        allowUpload={allowUpload}
                        maxSelection={maxSelection}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        compact={true}
                        showLocationSelector={false}
                    />
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    color="inherit"
                >
                    {cancelText || translations.cancel}
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!canConfirm}
                    startIcon={<SelectIcon />}
                >
                    {getConfirmText()}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileSelectorDialog;
