import {
    useFileSelector,
    FileSelectorProvider,
    FileSelectorProviderProps,
} from "@/contexts/storage/FileSelectorContext";
import FileSelectorDialog, {
    FilePickerDialogProps,
} from "@/views/storage/filePicker/FilePickerDialog";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import FilePicker, { FilePickerProps } from "./FilePicker";
import UploadDropzone from "../upload/UploadDropzone";
import React from "react";
import FilePickerLocationSelector from "./LocationSelector";
import { UploadLocation } from "@/graphql/generated/types";
import { UploadFileState } from "@/contexts/storage";

type StorageFilePickerProps = Omit<FileSelectorProviderProps, "children"> & {
    open: boolean;
    onClose?: () => void;
    changeLocationEnabled?: boolean;
    title?: string;
    confirmText?: string;
    cancelText?: string;
};

type StorageFilePickerContentProps = StorageFilePickerProps &
    Omit<FilePickerDialogProps, "children"> &
    FilePickerProps & {
        uploadToLocation: (files: File[]) => Promise<void>;
        uploadFiles: Map<string, UploadFileState>;

        isUploading: boolean;
        clearUploads: () => void;
        changeLocation: (location: UploadLocation) => void;
        cancelUpload: (fileKey?: string) => void;
        retryFile: (fileKey: string) => Promise<void>;
    };

export const StorageFilePickerContent: React.FC<
    StorageFilePickerContentProps
> = ({
    open,
    onClose,
    multiple = false,
    allowUpload = true,
    changeLocationEnabled = false,
    maxSelection,
    title,
    confirmText,
    cancelText,

    selectedFiles,
    location,

    startUpload,
    cancelUpload,
    retryFile,

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
}) => {
    return (
        <FileSelectorDialog
            open={open}
            onClose={onClose}
            selectedFiles={selectedFiles}
            startUpload={startUpload}
            location={location}
            multiple={multiple}
            allowUpload={allowUpload}
            title={title}
            confirmText={confirmText}
            cancelText={cancelText}
        >
            {changeLocationEnabled && (
                <FilePickerLocationSelector
                    value={location}
                    onChange={changeLocation}
                    disabled={!changeLocationEnabled}
                />
            )}
            {allowUpload && location && (
                <UploadDropzone
                    location={location}
                    uploadFiles={uploadFiles}
                    isUploading={isUploading}
                    uploadToLocation={uploadToLocation}
                    clearUploads={clearUploads}
                    cancelUpload={cancelUpload}
                    retryFile={retryFile}
                />
            )}
            <FilePicker
                multiple={multiple}
                maxSelection={maxSelection}
                location={location}
                files={files}
                loading={loading}
                error={error}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                clearSelection={clearSelection}
                isFileProhibited={isFileProhibited}
                refreshFiles={refreshFiles}
            />
        </FileSelectorDialog>
    );
};

const Picker: React.FC<StorageFilePickerProps> = (props) => {
    const fileSelector = useFileSelector();

    const { startUpload, cancelUpload, retryFile } = useStorageManagement();
    return (
        <StorageFilePickerContent
            {...props}
            {...fileSelector}
            retryFile={retryFile}
            cancelUpload={cancelUpload}
            startUpload={startUpload}
        />
    );
};

const StorageFilePicker: React.FC<StorageFilePickerProps> = (props) => {
    return (
        <FileSelectorProvider {...props}>
            <Picker {...props} />
        </FileSelectorProvider>
    );
};

export default StorageFilePicker;
