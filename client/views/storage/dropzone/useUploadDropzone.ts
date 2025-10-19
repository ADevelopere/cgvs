"use client";

import { useCallback } from "react";
import {
  useDropzone as useReactDropzone,
  DropzoneRootProps,
  DropzoneInputProps,
} from "react-dropzone";
import { useStorageUploadOperations } from "@/client/views/storage/hooks/useStorageUploadOperations";
import { useAppTranslation } from "@/client/locale";
import logger from "@/lib/logger";

export interface UseUploadDropzoneOptions {
  /**
   * The target path where files should be uploaded
   */
  uploadPath: string;

  /**
   * Whether the dropzone is currently disabled
   */
  disabled?: boolean;

  /**
   * Maximum number of files that can be uploaded at once
   */
  maxFiles?: number;

  /**
   * Maximum file size in bytes
   */
  maxFileSize?: number;

  /**
   * Accepted file types (MIME types or file extensions)
   */
  acceptedFileTypes?: string[];

  /**
   * Callback fired when files are dropped or selected
   */
  onFilesSelected?: (files: File[]) => void;

  /**
   * Callback fired when upload starts
   */
  onUploadStart?: () => void;

  /**
   * Callback fired when upload completes
   */
  onUploadComplete?: () => void;

  /**
   * Callback fired when validation fails
   */
  onValidationError?: (errors: string[]) => void;
}

export interface UseUploadDropzoneReturn {
  /**
   * Whether files are currently being dragged over
   */
  isDragActive: boolean;

  /**
   * Whether the drag operation will be rejected
   */
  isDragReject: boolean;

  /**
   * Whether files are currently being uploaded
   */
  isUploading: boolean;

  /**
   * Root props to spread on the dropzone element
   */
  getRootProps: () => DropzoneRootProps;

  /**
   * Input props to spread on the hidden input element
   */
  getInputProps: () => DropzoneInputProps;

  /**
   * Function to manually process files
   */
  processFiles: (files: File[]) => void;
}

/**
 * useDropzone - A hook for adding drag-and-drop file upload functionality using react-dropzone
 *
 * This hook provides a simplified interface to react-dropzone that integrates with
 * the StorageUploadContext and provides file validation.
 *
 * @param options Configuration options for the dropzone
 * @returns Object with react-dropzone props and helper functions
 */
export const useUploadDropzone = (
  options: UseUploadDropzoneOptions
): UseUploadDropzoneReturn => {
  const {
    uploadPath,
    disabled = false,
    maxFiles = 100,
    maxFileSize = 100 * 1024 * 1024, // 100MB default
    acceptedFileTypes,
    onFilesSelected,
    onUploadStart,
    onUploadComplete,
    onValidationError,
  } = options;

  const { dropzone: translations } = useAppTranslation("storageTranslations");
  const { startUpload, uploadBatch } = useStorageUploadOperations();

  // Handle file upload
  const handleFilesUpload = useCallback(
    (files: File[]) => {
      if (disabled || files.length === 0) return;

      // Start upload in the background
      (async () => {
        try {
          onUploadStart?.();
          onFilesSelected?.(files);

          logger.info(
            `Starting upload of ${files.length} files to ${uploadPath}`
          );

          await startUpload(files, uploadPath, {
            onComplete: () => {
              onUploadComplete?.();
              logger.info("Upload completed successfully");
            },
          });
        } catch (error) {
          logger.error("Upload failed:", error);
        }
      })();
    },
    [
      disabled,
      onUploadStart,
      onFilesSelected,
      uploadPath,
      startUpload,
      onUploadComplete,
    ]
  );

  // Configure react-dropzone
  const dropzoneResult = useReactDropzone({
    onDrop: handleFilesUpload,
    disabled,
    maxFiles,
    maxSize: maxFileSize,
    accept: acceptedFileTypes
      ? {
          // Convert array of file types to react-dropzone format
          ...acceptedFileTypes.reduce(
            (acc, type) => {
              if (type.startsWith(".")) {
                // File extension
                acc["application/octet-stream"] =
                  acc["application/octet-stream"] || [];
                acc["application/octet-stream"].push(type);
              } else {
                // MIME type
                acc[type] = [];
              }
              return acc;
            },
            {} as Record<string, string[]>
          ),
        }
      : undefined,
    onDropRejected: fileRejections => {
      const errors: string[] = [];
      fileRejections.forEach(({ file, errors: rejectionErrors }) => {
        rejectionErrors.forEach(error => {
          let message = "";
          switch (error.code) {
            case "file-too-large":
              message = translations.fileTooLarge
                .replace("%{fileName}", file.name)
                .replace("%{maxSize}", formatFileSize(maxFileSize));
              break;
            case "file-invalid-type":
              message = translations.invalidFileType.replace(
                "%{fileName}",
                file.name
              );
              break;
            case "too-many-files":
              message = translations.tooManyFiles
                .replace("%{count}", fileRejections.length.toString())
                .replace("%{maxFiles}", maxFiles.toString());
              break;
            default:
              message = `${file.name}: ${error.message}`;
          }
          errors.push(message);
          logger.warn("File validation error:", message);
        });
      });
      onValidationError?.(errors);
    },
  });

  return {
    isDragActive: dropzoneResult.isDragActive,
    isDragReject: dropzoneResult.isDragReject,
    isUploading: uploadBatch?.isUploading || false,
    getRootProps: dropzoneResult.getRootProps,
    getInputProps: dropzoneResult.getInputProps,
    processFiles: handleFilesUpload,
  };
};

// Utility function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default useUploadDropzone;
