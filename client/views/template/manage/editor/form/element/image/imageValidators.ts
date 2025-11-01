import { ImageDataSourceInput } from "@/client/graphql/generated/gql/graphql";
import { ValidateFieldFn } from "../../types";
import {
  ImagePropsState,
  DataSourceFormErrors,
  ImagePropsFormErrors,
} from "./types";

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
 * Validate individual image props fields
 */
export const validateImagePropsField: ValidateFieldFn<ImagePropsState> = (
  key,
  value
) => {
  switch (key) {
    case "fit":
      if (!value) return "Image fit is required";
      return undefined;
    default:
      return undefined;
  }
};

/**
 * Validate all image props at once
 */
export const validateImageProps = (
  imageProps: ImagePropsState
): ImagePropsFormErrors => {
  const errors: ImagePropsFormErrors = {};

  const fitError = validateImagePropsField("fit", imageProps.fit);
  if (fitError) errors.fit = fitError;

  return errors;
};

