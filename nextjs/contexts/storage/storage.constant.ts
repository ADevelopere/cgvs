import { StorageQueryParams } from "./storage.type";
import * as Graphql from "@/graphql/generated/types";

export const STORAGE_DEFAULT_PARAMS: StorageQueryParams = {
    path: "", // Start at the root of the public directory (showing predefined locations)
    limit: 50,
    offset: 0,
};

export const mimeToContentType: Record<string, Graphql.ContentType> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/gif": "GIF",
    "image/webp": "WEBP",
    "image/svg+xml": "SVG",
    "application/pdf": "PDF",
    "application/json": "JSON",
    "text/plain": "TEXT",
    "font/otf": "OTF",
    "font/ttf": "TTF",
    "font/woff": "WOFF",
    "font/woff2": "WOFF2",
};

export const extToContentType: Record<string, Graphql.ContentType> = {
    jpg: "JPEG",
    jpeg: "JPEG",
    jpe: "JPEG", // Additional JPEG extension
    png: "PNG",
    gif: "GIF",
    webp: "WEBP",
    svg: "SVG",
    pdf: "PDF",
    json: "JSON",
    txt: "TEXT",
    text: "TEXT", // Additional text extension
    otf: "OTF",
    ttf: "TTF",
    woff: "WOFF",
    woff2: "WOFF2",
};
