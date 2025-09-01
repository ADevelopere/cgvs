type StorageUploadingTranslations = {
    cancelAllUploads: string;
    cancelAllUploadsMessage: string;
    cancelFileUpload: string;
    cancelFileUploadMessage: string; // %{fileName}
    keepUploading: string;
    cancelUpload: string;
    cancelUploadOf: string; // %{fileName}
    noUploads: string;
    uploading1Item: string;
    uploadingNItems: string; // %{count}
    expandUploadDetails: string;
    collapseUploadDetails: string;
    closeUploadProgress: string;
    secondsLeft: string; // %{seconds}
    minutesLeft: string; // %{minutes}
    hoursLeft: string; // %{hours}
    minutesLeftShort: string; // %{minutes}
    cancel: string;
};

 type StorageTranslations = {
    [key: string]: string | undefined | StorageUploadingTranslations;

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
    itemsSelected: string;
    download: string;
    copyLinks: string;
    delete: string;
    confirmBulkDelete: string;
    confirmBulkDeleteMessage: string;
    cancel: string;
    deleteItems: string;
    deleteFolder: string;
    deleteFile: string;
    deleteItem: string;
    aboutToDelete: string;
    aboutToDeleteItem: string;
    cannotBeUndone: string;
    itemsToBeDeleted: string;
    deleteFolderWarning: string;
    deleting: string;
    uploadStartedSuccessfully: string;
    failedToStartUpload: string;
    noFilesYet: string;
    thisFolderIsEmpty: string;
    chooseStorageLocation: string;
    emptyFolderGetStarted: string;
    emptyFolder: string;
    uploadFiles: string;
    goUp: string;
    dragAndDropHelpText: string;
    networkError: string;
    authenticationError: string;
    accessDenied: string;
    contentNotFound: string;
    requestTimeout: string;
    serverError: string;
    retry: string;
    failedToLoadStorageContent: string;
    zeroBytes: string;
    bytes: string;
    kb: string;
    mb: string;
    gb: string;
    tb: string;
    unknown: string;
    moreActions: string;
    modified: string;
    size: string;
    copyLink: string;
    rename: string;
    emptyFolderUpload: string;
    foldersCount: string;
    filesCount: string;
    remainingMore: string;
    storageLocations: string;
    allowedFileTypes: string;
    showingItems: string;
    perPage: string;
    // SearchBar
    nameCannotBeEmpty: string;
    nameMustBeDifferent: string;
    nameCannotContainForwardSlashes: string;
    nameCannotContainBackslashes: string;
    nameTooLong: string;
    nameContainsIllegalCharacters: string;
    failedToRenameItem: string;
    unexpectedError: string;
    // SelectHeader
    renameItem: string;
    newName: string;
    enterNewName: string;
    renaming: string;
    search: string;
    clearSearch: string;
    selectAllItems: string;
    selectedOfTotal: string;
    // StorageBreadcrumbs
    goUpOneLevel: string;
    breadcrumbNavigation: string;
    chooseStorageLocationBreadcrumb: string;
    // StorageStatsBar
    totalStorage: string;
    acrossFilesAndFolders: string;
    currentDirectory: string;
    folder: string;
    folders: string;
    file: string;
    files: string;
    fileTypes: string;
    more: string;
    // StorageToolbar
    allFiles: string;
    images: string;
    documents: string;
    videos: string;
    audio: string;
    archives: string;
    other: string;
    default: string;
    name: string;
    modifiedDate: string;
    fileType: string;
    searchFilesAndFolders: string;
    filter: string;
    sort: string;
    uploadToLocation: string;
    navigateToLocationToUpload: string;
    selected: string;
    activeFilters: string;
    typeFilter: string;
    searchFilter: string;
    pending: string;
    success: string;
    failed: string;
    cancelUpload: string;
    retryUpload: string;
    allFilesUploaded: string;
    uploadStatus: string;
    uploadingFiles: string;
    fileUpload: string;
    cancelAll: string;
    uploadLocation: string;

    // File Selector translations
    selectLocation: string;
    selectLocationFirst: string;
    invalidFileTypes: string;
    allowedTypes: string;
    dropFilesHere: string;
    dragFilesHere: string;
    orClickToSelect: string;
    selectFiles: string;
    completed: string;
    uploadingString: string;
    clearList: string;
    preview: string;
    selectOrUploadFiles: string;
    selectOrUploadFile: string;
    selectFile: string;
    select: string;
    close: string;
    filesSelected: string;
    fileSelected: string;
    noFileSelected: string;
    max: string;
    selectionLimitReached: string;
    selectAll: string;
    clearSelection: string;
    refresh: string;
    view: string;
    grid: string;
    list: string;
    selectLocationToViewFiles: string;
    noFilesInLocation: string;
    uploading: StorageUploadingTranslations;
};

export default StorageTranslations;