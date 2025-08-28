import React, { useState, useCallback } from "react";
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
    CloudUpload as UploadIcon,
} from "@mui/icons-material";
import FileSelector from "./FileSelector";
import * as Graphql from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";
import type { FileInfo } from "@/graphql/generated/types";
import { useFileSelector } from "@/contexts/storage/FileSelectorContext";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import {
    getLocationInfo,
    getDisplayPath,
} from "@/contexts/storage/storage.location";
import { getAcceptAttribute } from "@/contexts/storage/storage.util";

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
}) => {
    const translations = useAppTranslation("storageTranslations");
    const { selectedFiles } = useFileSelector();
    const { startUpload } = useStorageManagement();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handleConfirm = useCallback(() => {
        onSelect(selectedFiles);
        onClose();
    }, [onClose, onSelect, selectedFiles]);

    const handleFileUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(event.target.files || []);
            if (files.length > 0 && location) {
                const locationInfo = getLocationInfo(location);
                if (locationInfo?.path) {
                    startUpload(files, getDisplayPath(locationInfo.path));
                }
            }
            event.target.value = ""; // Reset input to allow re-uploading the same file
        },
        [location, startUpload],
    );

    const getDialogTitle = React.useCallback(() => {
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
    }, [title, multiple, allowUpload, translations]);

    const getConfirmText = React.useCallback(() => {
        if (confirmText) return confirmText;

        if (selectedFiles.length === 0) {
            return translations.select;
        }

        return multiple
            ? `${translations.select} (${selectedFiles.length})`
            : translations.select;
    }, [confirmText, multiple, selectedFiles.length, translations.select]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                    onClick={onClose}
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
                {allowUpload && location && (
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<UploadIcon />}
                    >
                        {translations.upload}
                        <input
                            type="file"
                            hidden
                            multiple={multiple}
                            accept={
                                location
                                    ? getAcceptAttribute(
                                          getLocationInfo(location)
                                              .allowedContentTypes,
                                      )
                                    : undefined
                            }
                            onChange={handleFileUpload}
                        />
                    </Button>
                )}
                <Box sx={{ flex: 1 }} />
                <Button onClick={onClose} color="inherit">
                    {cancelText || translations.cancel}
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={selectedFiles.length === 0}
                    startIcon={<SelectIcon />}
                >
                    {getConfirmText()}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileSelectorDialog;
