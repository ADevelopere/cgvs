import type * as GQL from "@/client/graphql/generated/gql/graphql";
import type { BaseElementFormErrors } from "../base/types";
import type { TextPropsFormErrors } from "../textProps/types";

// ============================================================================
// WORKING STATE TYPES
// ============================================================================

// Complete gender element working state
export type GenderElementFormState = GQL.GenderElementInput;

// ============================================================================
// ERROR TYPES
// ============================================================================

export type GenderElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
};
