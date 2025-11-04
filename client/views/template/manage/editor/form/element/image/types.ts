import * as GQL from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import {
  FormErrors,
  UpdateStateFn,
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
} from "../../types";

export type UpdateImageDataSourceFn = (
  dataSource: GQL.ImageDataSourceInput
) => void;

// ============================================================================
// Image-specific Props State
// ============================================================================

export type ImagePropsFormState = GQL.ImageElementSpecPropsInput;

export type UpdateImagePropsFn = UpdateStateFn<ImagePropsFormState>;
export type UpdateImagePropsWithElementIdFn =
  UpdateStateWithElementIdFn<ImagePropsFormState>;

// ============================================================================
// Form State Types
// ============================================================================

export type ImageElementFormState = GQL.ImageElementInput;

// ============================================================================
// Error Types
// ============================================================================

export type ImagePropsFormErrors = FormErrors<GQL.ImageElementSpecPropsInput>;

export type DataSourceFormErrors = FormErrors<GQL.ImageDataSourceInput>;

export type ImageElementFormErrors = ImagePropsFormErrors & {
  base: BaseElementFormErrors;
  dataSource: DataSourceFormErrors;
  imageProps: ImagePropsFormErrors;
};

export type ValidateImagePropsFn = ValidateFieldFn<
  ImagePropsFormState,
  string | undefined
>;
