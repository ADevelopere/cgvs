import { ElementType } from "./enum.element.types";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.types";
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

// GraphQL input types (used in Pothos isOneOf definitions)
export type ImageDataSourceStorageFileInputGraphql = {
  storageFileId: number;
};

export type ImageDataSourceInputGraphql = {
  storageFile: ImageDataSourceStorageFileInputGraphql;
};

// ============================================================================
// Element Config
// ============================================================================

export interface ImageElementConfig {
  type: ElementType.IMAGE;
  dataSource: ImageDataSource;
  fit: ElementImageFit;
}

// GraphQL input type (type field omitted - implied by mutation)
export type ImageElementConfigInputGraphql = {
  dataSource: ImageDataSourceInputGraphql;
  fit: ElementImageFit;
};

// GraphQL update input type (deep partial)
export type ImageElementConfigUpdateInputGraphql = {
  dataSource?: ImageDataSourceInputGraphql;
  fit?: ElementImageFit;
};

// Repository input type (matches Config structure)
export type ImageElementConfigInput = {
  type: ElementType.IMAGE;
  dataSource: ImageDataSourceInput;
  fit: ElementImageFit;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type ImageElementCreateInputGraphql =
  CertificateElementBaseCreateInput & {
    config: ImageElementConfigInputGraphql;
  };

// GraphQL update input type (deep partial support)
export type ImageElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    config?: ImageElementConfigUpdateInputGraphql;
  };

// Repository mutation inputs (keep existing)
export type ImageElementCreateInput = CertificateElementBaseCreateInput & {
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
  "config"
> & {
  config: ImageElementConfig;
};
