import { ElementType, ElementAlignment } from "./enum.element.types";
import { CertificateElementBaseUpdateInput } from "./base.element.types";
import type { CertificateElementPothosDefinition } from "./union.element.types";

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

export type ImageDataSourceInput = {
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

export type ImageElementConfigInput = {
  type: ElementType.IMAGE;
  dataSource: ImageDataSourceInput;
  fit: ElementImageFit;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type ImageElementCreateInput = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: ImageElementConfigInput;
};

export type ImageElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<ImageElementConfigInput>;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type ImageElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "parsedConfig"
> & {
  parsedConfig: ImageElementConfig;
};
