import {
  CountryElementCountryPropsInput,
  CountryElementInput,
} from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { TextPropsFormErrors } from "../textProps/types";
import {
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
  FormErrors,
} from "../../types";

// ============================================================================
// CREATE STATE
// ============================================================================

export type CountryElementFormState = CountryElementInput;

export type SanitizedCountryPropsFormState = CountryElementCountryPropsInput;

// ============================================================================
// ERROR TYPES
// ============================================================================

export type CountryPropsFormErrors = FormErrors<CountryElementCountryPropsInput>;

export type CountryElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  representation?: string;
};

export type CountryElementCountryPropsValidateFn =
  ValidateFieldFn<CountryElementCountryPropsInput>;
export type ValidateCountryPropsFieldFn =
  ValidateFieldFn<CountryElementCountryPropsInput>;
export type UpdateCountryPropsWithElementIdFn =
  UpdateStateWithElementIdFn<CountryElementCountryPropsInput>;
