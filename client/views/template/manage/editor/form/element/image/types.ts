import * as GQL from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { FormErrors, UpdateStateFn, ValidateFieldFn, UpdateStateWithElementIdFn } from "../../types";

export type UpdateImageDataSourceFn = (dataSource: GQL.ImageDataSourceInput) => void;

// ============================================================================
// Image Data Source State
// ============================================================================

export type ImageDataSourceFormState = {
  dataSource: GQL.ImageDataSourceInput;
};

export type ImageDataSourceFieldErrors = FormErrors<GQL.ImageDataSourceInput> | undefined;

export type ImageDataSourceFormErrors = {
  dataSource?: ImageDataSourceFieldErrors;
};

export type UpdateImageDataSourceWithElementIdFn = UpdateStateWithElementIdFn<ImageDataSourceFormState>;

// ============================================================================
// Image-specific Props State
// ============================================================================

export type ImagePropsFormState = GQL.ImageElementSpecPropsInput;

export type UpdateImagePropsFn = UpdateStateFn<ImagePropsFormState>;
export type UpdateImagePropsWithElementIdFn = UpdateStateWithElementIdFn<ImagePropsFormState>;

// ============================================================================
// Form State Types
// ============================================================================

export type ImageElementFormState = GQL.ImageElementInput;

// ============================================================================
// Error Types
// ============================================================================

export type ImagePropsFormErrors = FormErrors<GQL.ImageElementSpecPropsInput>;

export type DataSourceFormErrors = FormErrors<GQL.ImageDataSourceInput>;

export type ImageElementFormErrors = ImageDataSourceFormErrors & {
  base: BaseElementFormErrors;
  imageProps: ImagePropsFormErrors;
};

export type ValidateImagePropsFn = ValidateFieldFn<ImagePropsFormState, string | undefined>;

export type ValidateImageDataSourceFn = ValidateFieldFn<ImageDataSourceFormState, ImageDataSourceFieldErrors>;

// ============================================================================
// Conversion Utilities
// ============================================================================

/**
 * Convert ImageDataSource (query union type) to ImageDataSourceInput (OneOf input type)
 */
export const imageDataSourceToInput = (state: GQL.ImageDataSource): GQL.ImageDataSourceInput => {
  if (state.__typename === "ImageDataSourceStorageFile") {
    if (!state.storageFilePath || !state.imageUrl) {
      throw new Error("Invalid ImageDataSourceStorageFile: missing storageFilePath or imageUrl");
    }
    return {
      storageFile: {
        path: state.storageFilePath,
        url: state.imageUrl,
      },
    };
  }
  throw new Error(`Unknown ImageDataSource type: ${state.__typename}`);
};
