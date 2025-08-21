
import * as Graphql from "@/graphql/generated/types";

// Types for local state
export type StorageItem = Graphql.FileInfo | Graphql.FolderInfo;

export type StorageQueryParams = {
  path: string;
  limit: number;
  offset: number;
  searchTerm?: string;
  fileType?: Graphql.FileType;
  sortField?: Graphql.FileSortField;
};

// Upload-related types
export type UploadFileState = {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  signedUrl?: string;
  // Optional XHR instance used for this upload so the UI/context can abort if needed
  xhr?: XMLHttpRequest;
};

export type UploadBatchState = {
  files: Map<string, UploadFileState>; // key is file name + size for uniqueness
  location: Graphql.UploadLocation;
  isUploading: boolean;
  completedCount: number;
  totalCount: number;
};

export type StorageManagementContextType = {
  // Data
  items: StorageItem[];
  stats?: Graphql.StorageStats;
  pagination: { totalCount: number; limit: number; offset: number; hasMore: boolean } | null;

  // Selection
  selectedPaths: string[];

  // Query params
  params: StorageQueryParams;

  // Loading/error
  loading: boolean;
  error?: string;

  // Upload state
  uploadBatch?: UploadBatchState;

  // Actions
  setParams: (partial: Partial<StorageQueryParams>) => void;
  navigateTo: (path: string) => void;
  goUp: () => void;
  refresh: () => Promise<void>;

  toggleSelect: (path: string) => void;
  selectAll: () => void;
  clearSelection: () => void;

  rename: (path: string, newName: string) => Promise<boolean>;
  remove: (paths: string[]) => Promise<boolean>;

  search: (term: string) => void;
  setFilterType: (type?: Graphql.FileType) => void;
  setSortField: (field?: Graphql.FileSortField) => void;
  setPage: (page: number) => void; // converts to offset
  setLimit: (limit: number) => void;

  // Upload actions
  startUpload: (files: File[], location: Graphql.UploadLocation) => Promise<void>;
  // If fileKey is provided, cancel only that file's upload; otherwise cancel the whole batch
  cancelUpload: (fileKey?: string) => void;
  retryFailedUploads: () => Promise<void>;
  clearUploadBatch: () => void;
};