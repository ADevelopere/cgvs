
// ============================================================================
// Data Source Types
// ============================================================================

import { CertificateElementBaseInput, CertificateElementBaseUpdateInput } from "../input";
import { ElementImageFit } from "../output";

// GraphQL input types (used in Pothos isOneOf definitions)
export type ImageDataSourceStorageFileInputGraphql = {
  storageFileId: number;
};

export type ImageDataSourceInputGraphql = {
  storageFile: ImageDataSourceStorageFileInputGraphql;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type ImageElementCreateInputGraphql =
  CertificateElementBaseInput & {
    fit: ElementImageFit;
    dataSource: ImageDataSourceInputGraphql;
  };

// GraphQL update input type (deep partial support)
export type ImageElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    fit?: ElementImageFit | null;
    dataSource?: ImageDataSourceInputGraphql | null;
  };
