import { ImageDataSourceInput } from "@/client/graphql/generated/gql/graphql";
import { DataSourceFormErrors, ValidateImagePropsFn } from "./types";

// ============================================================================
// Data Source Validation
// ============================================================================

/**
 * Validate ImageDataSourceInput (OneOf pattern)
 * IMAGE only has one data source type: STORAGE_FILE
 */
export const validateImageDataSource = (
  dataSource: ImageDataSourceInput
): DataSourceFormErrors => {
  const errors: DataSourceFormErrors = {};

  if (dataSource.storageFile) {
    if (
      !dataSource.storageFile.storageFileId ||
      dataSource.storageFile.storageFileId <= 0
    ) {
      errors.storageFile = "Please select an image file";
    }
  } else {
    errors.storageFile = "Image file is required";
  }

  return errors;
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