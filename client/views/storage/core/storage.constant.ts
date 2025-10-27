import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const STORAGE_DEFAULT_PARAMS: Graphql.FilesListInput = {
  path: "", // Start at the root of the public directory (showing predefined locations)
  limit: 50,
  offset: 0,
};

// Map file extensions to ContentType enum values
export const extToContentType: Record<string, Graphql.ContentType> = {
  jpg: "IMAGE_JPEG",
  jpeg: "IMAGE_JPEG",
  jpe: "IMAGE_JPEG",
  png: "IMAGE_PNG",
  gif: "IMAGE_GIF",
  webp: "IMAGE_WEBP",
  pdf: "APPLICATION_PDF",
  doc: "APPLICATION_MSWORD",
  docx: "APPLICATION_DOCX",
  xls: "APPLICATION_XLS",
  xlsx: "APPLICATION_XLSX",
  txt: "TEXT_PLAIN",
  text: "TEXT_PLAIN",
  zip: "APPLICATION_ZIP",
  rar: "APPLICATION_RAR",
  mp4: "VIDEO_MP4",
  mp3: "AUDIO_MPEG",
  wav: "AUDIO_WAV",
  otf: "FONT_OTF",
  ttf: "FONT_TTF",
  woff: "FONT_WOFF",
  woff2: "FONT_WOFF2",
};

// Map ContentType enum to actual MIME types for HTTP headers
export const contentTypeToMime: Record<Graphql.ContentType, string> = {
  IMAGE_JPEG: "image/jpeg",
  IMAGE_PNG: "image/png",
  IMAGE_GIF: "image/gif",
  IMAGE_WEBP: "image/webp",
  APPLICATION_PDF: "application/pdf",
  APPLICATION_MSWORD: "application/msword",
  APPLICATION_DOCX:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  APPLICATION_XLS: "application/vnd.ms-excel",
  APPLICATION_XLSX:
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  TEXT_PLAIN: "text/plain",
  APPLICATION_ZIP: "application/zip",
  APPLICATION_RAR: "application/vnd.rar",
  VIDEO_MP4: "video/mp4",
  AUDIO_MPEG: "audio/mpeg",
  AUDIO_WAV: "audio/wav",
  FONT_OTF: "font/otf",
  FONT_TTF: "font/ttf",
  FONT_WOFF: "font/woff",
  FONT_WOFF2: "font/woff2",
};

// Reverse mapping: MIME type to ContentType enum
export const mimeToContentType: Record<string, Graphql.ContentType> = {
  "image/jpeg": "IMAGE_JPEG",
  "image/png": "IMAGE_PNG",
  "image/gif": "IMAGE_GIF",
  "image/webp": "IMAGE_WEBP",
  "application/pdf": "APPLICATION_PDF",
  "application/msword": "APPLICATION_MSWORD",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "APPLICATION_DOCX",
  "application/vnd.ms-excel": "APPLICATION_XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "APPLICATION_XLSX",
  "text/plain": "TEXT_PLAIN",
  "application/zip": "APPLICATION_ZIP",
  "application/vnd.rar": "APPLICATION_RAR",
  "video/mp4": "VIDEO_MP4",
  "audio/mpeg": "AUDIO_MPEG",
  "audio/wav": "AUDIO_WAV",
  "font/otf": "FONT_OTF",
  "font/ttf": "FONT_TTF",
  "font/woff": "FONT_WOFF",
  "font/woff2": "FONT_WOFF2",
};

// Map ContentType enum to file extensions
export const contentTypeToExtensions: Record<Graphql.ContentType, string[]> = {
  IMAGE_JPEG: [".jpg", ".jpeg", ".jpe"],
  IMAGE_PNG: [".png"],
  IMAGE_GIF: [".gif"],
  IMAGE_WEBP: [".webp"],
  APPLICATION_PDF: [".pdf"],
  APPLICATION_MSWORD: [".doc"],
  APPLICATION_DOCX: [".docx"],
  APPLICATION_XLS: [".xls"],
  APPLICATION_XLSX: [".xlsx"],
  TEXT_PLAIN: [".txt", ".text"],
  APPLICATION_ZIP: [".zip"],
  APPLICATION_RAR: [".rar"],
  VIDEO_MP4: [".mp4"],
  AUDIO_MPEG: [".mp3"],
  AUDIO_WAV: [".wav"],
  FONT_OTF: [".otf"],
  FONT_TTF: [".ttf"],
  FONT_WOFF: [".woff"],
  FONT_WOFF2: [".woff2"],
};
