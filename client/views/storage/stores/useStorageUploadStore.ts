"use client";

import { create } from "zustand";
import { UploadBatchState, UploadFileState } from "../hooks/storage-upload.types";

interface StorageUploadState {
  uploadBatch: UploadBatchState | undefined;
}

interface StorageUploadActions {
  setUploadBatch: (batch: UploadBatchState | undefined) => void;
  updateFileState: (fileKey: string, updates: Partial<UploadFileState>) => void;
  updateBatchProgress: (fileKey: string, progress: number, bytesUploaded: number) => void;
  clearUploadBatch: () => void;
  reset: () => void;
}

const initialState: StorageUploadState = {
  uploadBatch: undefined,
};

export const useStorageUploadStore = create<StorageUploadState & StorageUploadActions>((set, get) => ({
  ...initialState,

  setUploadBatch: (batch) => set({ uploadBatch: batch }),

  updateFileState: (fileKey, updates) => set((state) => {
    if (!state.uploadBatch) return state;

    const updatedFiles = new Map(state.uploadBatch.files);
    const existing = updatedFiles.get(fileKey);
    if (!existing) return state;

    updatedFiles.set(fileKey, { ...existing, ...updates });

    return {
      uploadBatch: {
        ...state.uploadBatch,
        files: updatedFiles,
      },
    };
  }),

  updateBatchProgress: (fileKey, progress, bytesUploaded) => set((state) => {
    if (!state.uploadBatch) return state;

    const updatedFiles = new Map(state.uploadBatch.files);
    const existing = updatedFiles.get(fileKey);
    if (!existing) return state;

    const oldBytesLoaded = (existing.progress / 100) * existing.file.size;
    const newBytesLoaded = (progress / 100) * existing.file.size;
    const deltaBytes = newBytesLoaded - oldBytesLoaded;

    updatedFiles.set(fileKey, {
      ...existing,
      progress,
    });

    const totalProgress = state.uploadBatch.totalSize > 0
      ? Math.round((bytesUploaded / state.uploadBatch.totalSize) * 100)
      : 0;

    return {
      uploadBatch: {
        ...state.uploadBatch,
        files: updatedFiles,
        bytesUploaded,
        totalProgress,
      },
    };
  }),

  clearUploadBatch: () => set({ uploadBatch: undefined }),

  reset: () => set(initialState),
}));
