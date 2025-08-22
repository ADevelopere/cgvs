"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import { useStorageGraphQL } from "./StorageGraphQLContext";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
    StorageItem,
    UploadFileState,
} from "./storage.type";
import { 
    getLocationInfo,
    isFileTypeAllowed,
    getStoragePath,
} from "./storage.location";
import { inferContentType, getFileKey } from "./storage.util";
import * as Graphql from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";

export interface FileSelectorContextType {
    // Current location
    location?: Graphql.UploadLocation;
    setLocation: (location: Graphql.UploadLocation) => void;

    // Files from the location
    files: Graphql.FileInfo[];
    loading: boolean;
    error?: string;

    // Selection state
    selectedFiles: Graphql.FileInfo[];
    setSelectedFiles: (files: Graphql.FileInfo[]) => void;
    toggleFileSelection: (file: Graphql.FileInfo) => void;
    clearSelection: () => void;

    // Upload state
    uploadFiles: Map<string, UploadFileState>;
    isUploading: boolean;

    // Actions
    refreshFiles: () => Promise<void>;
    uploadToLocation: (files: File[]) => Promise<void>;
    cancelUpload: (fileKey?: string) => void;
    retryUpload: (fileKey: string) => Promise<void>;
    clearUploads: () => void;
}

const FileSelectorContext = createContext<FileSelectorContextType | undefined>(
    undefined
);

export const useFileSelector = () => {
    const ctx = useContext(FileSelectorContext);
    if (!ctx) {
        throw new Error(
            "useFileSelector must be used within a FileSelectorProvider"
        );
    }
    return ctx;
};

export const FileSelectorProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const gql = useStorageGraphQL();
    const notifications = useNotifications();
    const translations = useAppTranslation("storageTranslations");

    // State
    const [location, setLocationState] = useState<Graphql.UploadLocation>();
    const [files, setFiles] = useState<Graphql.FileInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [selectedFiles, setSelectedFiles] = useState<Graphql.FileInfo[]>([]);
    const [uploadFiles, setUploadFiles] = useState<Map<string, UploadFileState>>(
        new Map()
    );
    const [isUploading, setIsUploading] = useState(false);

    const setLocation = useCallback((newLocation: Graphql.UploadLocation) => {
        setLocationState(newLocation);
        setSelectedFiles([]);
        setError(undefined);
    }, []);

    const toggleFileSelection = useCallback((file: Graphql.FileInfo) => {
        setSelectedFiles(prev => {
            const isSelected = prev.some(selected => selected.path === file.path);
            if (isSelected) {
                return prev.filter(selected => selected.path !== file.path);
            }
            return [...prev, file];
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedFiles([]);
    }, []);

    const refreshFiles = useCallback(async () => {
        if (!location) return;

        const locationInfo = getLocationInfo(location);
        const storagePath = getStoragePath(locationInfo.path.startsWith("public/") 
            ? locationInfo.path.substring(7) 
            : locationInfo.path);

        setLoading(true);
        setError(undefined);

        try {
            const result = await gql.listFilesQuery({
                input: {
                    path: storagePath,
                    limit: 100,
                    offset: 0,
                }
            });

            if (result.listFiles?.items) {
                // Filter only files (not folders) and allowed content types
                const filteredFiles = result.listFiles.items
                    .filter((item: any): item is Graphql.FileInfo => 
                        item.__typename === "FileInfo" &&
                        item.contentType &&
                        isFileTypeAllowed(location, item.contentType as Graphql.ContentType)
                    );

                setFiles(filteredFiles);
            } else {
                setFiles([]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load files";
            setError(message);
            notifications.show(message, { severity: "error" });
        } finally {
            setLoading(false);
        }
    }, [location, gql, notifications]);

    const uploadToLocation = useCallback(async (filesToUpload: File[]) => {
        if (!location) return;

        const locationInfo = getLocationInfo(location);
        setIsUploading(true);

        // Initialize upload states
        const newUploadFiles = new Map(uploadFiles);
        filesToUpload.forEach(file => {
            const fileKey = getFileKey(file);
            newUploadFiles.set(fileKey, {
                file,
                progress: 0,
                status: "pending",
            });
        });
        setUploadFiles(newUploadFiles);

        for (const file of filesToUpload) {
            const fileKey = getFileKey(file);
            const contentType = inferContentType(file);

            // Check if file type is allowed
            if (!isFileTypeAllowed(location, contentType)) {
                newUploadFiles.set(fileKey, {
                    ...newUploadFiles.get(fileKey)!,
                    status: "error",
                    error: `File type ${contentType} not allowed for this location`,
                });
                setUploadFiles(new Map(newUploadFiles));
                continue;
            }

            try {
                // Update status to uploading
                newUploadFiles.set(fileKey, {
                    ...newUploadFiles.get(fileKey)!,
                    status: "uploading",
                });
                setUploadFiles(new Map(newUploadFiles));

                // Get signed URL
                const signedUrlResult = await gql.generateUploadSignedUrlMutation({
                    input: {
                        fileName: file.name,
                        contentType,
                        location,
                    }
                });

                if (!signedUrlResult.data?.generateUploadSignedUrl) {
                    throw new Error("Failed to get upload URL");
                }

                const signedUrl = signedUrlResult.data.generateUploadSignedUrl;

                // Upload file with progress tracking
                const xhr = new XMLHttpRequest();
                
                await new Promise<void>((resolve, reject) => {
                    xhr.upload.addEventListener("progress", (event) => {
                        if (event.lengthComputable) {
                            const progress = (event.loaded / event.total) * 100;
                            newUploadFiles.set(fileKey, {
                                ...newUploadFiles.get(fileKey)!,
                                progress,
                            });
                            setUploadFiles(new Map(newUploadFiles));
                        }
                    });

                    xhr.addEventListener("load", () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            newUploadFiles.set(fileKey, {
                                ...newUploadFiles.get(fileKey)!,
                                status: "success",
                                progress: 100,
                            });
                            setUploadFiles(new Map(newUploadFiles));
                            resolve();
                        } else {
                            reject(new Error(`Upload failed with status ${xhr.status}`));
                        }
                    });

                    xhr.addEventListener("error", () => {
                        reject(new Error("Upload failed"));
                    });

                    xhr.open("PUT", signedUrl);
                    xhr.setRequestHeader("Content-Type", file.type);
                    xhr.send(file);

                    // Store xhr for potential cancellation
                    newUploadFiles.set(fileKey, {
                        ...newUploadFiles.get(fileKey)!,
                        xhr,
                    });
                    setUploadFiles(new Map(newUploadFiles));
                });

            } catch (err) {
                const message = err instanceof Error ? err.message : "Upload failed";
                newUploadFiles.set(fileKey, {
                    ...newUploadFiles.get(fileKey)!,
                    status: "error",
                    error: message,
                });
                setUploadFiles(new Map(newUploadFiles));
                notifications.show(`Failed to upload ${file.name}: ${message}`, { 
                    severity: "error" 
                });
            }
        }

        setIsUploading(false);
        
        // Refresh files to show newly uploaded files
        await refreshFiles();
    }, [location, uploadFiles, gql, notifications, refreshFiles]);

    const cancelUpload = useCallback((fileKey?: string) => {
        const newUploadFiles = new Map(uploadFiles);

        if (fileKey) {
            const fileState = newUploadFiles.get(fileKey);
            if (fileState?.xhr) {
                fileState.xhr.abort();
            }
            newUploadFiles.delete(fileKey);
        } else {
            // Cancel all uploads
            newUploadFiles.forEach((fileState) => {
                if (fileState.xhr) {
                    fileState.xhr.abort();
                }
            });
            newUploadFiles.clear();
        }

        setUploadFiles(newUploadFiles);
        setIsUploading(false);
    }, [uploadFiles]);

    const retryUpload = useCallback(async (fileKey: string) => {
        const fileState = uploadFiles.get(fileKey);
        if (!fileState || fileState.status !== "error") return;

        await uploadToLocation([fileState.file]);
    }, [uploadFiles, uploadToLocation]);

    const clearUploads = useCallback(() => {
        setUploadFiles(new Map());
        setIsUploading(false);
    }, []);

    // Load files when location changes
    useEffect(() => {
        if (location) {
            refreshFiles();
        }
    }, [location, refreshFiles]);

    const value: FileSelectorContextType = {
        location,
        setLocation,
        files,
        loading,
        error,
        selectedFiles,
        setSelectedFiles,
        toggleFileSelection,
        clearSelection,
        uploadFiles,
        isUploading,
        refreshFiles,
        uploadToLocation,
        cancelUpload,
        retryUpload,
        clearUploads,
    };

    return (
        <FileSelectorContext.Provider value={value}>
            {children}
        </FileSelectorContext.Provider>
    );
};
