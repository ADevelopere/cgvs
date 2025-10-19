import * as Graphql from "@/client/graphql/generated/gql/graphql";
import CryptoJS from "crypto-js";

import { extToContentType, mimeToContentType } from "./storage.constant";

/**
 * Generate MD5 hash from file content
 */
export const generateFileMD5 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const hash = CryptoJS.MD5(wordArray).toString();
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

export const inferContentType = (file: File): Graphql.ContentType => {
  // Try to map from MIME type
  if (file.type && mimeToContentType[file.type]) {
    return mimeToContentType[file.type];
  }

  // Fallback: infer from extension
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext && extToContentType[ext]) {
    return extToContentType[ext];
  }

  // Default fallback
  return "TXT";
};

export const getFileKey = (file: File): string =>
  `${file.name}-${file.size}-${file.lastModified}`;

// Convert ContentType array to MIME types for file input except attribute
export const contentTypesToMimeTypes = (
  contentTypes: Graphql.ContentType[]
): string[] => {
  const mimeTypes: string[] = [];

  contentTypes.forEach(contentType => {
    // Find all MIME types that map to this content type
    Object.entries(mimeToContentType).forEach(([mimeType, ct]) => {
      if (ct === contentType) {
        mimeTypes.push(mimeType);
      }
    });
  });

  return mimeTypes;
};

// Convert ContentType array to file extensions for file input except attribute
export const contentTypesToExtensions = (
  contentTypes: Graphql.ContentType[]
): string[] => {
  const extensions: string[] = [];

  contentTypes.forEach(contentType => {
    // Find all extensions that map to this content type
    Object.entries(extToContentType).forEach(([ext, ct]) => {
      if (ct === contentType) {
        extensions.push(`.${ext}`);
      }
    });
  });

  return extensions;
};

// Get accept attribute string for file input based on allowed content types
export const getAcceptAttribute = (
  contentTypes: Graphql.ContentType[]
): string => {
  const acceptValues: string[] = [];

  contentTypes.forEach(contentType => {
    switch (contentType) {
      case "JPEG":
        acceptValues.push("image/jpeg", ".jpg", ".jpeg", ".jpe");
        break;
      case "PNG":
        acceptValues.push("image/png", ".png");
        break;
      case "WEBP":
        acceptValues.push("image/webp", ".webp");
        break;
      case "GIF":
        acceptValues.push("image/gif", ".gif");
        break;
      case "PDF":
        acceptValues.push("application/pdf", ".pdf");
        break;
      case "TXT":
        acceptValues.push("text/plain", ".txt", ".text");
        break;
      // will be added:
      // case "OTF":
      //     acceptValues.push("font/otf", ".otf");
      //     break;
      // case "TTF":
      //     acceptValues.push("font/ttf", ".ttf");
      //     break;
      // case "WOFF":
      //     acceptValues.push("font/woff", ".woff");
      //     break;
      // case "WOFF2":
      //     acceptValues.push("font/woff2", ".woff2");
      //     break;
      default: {
        // Fallback to generic mapping
        const mimeTypes = contentTypesToMimeTypes([contentType]);
        const extensions = contentTypesToExtensions([contentType]);
        acceptValues.push(...mimeTypes, ...extensions);
        break;
      }
    }
  });

  // Remove duplicates and return
  const uniqueValues = [...new Set(acceptValues)];
  return uniqueValues.join(",");
};
