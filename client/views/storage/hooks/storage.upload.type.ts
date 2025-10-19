"use client";

import { useStorageUploadStore } from "../stores/useStorageUploadStore";

export type UploadFileStatus = "pending" | "uploading" | "success" | "error";

export interface UploadFileState {
  file: File;
  status: UploadFileStatus;
  progress: number;
  error?: string;
  signedUrl?: string;
  xhr?: XMLHttpRequest;
}

export interface UploadBatchState {
  files: Map<string, UploadFileState>;
  totalSize: number;
  bytesUploaded: number;
  totalProgress: number;
  startTime: number;
  destination: string;
}

export const useStorageUpload = () => {
  return useStorageUploadStore();
};
