 type StorageTranslations = {
    [key: string]: string | undefined;

    failedListFiles: string;
    failedFetchStorageStats: string;
    uploadNotAllowed: string;
    uploadCancelled: string;
    uploadFailed: string;
    failedRename: string;
    failedDelete: string;
    noFailedUploads: string;
    fileAlreadyExists: string;
    failedGenerateSignedUrl: string;
    uploadStarted: string;
    uploadCompleted: string;
    uploadProgress: string;

    // Additional messages used in the context
    renameSuccess: string;
    deleteSuccess: string;
    uploadBlockedByCors: string;
    retryCompleted: string;
    retryFailed: string;
    uploadSuccessCount: string; // expects "%{count}" placeholder
    uploadFailedCount: string; // expects "%{count}" placeholder
    uploadFailedWithStatus: string;
    networkErrorDuringUpload: string;
    uploadFailedForFile: string;
    noResponseText: string;
    internalUploadError: string;

};

export default StorageTranslations;
