import { ElementType } from "./enum.element.types";
import type { CertificateElementPothosDefinition } from "../union.element.types";

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
// Element Config
// ============================================================================

export interface ImageElementConfig {
  type: ElementType.IMAGE;
  dataSource: ImageDataSource;
  fit: ElementImageFit;
}

// ============================================================================
// Pothos Definition
// ============================================================================

export type ImageElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: ImageElementConfig;
};
