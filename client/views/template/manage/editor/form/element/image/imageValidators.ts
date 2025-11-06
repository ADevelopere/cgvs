import { ImageDataSourceInput } from "@/client/graphql/generated/gql/graphql";
import {
  DataSourceFormErrors,
  ValidateImagePropsFn,
  ValidateImageDataSourceFn,
  ImageDataSourceFieldErrors,
} from "./types";

// ============================================================================
// Data Source Validation
// ============================================================================

/**
 * Validate ImageDataSourceInput (OneOf pattern)
 * IMAGE only has one data source type: STORAGE_FILE
 */
export const validateImageDataSource = (): ValidateImageDataSourceFn => {
  const validate: ValidateImageDataSourceFn = ({
    value: source,
  }): ImageDataSourceFieldErrors => {
    if (source.storageFile) {
      if (
        !source.storageFile.storageFileId ||
        source.storageFile.storageFileId <= 0
      ) {
        return { storageFile: "Please select an image file" };
      }
    } else {
      return { storageFile: "Image file is required" };
    }
    return {};
  };
  return validate;
};

// ============================================================================
// Image Props Validation
// ============================================================================

/**
 * Validate imageProps field
 * No required validations for imageProps
 */
export const validateImageProps = () => {
  const validate: ValidateImagePropsFn = () => {
    // No validations required for imageProps
    return undefined;
  };
  return validate;
};