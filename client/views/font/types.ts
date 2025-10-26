// Form data for creating/updating fonts
export interface FontFormData {
  name: string;
  locale: string[];
  storageFileId: number | null;
}

// Font list item (for list view)
export interface FontListItem {
  id: number;
  name: string;
  locale: string[];
  storageFileId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Font with storage file details (for detail view)
export interface FontDetailView {
  id: number;
  name: string;
  locale: string[];
  storageFileId: number;
  createdAt: Date;
  updatedAt: Date;
  storageFile?: {
    path: string;
    name: string;
    url: string;
    contentType: string | null;
    size: number;
  } | null;
}

// File picker result
export interface FilePickerResult {
  fileId: number;
  path: string;
  name: string;
  url: string;
  contentType: string | null;
  size: number;
}

// Font usage information
export interface FontUsageInfo {
  elementId: number;
  elementType: string;
  templateId: number | null;
  templateName: string | null;
}

// Font usage check result
export interface FontUsageCheckResult {
  isInUse: boolean;
  usageCount: number;
  usedBy: FontUsageInfo[];
  canDelete: boolean;
  deleteBlockReason: string | null;
}

// Predefined locale options
export const LOCALE_OPTIONS = [
  { value: "all", label: "All Languages", flag: "🌐" },
  { value: "ar", label: "Arabic", flag: "🇸🇦" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "fr", label: "French", flag: "🇫🇷" },
  { value: "de", label: "German", flag: "🇩🇪" },
  { value: "es", label: "Spanish", flag: "🇪🇸" },
  { value: "zh", label: "Chinese", flag: "🇨🇳" },
  { value: "ja", label: "Japanese", flag: "🇯🇵" },
  { value: "ru", label: "Russian", flag: "🇷🇺" },
  { value: "pt", label: "Portuguese", flag: "🇵🇹" },
  { value: "it", label: "Italian", flag: "🇮🇹" },
  { value: "ko", label: "Korean", flag: "🇰🇷" },
  { value: "tr", label: "Turkish", flag: "🇹🇷" },
] as const;

// Font file extensions
export const FONT_FILE_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2"];
export const FONT_MIME_TYPES = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2",
  "application/font-ttf",
  "application/font-otf",
  "application/font-woff",
  "application/x-font-ttf",
  "application/x-font-otf",
  "application/x-font-woff",
];
