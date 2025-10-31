import {
  ImageDataSourceInput as GQLImageDataSourceInput,
  ImageDataSource,
  ElementImageFit,
  ImageElementInput,
} from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { FormErrors } from "../types";

// Re-export GraphQL types for use in components
export type ImageDataSourceInput = GQLImageDataSourceInput;

// ============================================================================
// Image-specific Props State
// ============================================================================

export type ImagePropsState = {
  fit: ElementImageFit;
};

// ============================================================================
// Form State Types
// ============================================================================

export type ImageElementFormState = ImageElementInput;

// ============================================================================
// Error Types
// ============================================================================

export type ImagePropsFormErrors = FormErrors<ImagePropsState>;

export type DataSourceFormErrors = {
  storageFile?: string;
};

export type ImageElementFormErrors = {
  base: BaseElementFormErrors;
  imageProps: ImagePropsFormErrors;
  dataSource: DataSourceFormErrors;
};

// ============================================================================
// Conversion Utilities (Output to Input)
// ============================================================================

/**
 * Convert ImageDataSource (Output type) to ImageDataSourceInput (Input type)
 * Used when loading existing data for editing
 */
export const imageDataSourceToGraphQL = (
  source: ImageDataSource
): ImageDataSourceInput => {
  // ImageDataSource is currently only ImageDataSourceStorageFile
  return {
    storageFile: {
      storageFileId: source.storageFileId ?? -1,
    },
  };
};
