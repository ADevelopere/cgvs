import React, { useState } from "react";
import { action } from "@storybook/addon-actions";
import * as Graphql from "@/graphql/generated/types";
import { UploadFileState } from "@/contexts/storage/storage.type";

export interface FilePickerWrapperProps {
    initialLocation?: Graphql.UploadLocation;
    initialFiles?: Graphql.FileInfo[];
    initialViewMode?: "grid" | "list";
    preSelected?: Graphql.FileInfo[];
    loading?: boolean;
    error?: string;
    children: (props: FilePickerWrapperState) => React.ReactNode;
}

export interface FilePickerWrapperState {
    // Location state
    location: Graphql.UploadLocation | undefined;
    changeLocation: (newLocation: Graphql.UploadLocation) => void;

    // Selection state
    selectedFiles: Graphql.FileInfo[];
    setSelectedFiles: (files: Graphql.FileInfo[]) => void;
    clearSelection: () => void;

    // View mode state
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;

    // Upload state
    uploadFiles: Map<string, UploadFileState>;
    isUploading: boolean;
    uploadToLocation: (files: File[]) => Promise<void>;
    clearUploads: () => void;
    cancelUpload: (fileKey?: string) => void;
    retryFile: (fileKey: string) => Promise<void>;

    // File management
    files: Graphql.FileInfo[];
    loading: boolean;
    error?: string;
    isFileProhibited: (file: Graphql.FileInfo) => boolean;
    refreshFiles: () => Promise<void>;
}

/**
 * A reusable wrapper component that provides all the necessary state management
 * for FilePicker and FilePickerDialog stories. This eliminates code duplication
 * across different story files.
 */
const FilePickerWrapper: React.FC<FilePickerWrapperProps> = ({
    initialLocation = "TEMPLATE_COVER",
    initialFiles = [],
    initialViewMode = "grid",
    preSelected = [],
    loading = false,
    error,
    children,
}) => {
    // Location state
    const [location, setLocation] = useState<Graphql.UploadLocation | undefined>(initialLocation);

    // Selection state
    const [selectedFiles, setSelectedFiles] = useState<Graphql.FileInfo[]>(preSelected);

    // View mode state
    const [viewMode, setViewMode] = useState<"grid" | "list">(initialViewMode);

    // Upload state
    const [uploadFiles, setUploadFiles] = useState<Map<string, UploadFileState>>(new Map());
    const [isUploading, setIsUploading] = useState(false);

    // Location change handler
    const changeLocation = (newLocation: Graphql.UploadLocation) => {
        setLocation(newLocation);
        action("changeLocation")(newLocation);
    };

    // Selection handlers
    const handleSetSelectedFiles = (files: Graphql.FileInfo[]) => {
        setSelectedFiles(files);
        action("setSelectedFiles")(files);
    };

    const clearSelection = () => {
        setSelectedFiles([]);
        action("clearSelection")();
    };

    // Upload handlers
    const uploadToLocation = async (files: File[]) => {
        action("uploadToLocation")(files);
        setIsUploading(true);
        
        // Mock upload process
        const newUploads = new Map(uploadFiles);
        files.forEach((file) => {
            const key = `${file.name}-${file.size}`;
            newUploads.set(key, {
                file,
                progress: 0,
                status: "uploading",
            });
        });
        setUploadFiles(newUploads);

        // Simulate upload progress
        setTimeout(() => {
            const updatedUploads = new Map(newUploads);
            files.forEach((file) => {
                const key = `${file.name}-${file.size}`;
                const existing = updatedUploads.get(key);
                if (existing) {
                    updatedUploads.set(key, {
                        ...existing,
                        progress: 100,
                        status: "success",
                    });
                }
            });
            setUploadFiles(updatedUploads);
            setIsUploading(false);
        }, 2000);
    };

    const clearUploads = () => {
        action("clearUploads")();
        setUploadFiles(new Map());
    };

    const cancelUpload = (fileKey?: string) => {
        action("cancelUpload")(fileKey);
        if (fileKey) {
            // Cancel specific file
            const updatedUploads = new Map(uploadFiles);
            const existing = updatedUploads.get(fileKey);
            if (existing) {
                updatedUploads.set(fileKey, {
                    ...existing,
                    status: "error",
                    error: "Upload cancelled by user",
                });
                setUploadFiles(updatedUploads);
            }
        } else {
            // Cancel all uploads
            const updatedUploads = new Map();
            uploadFiles.forEach((fileState, key) => {
                if (fileState.status === "uploading" || fileState.status === "pending") {
                    updatedUploads.set(key, {
                        ...fileState,
                        status: "error",
                        error: "Upload cancelled by user",
                    });
                } else {
                    updatedUploads.set(key, fileState);
                }
            });
            setUploadFiles(updatedUploads);
            setIsUploading(false);
        }
    };

    const retryFile = async (fileKey: string) => {
        action("retryFile")(fileKey);
        const updatedUploads = new Map(uploadFiles);
        const existing = updatedUploads.get(fileKey);
        if (existing) {
            // Reset file to uploading state
            updatedUploads.set(fileKey, {
                ...existing,
                status: "uploading",
                progress: 0,
                error: undefined,
            });
            setUploadFiles(updatedUploads);
            setIsUploading(true);

            // Simulate retry upload process
            setTimeout(() => {
                const finalUploads = new Map(updatedUploads);
                const retryFile = finalUploads.get(fileKey);
                if (retryFile) {
                    finalUploads.set(fileKey, {
                        ...retryFile,
                        progress: 100,
                        status: "success",
                    });
                    setUploadFiles(finalUploads);
                    setIsUploading(false);
                }
            }, 2000);
        }
    };

    // File management handlers
    const isFileProhibited = (file: Graphql.FileInfo) => {
        // Simulate some files being prohibited
        return file.name.includes("prohibited");
    };

    const refreshFiles = async () => {
        action("refreshFiles")();
    };

    const wrapperState: FilePickerWrapperState = {
        // Location state
        location,
        changeLocation,

        // Selection state
        selectedFiles,
        setSelectedFiles: handleSetSelectedFiles,
        clearSelection,

        // View mode state
        viewMode,
        setViewMode,

        // Upload state
        uploadFiles,
        isUploading,
        uploadToLocation,
        clearUploads,
        cancelUpload,
        retryFile,

        // File management
        files: initialFiles,
        loading,
        error,
        isFileProhibited,
        refreshFiles,
    };

    return <>{children(wrapperState)}</>;
};

export default FilePickerWrapper;