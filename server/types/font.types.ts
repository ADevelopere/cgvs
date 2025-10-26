import { font } from "@/server/db/schema/font";
import { FileInfo } from "@/server/types/storage.types";

// Type aliases to match schema
export type FontEntity = typeof font.$inferSelect;
export type FontInsertInput = typeof font.$inferInsert;
export type FontSelectType = typeof font.$inferSelect;

// Pothos definition with relations
export type FontPothosDefinition = FontSelectType & {
  storageFile?: FileInfo | null;
};

// Input types for GraphQL
export type FontCreateInput = {
  name: string;
  locale: string[]; // Array of locale codes: ["all", "en", "ar", etc.]
  storageFileId: number;
};

export type FontUpdateInput = {
  id: number;
  name: string;
  locale: string[];
  storageFileId: number;
};

// Usage check result
export type FontUsageReference = {
  elementId: number;
  elementType: string;
  templateId?: number | null;
  templateName?: string | null;
};

export type FontUsageCheckResult = {
  isInUse: boolean;
  usageCount: number;
  usedBy: FontUsageReference[];
  canDelete: boolean;
  deleteBlockReason?: string | null;
};

// Search result with pagination
export type FontSearchResult = {
  fonts: FontSelectType[];
  totalCount: number;
};
