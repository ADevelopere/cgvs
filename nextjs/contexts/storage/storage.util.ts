import * as Graphql from "@/graphql/generated/types";
import { extToContentType, mimeToContentType } from "./storage.constant";

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
    return "TEXT";
};

export const getFileKey = (file: File): string =>
    `${file.name}-${file.size}-${file.lastModified}`;

// Convert ContentType array to MIME types for file input except attribute
export const contentTypesToMimeTypes = (
    contentTypes: Graphql.ContentType[],
): string[] => {
    const mimeTypes: string[] = [];

    contentTypes.forEach((contentType) => {
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
    contentTypes: Graphql.ContentType[],
): string[] => {
    const extensions: string[] = [];

    contentTypes.forEach((contentType) => {
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
    contentTypes: Graphql.ContentType[],
): string => {
    const acceptValues: string[] = [];

    contentTypes.forEach(contentType => {
        switch (contentType) {
            case 'JPEG':
                acceptValues.push('image/jpeg', '.jpg', '.jpeg', '.jpe');
                break;
            case 'PNG':
                acceptValues.push('image/png', '.png');
                break;
            case 'WEBP':
                acceptValues.push('image/webp', '.webp');
                break;
            case 'GIF':
                acceptValues.push('image/gif', '.gif');
                break;
            case 'SVG':
                acceptValues.push('image/svg+xml', '.svg');
                break;
            case 'PDF':
                acceptValues.push('application/pdf', '.pdf');
                break;
            case 'JSON':
                acceptValues.push('application/json', '.json');
                break;
            case 'TEXT':
                acceptValues.push('text/plain', '.txt', '.text');
                break;
            case 'OTF':
                acceptValues.push('font/otf', '.otf');
                break;
            case 'TTF':
                acceptValues.push('font/ttf', '.ttf');
                break;
            case 'WOFF':
                acceptValues.push('font/woff', '.woff');
                break;
            case 'WOFF2':
                acceptValues.push('font/woff2', '.woff2');
                break;
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
    return uniqueValues.join(',');
};
