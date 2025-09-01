"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { useStorageGraphQL } from "./StorageGraphQLContext";
import {
    getLocationInfo,
    isFileTypeAllowed,
    getStoragePath,
} from "./storage.location";
import * as Graphql from "@/graphql/generated/types";
import { useNotifications } from "@toolpad/core/useNotifications";

export interface FileSelectorContextType {
    // Current location
    location?: Graphql.UploadLocation;
    changeLocation: (newLocation: Graphql.UploadLocation) => void;

    // Files from the location
    files: Graphql.FileInfo[];
    loading: boolean;
    error?: string;

    // Selection state
    selectedFiles: Graphql.FileInfo[];
    setSelectedFiles: (files: Graphql.FileInfo[]) => void;
    toggleFileSelection: (file: Graphql.FileInfo) => void;
    clearSelection: () => void;

    // Prohibited URLs (files that cannot be selected/deselected)
    prohibitedUrls: string[];
    isFileProhibited: (file: Graphql.FileInfo) => boolean;

    // Actions
    refreshFiles: () => Promise<void>;
}

const FileSelectorContext = createContext<FileSelectorContextType | undefined>(
    undefined,
);

export const useFileSelector = () => {
    const ctx = useContext(FileSelectorContext);
    if (!ctx) {
        throw new Error(
            "useFileSelector must be used within a FileSelectorProvider",
        );
    }
    return ctx;
};

export type FileSelectorProviderProps = {
    children: React.ReactNode;
    prohibitedUrls?: string[];
    initialLocation: Graphql.UploadLocation;
    multiple?: boolean;
    maxSelection?: number;
    onSelectAction?: (files: Graphql.FileInfo[]) => void;
};

export const FileSelectorProvider: React.FC<FileSelectorProviderProps> = ({
    prohibitedUrls = [],
    initialLocation,
    multiple = false,
    maxSelection,
    onSelectAction,
    children,
}) => {
    const gql = useStorageGraphQL();
    const notifications = useNotifications();

    // Use refs to store props that shouldn't trigger re-renders
    const prohibitedUrlsRef = useRef(prohibitedUrls);
    const initialLocationRef = useRef(initialLocation);

    // Update refs when props change
    prohibitedUrlsRef.current = prohibitedUrls;
    initialLocationRef.current = initialLocation;

    // State
    const [locationState, setLocationState] =
        useState<Graphql.UploadLocation>(initialLocation);
    const [files, setFiles] = useState<Graphql.FileInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [selectedFiles, setSelectedFiles] = useState<Graphql.FileInfo[]>([]);

    // Call onSelectAction whenever selectedFiles changes
    useEffect(() => {
        if (onSelectAction) {
            onSelectAction(selectedFiles);
        }
    }, [selectedFiles, onSelectAction]);

    const toggleFileSelection = useCallback(
        (file: Graphql.FileInfo) => {
            // Don't allow toggling prohibited files
            if (prohibitedUrlsRef.current.includes(file.url || "")) {
                return;
            }

            setSelectedFiles((prev) => {
                const isSelected = prev.some(
                    (selected) => selected.path === file.path,
                );
                if (isSelected) {
                    // Deselect the file
                    return prev.filter(
                        (selected) => selected.path !== file.path,
                    );
                } else if (!multiple) {
                    // Single selection mode: replace current selection
                    return [file];
                    // Select the file, respecting multiple and maxSelection
                } else {
                    // Multiple selection mode: check maxSelection
                    if (maxSelection && prev.length >= maxSelection) {
                        // At max, don't add more
                        return prev;
                    }
                    return [...prev, file];
                }
            });
        },
        [multiple, maxSelection],
    );

    const isFileProhibited = useCallback((file: Graphql.FileInfo) => {
        return prohibitedUrlsRef.current.includes(file.url || "");
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedFiles([]);
    }, []);

    const setSelectedFilesCallback = useCallback(
        (files: Graphql.FileInfo[]) => {
            // Filter out prohibited files from selection
            const allowedFiles = files.filter(
                (file) => !prohibitedUrlsRef.current.includes(file.url || ""),
            );
            setSelectedFiles(allowedFiles);
        },
        [],
    );

    // Initialize selection with files matching prohibited URLs when files are loaded
    useEffect(() => {
        if (files.length > 0 && prohibitedUrlsRef.current.length > 0) {
            const initialSelection = files.filter((file) =>
                prohibitedUrlsRef.current.includes(file.url || ""),
            );
            if (initialSelection.length > 0) {
                setSelectedFiles((prev) => {
                    // Merge with existing selection, avoiding duplicates
                    const existingPaths = prev.map((f) => f.path);
                    const newFiles = initialSelection.filter(
                        (f) => !existingPaths.includes(f.path),
                    );
                    return [...prev, ...newFiles];
                });
            }
        }
    }, [files]);

    const refreshFiles = useCallback(async () => {
        if (!locationState) return;

        const locationInfo = getLocationInfo(locationState);
        const storagePath = getStoragePath(
            locationInfo.path.startsWith("public/")
                ? locationInfo.path.substring(7)
                : locationInfo.path,
        );

        setLoading(true);
        setError(undefined);

        try {
            const result = await gql.listFilesQuery({
                input: {
                    path: storagePath,
                    limit: 100,
                    offset: 0,
                },
            });

            if (result.listFiles?.items) {
                // Filter only files (not folders) and allowed content types
                const filteredFiles = result.listFiles.items.filter(
                    (
                        item: Graphql.FileInfo | Graphql.FolderInfo,
                    ): item is Graphql.FileInfo =>
                        item.__typename === "FileInfo" &&
                        !!item.contentType &&
                        isFileTypeAllowed(locationState, item.contentType),
                );

                setFiles(filteredFiles);
            } else {
                setFiles([]);
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to load files";
            setError(message);
            notifications.show(message, { severity: "error" });
        } finally {
            setLoading(false);
        }
    }, [locationState, gql, notifications]);

    const changeLocation = useCallback(
        (newLocation: Graphql.UploadLocation) => {
            setLocationState(newLocation);
            setSelectedFiles([]);
            setError(undefined);
        },
        [],
    );

    // Load files when location changes
    useEffect(() => {
        if (locationState) {
            refreshFiles();
        }
    }, [locationState, refreshFiles]);

    const value: FileSelectorContextType =
        React.useMemo<FileSelectorContextType>(
            () => ({
                location: locationState,
                changeLocation,
                files,
                loading,
                error,
                selectedFiles,
                setSelectedFiles: setSelectedFilesCallback,
                toggleFileSelection,
                clearSelection,
                prohibitedUrls: prohibitedUrlsRef.current,
                isFileProhibited,
                refreshFiles,
                // uploadToLocation,
                // cancelUpload,
                // retryUpload,
                // clearUploads,
            }),
            [
                locationState,
                changeLocation,
                files,
                loading,
                error,
                selectedFiles,
                setSelectedFilesCallback,
                toggleFileSelection,
                clearSelection,
                isFileProhibited,
                refreshFiles,
                // uploadToLocation,
                // cancelUpload,
                // retryUpload,
                // clearUploads,
            ],
        );

    return (
        <FileSelectorContext.Provider value={value}>
            {children}
        </FileSelectorContext.Provider>
    );
};
