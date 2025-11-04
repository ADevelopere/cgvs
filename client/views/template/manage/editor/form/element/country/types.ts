import type * as GQL from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { TextPropsFormErrors } from "../textProps/types";
import {
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
  FormErrors,
  UpdateStateFn,
} from "../../types";

// ============================================================================
// CREATE STATE
// ============================================================================

export type CountryElementFormState = GQL.CountryElementInput;

export type CountryPropsFormState = GQL.CountryElementCountryPropsInput;

// ============================================================================
// ERROR TYPES
// ============================================================================

export type CountryPropsFormErrors =
  FormErrors<GQL.CountryElementCountryPropsInput>;

export type CountryElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  countryProps: CountryPropsFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateCountryPropsFn = UpdateStateFn<CountryPropsFormState>;

export type UpdateCountryPropsWithElementIdFn =
  UpdateStateWithElementIdFn<CountryPropsFormState>;

export type ValidateCountryPropsFn = ValidateFieldFn<
  CountryPropsFormState,
  string | undefined
>;
