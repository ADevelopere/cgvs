import {
  ImageElementCreateInput,
  ImageElementUpdateInput,
  ImageDataSourceInput as GQLImageDataSourceInput,
  ImageDataSource,
  ImageElement,
  ElementImageFit,
} from "@/client/graphql/generated/gql/graphql";
import {
  BaseElementFormErrors,
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "../base/types";
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

export type ImageElementFormCreateState = {
  base: CertificateElementBaseCreateInput;
  imageProps: ImagePropsState;
  dataSource: ImageDataSourceInput;
};

export type ImageElementFormUpdateState = {
  base: CertificateElementBaseUpdateInput;
  imageProps: ImagePropsState;
  dataSource: ImageDataSourceInput;
};

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

/**
 * Convert ImageElement (Output) to ImageElementFormUpdateState (Input)
 * Used when loading existing element for editing
 */
export const imageElementToFormState = (
  element: ImageElement
): ImageElementFormUpdateState => {
  return {
    base: {
      id: element.id!,
      name: element.name ?? "",
      description: element.description ?? "",
      positionX: element.positionX ?? 0,
      positionY: element.positionY ?? 0,
      width: element.width ?? 100,
      height: element.height ?? 100,
      alignment: element.alignment ?? "TOP",
      renderOrder: element.renderOrder ?? 0,
    },
    imageProps: {
      fit: element.fit ?? "CONTAIN",
    },
    dataSource: element.imageDataSource
      ? imageDataSourceToGraphQL(element.imageDataSource)
      : { storageFile: { storageFileId: -1 } },
  };
};

