import { UploadLocationPath } from "@/client/graphql/generated/gql/graphql";

export interface UploadFileState {
  status:
    | "pending"
    | "uploading"
    | "completed"
    | "success"
    | "error"
    | "cancelled";
  progress: number;
  error?: string;
  file: File;
  signedUrl?: string;
  xhr?: XMLHttpRequest;
}

export interface UploadBatchState {
  files: Map<string, UploadFileState>;
  location: UploadLocationPath;
  isUploading: boolean;
  completedCount: number;
  totalCount: number;
  targetPath: string;
  totalProgress: number;
  timeRemaining: number | null;
  totalSize: number;
  bytesUploaded: number;
}

export interface UploadFileDisplayInfo {
  fileKey: string;
  fileName: string;
  fileType: string;
  progress: number;
  status:
    | "pending"
    | "uploading"
    | "completed"
    | "success"
    | "error"
    | "cancelled";
  error?: string;
}

export interface CancelTarget {
  type: "all" | "file";
  fileKey?: string;
  fileName?: string;
}
