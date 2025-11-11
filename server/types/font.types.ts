import { fontFamily, fontVariant } from "@/server/db/schema/font";
import { PageInfo } from "./pagination.types";
import { OrderSortDirection } from "@/lib/enum";
import { FileInfo } from "./storage.types";

// Font Family types
export type FontFamilyEntity = typeof fontFamily.$inferSelect;
export type FontFamilyInsertInput = typeof fontFamily.$inferInsert;
export type FontFamilySelectType = typeof fontFamily.$inferSelect;

// Font Variant types
export type FontVariantEntity = typeof fontVariant.$inferSelect;
export type FontVariantInsertInput = typeof fontVariant.$inferInsert;
export type FontVariantSelectType = typeof fontVariant.$inferSelect;

// Pothos definitions with relations
export type FontFamilyPothosDefinition = FontFamilySelectType & {
  variants?: FontVariantPothosDefinition[];
};

export type FontVariantPothosDefinition = FontVariantSelectType & {
  family?: FontFamilyPothosDefinition;
  file?: FileInfo | null;
  url?: string | null;
};

// Input types for GraphQL
export type FontFamilyCreateInput = {
  name: string;
  category?: string | null;
  locale: string[];
};

export type FontFamilyUpdateInput = {
  id: number;
  name: string;
  category?: string | null;
  locale: string[];
};

export type FontVariantCreateInput = {
  familyId: number;
  variant: string;
  storageFilePath: string;
};

export type FontVariantUpdateInput = {
  id: number;
  variant: string;
  storageFilePath: string;
};

// Usage check result
export type FontUsageReference = {
  elementId: number;
  elementType: string;
  templateId?: number | null;
  templateName?: string | null;
};

export type FontVariantUsageCheckResult = {
  isInUse: boolean;
  usageCount: number;
  usedBy: FontUsageReference[];
  canDelete: boolean;
  deleteBlockReason?: string | null;
};

export type FontFamilyUsageCheckResult = {
  isInUse: boolean;
  variantsInUse: number;
  totalVariants: number;
  canDelete: boolean;
  deleteBlockReason?: string | null;
};

// Response with pagination
export type FontFamiliesWithFiltersResponse = {
  data: FontFamilySelectType[];
  pageInfo: PageInfo;
};

export type FontVariantsWithFiltersResponse = {
  data: FontVariantSelectType[];
  pageInfo: PageInfo;
};

// Filter arguments
export type FontFamilyFilterArgs = {
  name?: string | null;
  nameContains?: string | null;
  category?: string | null;
  locale?: string | null;
  createdAtFrom?: Date | null;
  createdAtTo?: Date | null;
};

export type FontVariantFilterArgs = {
  familyId?: number | null;
  variant?: string | null;
  variantContains?: string | null;
  createdAtFrom?: Date | null;
  createdAtTo?: Date | null;
};

// Order by
export enum FontFamiliesOrderByColumn {
  ID = "ID",
  NAME = "NAME",
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
}

export enum FontVariantsOrderByColumn {
  ID = "ID",
  VARIANT = "VARIANT",
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
}

export type FontFamiliesOrderByClause = {
  column: FontFamiliesOrderByColumn;
  order?: OrderSortDirection | null;
};

export type FontVariantsOrderByClause = {
  column: FontVariantsOrderByColumn;
  order?: OrderSortDirection | null;
};
