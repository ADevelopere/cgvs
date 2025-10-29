import type { CertificateElementEntity } from "./base.element.types";
import type { imageElement } from "@/server/db/schema";

// ============================================================================
// IMAGE-specific Enums
// ============================================================================

export enum ElementImageFit {
  COVER = "COVER",
  CONTAIN = "CONTAIN",
  FILL = "FILL",
}

export enum ImageDataSourceType {
  STORAGE_FILE = "STORAGE_FILE",
}

// ============================================================================
// Data Source Types
// ============================================================================

export type ImageDataSource = {
  type: ImageDataSourceType.STORAGE_FILE;
  storageFileId: number;
};

// ============================================================================
// Raw Entity (from Drizzle schema)
// ============================================================================

export type ImageElementEntity = typeof imageElement.$inferSelect;
// { elementId, fit, dataSource, storageFileId }

// ============================================================================
// Output Type (mirrors database - base + image_element joined)
// ============================================================================

export type ImageElementOutput = CertificateElementEntity & {
  // No textProps
  fit: ElementImageFit;
  dataSource: ImageDataSource;
  storageFileId: number; // Mirrored FK
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type ImageElementPothosDefinition = ImageElementOutput;
