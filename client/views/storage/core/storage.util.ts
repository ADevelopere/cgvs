import CryptoJS from "crypto-js";
import { mimeToExtensions } from "@/utils/storage.utils";

/**
 * Generate MD5 hash from file content in base64 format
 *
 * IMPORTANT: This function returns the MD5 hash in base64 format because:
 * 1. Google Cloud Storage signed URLs expect base64-encoded MD5 for the contentMd5 parameter
 * 2. The Content-MD5 header in HTTP requests must also be base64-encoded to match the signature
 * 3. Using hex format would cause "SignatureDoesNotMatch" errors when uploading files
 *
 * @param file - The file to generate MD5 hash for
 * @returns Promise<string> - Base64-encoded MD5 hash
 */
export const generateFileMD5 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        // Generate MD5 hash and convert to base64 format for GCP compatibility
        const hash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Base64);
        resolve(hash);
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error("Failed to generate MD5 hash")
        );
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

// Re-export inferContentType from shared utils for convenience
export { inferContentType } from "@/utils/storage.utils";

export const getFileKey = (file: File): string =>
  `${file.name}-${file.size}-${file.lastModified}`;

/**
 * Convert array of MIME types to file extensions
 */
export const contentTypesToExtensions = (mimeTypes: string[]): string[] => {
  const extensions: string[] = [];

  mimeTypes.forEach(mimeType => {
    const exts = mimeToExtensions[mimeType];
    if (exts) {
      extensions.push(...exts);
    }
  });

  return extensions;
};

/**
 * Get accept attribute string for file input based on allowed MIME types
 */
export const getAcceptAttribute = (mimeTypes: string[]): string => {
  const acceptValues: string[] = [];

  mimeTypes.forEach(mimeType => {
    // Add the MIME type
    acceptValues.push(mimeType);

    // Add associated file extensions
    const extensions = mimeToExtensions[mimeType];
    if (extensions) {
      acceptValues.push(...extensions);
    }
  });

  // Remove duplicates and return
  const uniqueValues = [...new Set(acceptValues)];
  return uniqueValues.join(",");
};
