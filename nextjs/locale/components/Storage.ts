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

type StorageManagementCoreTranslations = {
    // Data fetching error messages
    failedToFetchFileList: string;
    failedToFetchDirectoryContents: string;
    failedToFetchStorageStatistics: string;
    
    // File operation success messages
    successfullyRenamedTo: string; // %{newName}
    successfullyCreatedFolder: string; // %{name}
    successfullyDeleted: string; // %{count}
    successfullyMoved: string; // %{count}
    successfullyMovedPartial: string; // %{successCount}, %{failureCount}, %{errors}
    successfullyCopied: string; // %{count}
    successfullyCopiedPartial: string; // %{successCount}, %{failureCount}, %{errors}
    
    // File operation error messages
    failedToRenameFile: string;
    failedToCreateFolder: string;
    failedToDeleteItems: string;
    deletedPartial: string; // %{successCount}, %{failureCount}, %{errors}
    failedToMoveItems: string;
    movedPartial: string; // %{successCount}, %{failureCount}, %{errors}
    failedToCopyItems: string;
    copiedPartial: string; // %{successCount}, %{failureCount}, %{errors}
    failedToSearchFiles: string;
    
    // Generic terms
    items: string;
    item: string;
    errors: string;
};

type StorageManagementUITranslations = {
    // Navigation error messages
    failedToNavigateToDirectory: string;
    failedToRefreshDirectory: string;
    searchFailed: string;
    
    // Loading states
    loadingFolderContents: string;
    folderExpanded: string; // %{count}
    
    // View mode and sorting
    gridView: string;
    listView: string;
    sortByName: string;
    sortBySize: string;
    sortByLastModified: string;
    sortByCreated: string;
    sortByType: string;
    ascending: string;
    descending: string;
    
    // Selection and clipboard
    selectAll: string;
    clearSelection: string;
    selectedItems: string; // %{count}
    copyItems: string;
    cutItems: string;
    pasteItems: string;
    noItemsInClipboard: string;
    itemsCopied: string; // %{count}
    itemsCut: string; // %{count}
    
    // Search
    searchPlaceholder: string;
    searchResults: string; // %{count}
    noSearchResults: string;
    exitSearchMode: string;
    searchInFolder: string; // %{folderName}
    
    // Tree navigation
    expandFolder: string;
    collapseFolder: string;
    noFoldersFound: string;
    
    // Filter and view controls
    filterByType: string;
    filterByDate: string;
    clearFilters: string;
    showFilters: string;
    hideFilters: string;
    
    // Accessibility
    focusedItem: string; // %{itemName}
    navigationInstructions: string;
    keyboardShortcuts: string;
    
    // Context menu actions
    open: string;
    rename: string;
    delete: string;
    copy: string;
    cut: string;
    paste: string;
    download: string;
    getInfo: string;
    newFolder: string;
    uploadFiles: string;
    refresh: string;
    
    // File types for filtering
    allTypes: string;
    folders: string;
    documents: string;
    spreadsheets: string;
    presentations: string;
    videos: string;
    forms: string;
    photos: string;
    pdfs: string;
    archives: string;
    audio: string;
    drawings: string;
    sites: string;
    shortcuts: string;
    
    // Pagination
    itemsPerPage: string;
    page: string; // %{current} of %{total}
    showingItems: string; // %{start}-{end} of %{total}
    
    // Generic UI terms
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    close: string;
    save: string;
    apply: string;
    reset: string;
};

type StorageTranslations = {
    [key: string]: string | undefined | StorageUploadingTranslations | StorageManagementCoreTranslations | StorageManagementUITranslations;

    uploading: StorageUploadingTranslations;
    management: StorageManagementCoreTranslations;
    ui: StorageManagementUITranslations;
};

export default StorageTranslations;
