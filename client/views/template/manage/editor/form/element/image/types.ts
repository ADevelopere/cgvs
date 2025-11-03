import * as GQL from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import {
  FormErrors,
  UpdateStateFn,
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
  Action,
} from "../../types";

// Re-export GraphQL types for use in components
export type ImageDataSourceInput = GQL.ImageDataSourceInput;

export type UpdateImageDataSourceFn = (
  dataSource: GQL.ImageDataSourceInput
) => void;

// ============================================================================
// Image-specific Props State
// ============================================================================

export type ImagePropsFormState = {
  imageProps: GQL.ImageElementSpecPropsInput;
};

export type UpdateImagePropsFieldsFn =
  UpdateStateFn<GQL.ImageElementSpecPropsInput>;
export type UpdateImagePropsFn = UpdateStateFn<ImagePropsFormState>;
export type UpdateImagePropsWithElementIdFn =
  UpdateStateWithElementIdFn<ImagePropsFormState>;
export type ImagePropsUpdateAction = Action<ImagePropsFormState>;

// ============================================================================
// Form State Types
// ============================================================================

export type ImageElementFormState = GQL.ImageElementInput;

// ============================================================================
// Error Types
// ============================================================================

export type ImagePropsFieldErrors = FormErrors<GQL.ImageElementSpecPropsInput>;

export type ImagePropsFormErrors = {
  imageProps: ImagePropsFieldErrors;
};

export type DataSourceFormErrors = FormErrors<GQL.ImageDataSourceInput>;

export type ImageElementFormErrors = ImagePropsFormErrors & {
  base: BaseElementFormErrors;
  dataSource: DataSourceFormErrors;
};

export type ValidateImagePropsFn = ValidateFieldFn<
  ImagePropsFormState,
  ImagePropsFormErrors
>;
