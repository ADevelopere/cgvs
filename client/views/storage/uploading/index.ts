// Main components
export { default as UploadProgress } from "./UploadProgress";
export { useUploadProgressUIOperations } from "../hooks/useUploadProgressUIOperations";

// Child components (optional exports for advanced use cases)
export { default as UploadProgressHeader } from "./UploadProgressHeader";
export { default as UploadProgressSummary } from "./UploadProgressSummary";
export { default as UploadProgressFileList } from "./UploadProgressFileList";
export { default as UploadProgressFileItem } from "./UploadProgressFileItem";
export { default as CancelUploadDialog } from "./CancelUploadDialog";

// Types
export type {
  UploadFileDisplayInfo,
  CancelTarget,
} from "../core/storage-upload.types";

export type { UploadProgressHeaderProps } from "./UploadProgressHeader";
export type { UploadProgressSummaryProps } from "./UploadProgressSummary";
export type { UploadProgressFileListProps } from "./UploadProgressFileList";
export type { UploadProgressFileItemProps } from "./UploadProgressFileItem";
export type { CancelUploadDialogProps } from "./CancelUploadDialog";
