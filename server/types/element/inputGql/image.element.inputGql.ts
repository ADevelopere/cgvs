import {
  CertificateElementBaseInput,
  ImageElementSpecPropsInput,
} from "../input";

// ============================================================================
// Data Source Types
// ============================================================================

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
export type ImageElementInputGraphql = {
  base: CertificateElementBaseInput;
  imageProps: ImageElementSpecPropsInput;
  dataSource: ImageDataSourceInputGraphql;
};

// GraphQL update input type
export type ImageElementUpdateInputGraphql = ImageElementInputGraphql & {
  id: number;
};
