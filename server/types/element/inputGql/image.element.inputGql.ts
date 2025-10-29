
// ============================================================================
// Data Source Types
// ============================================================================

import { CertificateElementBaseCreateInput, CertificateElementBaseUpdateInput } from "../input";
import { ElementImageFit } from "../output";

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
