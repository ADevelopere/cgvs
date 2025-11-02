import {
  CountryElementCountryPropsInput,
  CountryElementInput,
} from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { TextPropsFormErrors } from "../textProps/types";
import { ValidateFieldFn } from "../../types";

// ============================================================================
// CREATE STATE
// ============================================================================

export type CountryElementFormState = CountryElementInput;

// ============================================================================
// ERROR TYPES
// ============================================================================

export type CountryElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  representation?: string;
};

export type CountryElementCountryPropsValidateFn =
  ValidateFieldFn<CountryElementCountryPropsInput>;
