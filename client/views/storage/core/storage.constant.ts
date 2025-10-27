import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const STORAGE_DEFAULT_PARAMS: Graphql.FilesListInput = {
  path: "", // Start at the root of the public directory (showing predefined locations)
  limit: 50,
  offset: 0,
};

export const mimeToContentType: Record<string, Graphql.ContentType> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/gif": "GIF",
  "image/webp": "WEBP",
  "application/pdf": "PDF",
  "text/plain": "TXT",
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
  pdf: "PDF",
  txt: "TXT",
  text: "TXT", // Additional text extension
  otf: "OTF",
  ttf: "TTF",
  woff: "WOFF",
  woff2: "WOFF2",
};
