import * as GQL from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { FormErrors, UpdateStateFn } from "../types";

// Re-export GraphQL types for use in components
export type ImageDataSourceInput = GQL.ImageDataSourceInput;

export type UpdateImageDataSourceFn = (
  dataSource: GQL.ImageDataSourceInput
) => void;

// ============================================================================
// Image-specific Props State
// ============================================================================

export type ImagePropsState = GQL.ImageElementSpecPropsInput;
export type UpdateImagePropsFn = UpdateStateFn<ImagePropsState>;

// ============================================================================
// Form State Types
// ============================================================================

export type ImageElementFormState = GQL.ImageElementInput;

// ============================================================================
// Error Types
// ============================================================================

export type ImagePropsFormErrors = FormErrors<ImagePropsState>;
export type DataSourceFormErrors = FormErrors<GQL.ImageDataSourceInput>;

export type ImageElementFormErrors = {
  base: BaseElementFormErrors;
  imageProps: ImagePropsFormErrors;
  dataSource: DataSourceFormErrors;
};
