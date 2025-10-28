import { font } from "@/server/db/schema/font";
import { PageInfo } from "./pagination.types";
import { OrderSortDirection } from "@/lib/enum";
import { FileInfo } from "./storage.types";

// Type aliases to match schema
export type FontEntity = typeof font.$inferSelect;
export type FontInsertInput = typeof font.$inferInsert;
export type FontSelectType = typeof font.$inferSelect;

// Pothos definition with relations
export type FontPothosDefinition = FontSelectType & {
  file?: FileInfo | null;
  url?: string | null;
};

// Input types for GraphQL
export type FontCreateInput = {
  name: string;
  locale: string[]; // Array of locale codes: ["all", "en", "ar", etc.]
  storageFilePath: string;
};

export type FontUpdateInput = {
  id: number;
  name: string;
  locale: string[];
  storageFilePath: string;
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

// Response with pagination
export type FontsWithFiltersResponse = {
  data: FontSelectType[];
  pageInfo: PageInfo;
};

// Filter arguments
export type FontFilterArgs = {
  // Name filters
  name?: string | null;
  nameNotContains?: string | null;
  nameEquals?: string | null;
  nameNotEquals?: string | null;
  nameStartsWith?: string | null;
  nameEndsWith?: string | null;
  nameIsEmpty?: boolean | null;
  nameIsNotEmpty?: boolean | null;

  // Locale filter
  locale?: string | null; // Search in locale string

  // Date filters for createdAt
  createdAt?: Date | null;
  createdAtFrom?: Date | null;
  createdAtTo?: Date | null;
  createdAtAfter?: Date | null;
  createdAtBefore?: Date | null;

  // Date filters for updatedAt
  updatedAt?: Date | null;
  updatedAtFrom?: Date | null;
  updatedAtTo?: Date | null;
};

// Order by
export enum FontsOrderByColumn {
  ID = "ID",
  NAME = "NAME",
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
}

export type FontsOrderByClause = {
  column: FontsOrderByColumn;
  order?: OrderSortDirection | null;
};
