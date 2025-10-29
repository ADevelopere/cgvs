import { ElementImageFit, ElementType, ImageDataSourceType } from "../output";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";

// ============================================================================
// Data Source Types
// ============================================================================
export type ImageDataSourceInput = {
  type: ImageDataSourceType.STORAGE_FILE;
  storageFileId: number;
};

// ============================================================================
// Element Config
// ============================================================================

// Repository input type (matches Config structure)
export type ImageElementConfigInput = {
  type: ElementType.IMAGE;
  dataSource: ImageDataSourceInput;
  fit: ElementImageFit;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// Repository mutation inputs (keep existing)
export type ImageElementCreateInput = CertificateElementBaseCreateInput & {
  config: ImageElementConfigInput;
};

export type ImageElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<ImageElementConfigInput>;
};
