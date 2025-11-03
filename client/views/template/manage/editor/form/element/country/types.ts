import type * as GQL from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { TextPropsFormErrors } from "../textProps/types";
import {
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
  FormErrors,
  Action,
  UpdateStateFn,
} from "../../types";

// ============================================================================
// CREATE STATE
// ============================================================================

export type CountryElementFormState = GQL.CountryElementInput;

export type CountryPropsFormState = {
  countryProps: GQL.CountryElementCountryPropsInput;
};

// ============================================================================
// ERROR TYPES
// ============================================================================

export type CountryPropsFieldErrors =
  | FormErrors<GQL.CountryElementCountryPropsInput>
  | undefined;

export type CountryPropsFormErrors = {
  countryProps: CountryPropsFieldErrors;
};

export type CountryElementFormErrors = CountryPropsFormErrors & {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateCountryPropsFn = UpdateStateFn<CountryPropsFormState>;

export type UpdateCountryPropsWithElementIdFn =
  UpdateStateWithElementIdFn<CountryPropsFormState>;

export type CountryPropsUpdateAction = Action<CountryPropsFormState>;

export type ValidateCountryPropsFn = ValidateFieldFn<
  CountryPropsFormState,
  CountryPropsFormErrors
>;
