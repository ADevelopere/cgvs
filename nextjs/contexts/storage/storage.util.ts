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
