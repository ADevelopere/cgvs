import { ElementImageFit, ImageDataSourceType } from "../output";
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
export type ImageElementConfigCreateInput = {
  dataSource: ImageDataSourceInput;
  fit: ElementImageFit;
};

export type ImageElementConfigUpdateInput = {
  dataSource?: ImageDataSourceInput | null;
  fit?: ElementImageFit | null;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// Repository mutation inputs (keep existing)
export type ImageElementCreateInput = CertificateElementBaseCreateInput & {
  config: ImageElementConfigCreateInput;
};

export type ImageElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: ImageElementConfigUpdateInput | null;
};
