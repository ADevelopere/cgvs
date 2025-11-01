import type {
  BaseCertificateElementFormState,
  BaseElementFormErrors,
} from "../base/types";
import type { TextPropsFormErrors, TextPropsState } from "../textProps/types";

// ============================================================================
// ERROR TYPES
// ============================================================================

export type GenderElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
};

export type GenderElementFormState = {
  base: BaseCertificateElementFormState;
  textProps: TextPropsState;
};
