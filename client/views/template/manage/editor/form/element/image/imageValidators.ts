import { ValidateImagePropsFn, ValidateImageDataSourceFn, ImageDataSourceFieldErrors } from "./types";

// ============================================================================
// Data Source Validation
// ============================================================================

/**
 * Validate ImageDataSourceInput (OneOf pattern)
 * IMAGE only has one data source type: STORAGE_FILE
 */
export const validateImageDataSource = (): ValidateImageDataSourceFn => {
  const validate: ValidateImageDataSourceFn = ({ value: source }): ImageDataSourceFieldErrors => {
    if (source.storageFile) {
      if (!source.storageFile.path || !source.storageFile.url) {
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
