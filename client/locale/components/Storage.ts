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
  fileAlreadyExists: string;
  failedGenerateSignedUrl: string;
  uploadCancelled: string;
  uploadFailedWithStatus: string; // %{status}
  uploadFailed: string;
  uploadCompleted: string;
  uploadNotAllowed: string;
  uploadSuccessCount: string; // %{count}
  uploadFailedCount: string; // %{count}
  noFailedUploads: string;
  retryCompletedUploads: string;
  retryFailedUploads: string;
  retryUploads: string;
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

export type StorageManagementUITranslations = {
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
  sortBy: string;
  sortByName: string;
  sortBySize: string;
  sortByLastModified: string;
  sortByCreated: string;
  sortByType: string;
  ascending: string;
  descending: string;
  name: string;
  size: string;
  lastModified: string;
  createdAt: string;

  // Empty states and messages
  emptyFolder: string;
  tryDifferentSearch: string;
  uploadOrCreate: string;
  searching: string;

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
  item: string;
  items: string;

  // Tree navigation
  expandFolder: string;
  collapseFolder: string;
  noFoldersFound: string;
  searchFolders: string;

  // Filter and view controls
  filters: string;
  activeFilters: string;
  allDates: string;
  today: string;
  last7Days: string;
  last30Days: string;
  thisYear: string;
  lastYear: string;
  customDateRange: string;
  searchTerm: string;
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
  moveTo: string;

  // Dialog messages
  deleteConfirmation: string; // %{fileName}
  deleteConfirmationMessage: string; // %{fileName}
  //rename dialog
  renameDialogTitle: string;
  renameDialogLabel: string;
  renameDialogOk: string;
  renameDialogCancel: string;
  renameDialogEmpty: string;
  renameDialogInvalid: string;
  renameDialogFailedToRename: string;
  renameDialogUnexpectedError: string;
  //rename dialog end

  // Delete dialog
  deleteDialogFailedToDelete: string;
  deleteDialogUnexpectedError: string;
  // Delete dialog end

  // Create folder dialog
  createFolderDialogTitle: string;
  createFolderDialogLabel: string;
  createFolderDialogOk: string;
  createFolderDialogCancel: string;
  createFolderDialogEmpty: string;
  createFolderDialogInvalid: string;
  createFolderDialogFailedToCreate: string;
  createFolderDialogUnexpectedError: string;
  // Create folder dialog end

  // Move to dialog
  moveDialogTitle: string;
  moveDialogSelectDestination: string;
  moveDialogRoot: string;
  moveDialogGoUp: string;
  moveDialogRefresh: string;
  moveDialogNoFolders: string;
  moveDialogInvalid: string;
  moveDialogCannotMoveHere: string;
  moveDialogCancel: string;
  moveDialogMove: string;
  moveDialogFailedToLoad: string;
  moveDialogFailedToMove: string;
  moveDialogInvalidDestination: string;
  moveDialogUnexpectedError: string;
  moving: string;
  // Move to dialog end

  // File picker dialog
  filePickerDialogTitle: string;
  filePickerDialogSelectFile: string;
  filePickerDialogNoFiles: string;
  filePickerDialogSelect: string;
  filePickerDialogCancel: string;
  filePickerDialogFailedToLoad: string;
  filePickerDialogUnexpectedError: string;
  selecting: string;
  folder: string;
  files: string;
  // File picker dialog end

  contentType: string;
  path: string;
  md5Hash: string;
  protected: string;
  yes: string;
  parentPath: string;
  protectChildren: string;
  permissions: string;
  allowUploads: string;
  allowCreateFolders: string;
  allowDeleteFiles: string;
  allowMoveFiles: string;
  no: string;

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
  otherTypes: string;

  // Pagination
  itemsPerPage: string;
  page: string; // %{current} of %{total}
  showingItems: string; // %{start}-{end} of %{total}

  // Navigation and breadcrumb
  myDrive: string;
  breadcrumbNavigation: string;

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

type StorageDropzoneTranslations = {
  // Drag and drop messages
  dragFilesHere: string;
  dragToUpload: string;
  dragOverToUpload: string;
  dragAndDropFiles: string;
  orClickToSelect: string;
  clickToSelectFiles: string;
  uploading: string;

  // File validation messages
  invalidFileType: string; // %{fileName}
  fileTooLarge: string; // %{fileName}, %{maxSize}
  tooManyFiles: string; // %{count}, %{maxFiles}

  // Upload feedback
  filesSelected: string; // %{count}
  startingUpload: string;
  uploadSuccess: string; // %{count}
  uploadFailed: string; // %{error}

  // Dropzone states
  dropzoneActive: string;
  dropzoneInactive: string;
  dropHereToUpload: string;
  releaseToUpload: string;
};

export type StorageTranslations = {
  [key: string]:
    | string
    | undefined
    | StorageUploadingTranslations
    | StorageManagementCoreTranslations
    | StorageManagementUITranslations
    | StorageDropzoneTranslations;

  uploading: StorageUploadingTranslations;
  management: StorageManagementCoreTranslations;
  ui: StorageManagementUITranslations;
  dropzone: StorageDropzoneTranslations;
};
