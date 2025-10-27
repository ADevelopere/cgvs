import * as Graphql from "@/client/graphql/generated/gql/graphql";
import CryptoJS from "crypto-js";
import {
  extToContentType,
  mimeToContentType,
  contentTypeToMime,
  contentTypeToExtensions,
} from "./storage.constant";

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

/**
 * Infer ContentType enum from file
 * Returns a ContentType enum value (e.g., "IMAGE_JPEG", "FONT_OTF")
 */
export const inferContentType = (file: File): Graphql.ContentType => {
  // Try to use browser-detected MIME type if it's in our mapping
  if (file.type && mimeToContentType[file.type]) {
    return mimeToContentType[file.type];
  }

  // Fallback: infer from extension
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext && extToContentType[ext]) {
    return extToContentType[ext];
  }

  // Default fallback
  return "TEXT_PLAIN";
};

export const getFileKey = (file: File): string =>
  `${file.name}-${file.size}-${file.lastModified}`;

/**
 * Convert array of ContentType enum values to file extensions
 */
export const contentTypesToExtensions = (
  contentTypes: Graphql.ContentType[]
): string[] => {
  const extensions: string[] = [];

  contentTypes.forEach(contentType => {
    const exts = contentTypeToExtensions[contentType];
    if (exts) {
      extensions.push(...exts);
    }
  });

  return extensions;
};

/**
 * Convert ContentType enum value to MIME type string
 */
export const contentTypeEnumToMime = (
  contentType: Graphql.ContentType
): string => {
  return contentTypeToMime[contentType];
};

/**
 * Get accept attribute string for file input based on allowed ContentType enums
 */
export const getAcceptAttribute = (
  contentTypes: Graphql.ContentType[]
): string => {
  const acceptValues: string[] = [];

  contentTypes.forEach(contentType => {
    // Add the MIME type
    const mimeType = contentTypeToMime[contentType];
    if (mimeType) {
      acceptValues.push(mimeType);
    }

    // Add associated file extensions
    const extensions = contentTypeToExtensions[contentType];
    if (extensions) {
      acceptValues.push(...extensions);
    }
  });

  // Remove duplicates and return
  const uniqueValues = [...new Set(acceptValues)];
  return uniqueValues.join(",");
};
