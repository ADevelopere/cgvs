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
import FilePicker from "./FilePicker";
import * as Graphql from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";

import {
    getLocationInfo,
    getDisplayPath,
} from "@/contexts/storage/storage.location";
import { getAcceptAttribute, UploadFileState } from "@/contexts/storage";

export type FileSelectorDialogProps = {
    open: boolean;
    onClose?: () => void;
    selectedFiles: Graphql.FileInfo[];
    startUpload: (files: File[], targetPath?: string) => Promise<void>;
    location?: Graphql.UploadLocation;
    multiple?: boolean;
    allowUpload?: boolean;
    maxSelection?: number;
    title?: string;
    confirmText?: string;
    cancelText?: string;

    changeLocation: (newLocation: Graphql.UploadLocation) => void;

    // Files from the location
    files: Graphql.FileInfo[];
    loading: boolean;
    error?: string;

    // Selection state
    setSelectedFiles: (files: Graphql.FileInfo[]) => void;
    clearSelection: () => void;

    isFileProhibited: (file: Graphql.FileInfo) => boolean;

    refreshFiles: () => Promise<void>;

    uploadToLocation: (files: File[]) => Promise<void>;
    uploadFiles: Map<string, UploadFileState>;

    isUploading: boolean;
    clearUploads: () => void;

    cancelUpload: (fileKey?: string) => void;
    retryFile: (fileKey: string) => Promise<void>;
};

const FileSelectorDialog: React.FC<FileSelectorDialogProps> = ({
    open,
    onClose,
    selectedFiles,
    startUpload,
    location,
    multiple = false,
    allowUpload = true,
    maxSelection,
    title,
    confirmText,
    cancelText,

    changeLocation,
    files,
    loading,
    error,
    setSelectedFiles,
    clearSelection,
    refreshFiles,
    isFileProhibited,

    uploadToLocation,
    uploadFiles,
    isUploading,
    clearUploads,

    cancelUpload,
    retryFile,
}) => {
    const translations = useAppTranslation("storageTranslations");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handleFileUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(event.target.files || []);
            if (files.length > 0 && location) {
                const locationInfo = getLocationInfo(location);
                if (locationInfo?.path) {
                    startUpload(files, getDisplayPath(locationInfo.path)).then(
                        (r) => r,
                    );
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
    }, [
        title,
        multiple,
        allowUpload,
        translations.selectOrUploadFiles,
        translations.selectFiles,
        translations.selectOrUploadFile,
        translations.selectFile,
    ]);

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
                    <FilePicker
                        multiple={multiple}
                        allowUpload={allowUpload}
                        maxSelection={maxSelection}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        compact={true}
                        showLocationSelector={false}
                        location={location}
                        changeLocation={changeLocation}
                        files={files}
                        loading={loading}
                        error={error}
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        clearSelection={clearSelection}
                        isFileProhibited={isFileProhibited}
                        refreshFiles={refreshFiles}
                        uploadFiles={uploadFiles}
                        isUploading={isUploading}
                        uploadToLocation={uploadToLocation}
                        clearUploads={clearUploads}
                        cancelUpload={cancelUpload}
                        retryFile={retryFile}
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
                    onClick={onClose}
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
