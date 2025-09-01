import React, {
    createContext,
    useContext,
    useMemo,
    useState,
    useCallback,
} from "react";
import {
    StorageUploadContextType,
    UploadBatchState,
} from "@/contexts/storage/StorageUploadContext";
import {
    UploadProgressUIContextType,
    UploadFileDisplayInfo,
    CancelTarget,
} from "@/views/storage/uploading/UploadProgressUIContext";
import logger from "@/utils/logger";

const MockStorageUploadContext = createContext<
    StorageUploadContextType | undefined
>(undefined);

const useMockStorageUpload = (): StorageUploadContextType => {
    const context = useContext(MockStorageUploadContext);
    if (!context) {
        throw new Error(
            "useMockStorageUpload must be used within a MockStorageUploadProvider",
        );
    }
    return context;
};

const MockStorageUploadProvider: React.FC<{
    children: React.ReactNode;
    initialBatchState?: UploadBatchState;
}> = ({ children, initialBatchState }) => {
    const [uploadBatch, setUploadBatch] = useState<
        UploadBatchState | undefined
    >(initialBatchState);

    const contextValue = useMemo(
        (): StorageUploadContextType => ({
            uploadBatch,
            startUpload: async (files, targetPath) => {
                logger.log("Mock startUpload called with:", files, targetPath);
            },
            cancelUpload: (fileKey) => {
                logger.log("Mock cancelUpload called with:", fileKey);
            },
            retryFailedUploads: async () => {
                logger.log("Mock retryFailedUploads called");
            },
            retryFile: async (fileKey) => {
                logger.log("Mock retryFile called with:", fileKey);
            },
            clearUploadBatch: () => {
                logger.log("Mock clearUploadBatch called");
                setUploadBatch(undefined);
            },
        }),
        [uploadBatch],
    );

    return (
        <MockStorageUploadContext.Provider value={contextValue}>
            {children}
        </MockStorageUploadContext.Provider>
    );
};

// --- Mock UploadProgressUIContext ---

const MockUploadProgressUIContext = createContext<
    UploadProgressUIContextType | undefined
>(undefined);

const useMockUploadProgressUI = () => {
    const context = useContext(MockUploadProgressUIContext);
    if (!context) {
        throw new Error(
            "useMockUploadProgressUI must be used within a MockUploadProgressUIProvider",
        );
    }
    return context;
};

const getFileTypeFromName = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(extension))
        return "image";
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension))
        return "document";
    return "file";
};

const MockUploadProgressUIProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const storageUpload = useMockStorageUpload();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelTarget, setCancelTarget] = useState<CancelTarget | null>(null);

    const files: UploadFileDisplayInfo[] = useMemo(() => {
        if (!storageUpload.uploadBatch?.files) return [];
        return Array.from(storageUpload.uploadBatch.files.entries()).map(
            ([fileKey, fileState]) => ({
                fileKey,
                fileName: fileState.file.name,
                fileType: getFileTypeFromName(fileState.file.name),
                progress: fileState.progress,
                status: fileState.status,
                error: fileState.error,
            }),
        );
    }, [storageUpload.uploadBatch?.files]);

    const onToggleCollapse = useCallback(() => setIsCollapsed((p) => !p), []);
    const onClose = useCallback(
        () => storageUpload.clearUploadBatch(),
        [storageUpload],
    );
    const onCancelAll = useCallback(() => {
        setCancelTarget({ type: "all" });
        setShowCancelDialog(true);
    }, []);
    const onCancelFile = useCallback(
        (fileKey: string) => {
            const file = files.find((f) => f.fileKey === fileKey);
            if (file) {
                setCancelTarget({
                    type: "file",
                    fileKey,
                    fileName: file.fileName,
                });
                setShowCancelDialog(true);
            }
        },
        [files],
    );
    const onConfirmCancel = useCallback(() => {
        if (cancelTarget) {
            if (cancelTarget.type === "all") {
                storageUpload.cancelUpload();
            } else if (cancelTarget.fileKey) {
                storageUpload.cancelUpload(cancelTarget.fileKey);
            }
        }
        setShowCancelDialog(false);
        setCancelTarget(null);
    }, [cancelTarget, storageUpload]);
    const onDismissDialog = useCallback(() => {
        setShowCancelDialog(false);
        setCancelTarget(null);
    }, []);

    const value: UploadProgressUIContextType = useMemo(
        () => ({
            totalCount: storageUpload.uploadBatch?.totalCount || 0,
            completedCount: storageUpload.uploadBatch?.completedCount || 0,
            totalProgress: storageUpload.uploadBatch?.totalProgress || 0,
            timeRemaining: storageUpload.uploadBatch?.timeRemaining || null,
            isUploading: storageUpload.uploadBatch?.isUploading || false,
            files,
            isCollapsed,
            showCancelDialog,
            cancelTarget,
            onToggleCollapse,
            onClose,
            onCancelAll,
            onCancelFile,
            onConfirmCancel,
            onDismissDialog,
        }),
        [
            storageUpload.uploadBatch,
            files,
            isCollapsed,
            showCancelDialog,
            cancelTarget,
            onToggleCollapse,
            onClose,
            onCancelAll,
            onCancelFile,
            onConfirmCancel,
            onDismissDialog,
        ],
    );

    return (
        <MockUploadProgressUIContext.Provider value={value}>
            {children}
        </MockUploadProgressUIContext.Provider>
    );
};

export {
    MockUploadProgressUIProvider,
    useMockUploadProgressUI,
    MockStorageUploadProvider,
    useMockStorageUpload,
};
