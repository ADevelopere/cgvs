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
