import { ElementImageFit, ImageDataSourceType } from "../output";
import {
  CertificateElementBaseInput,
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
// Mutation Inputs
// ============================================================================

export type ImageElementCreateInput = CertificateElementBaseInput & {
  fit: ElementImageFit;
  dataSource: ImageDataSourceInput;
};

export type ImageElementUpdateInput = CertificateElementBaseUpdateInput & {
  fit?: ElementImageFit | null;
  dataSource?: ImageDataSourceInput | null;
};
