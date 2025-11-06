import { CertificateElementBaseInput, CountryElementCountryPropsInput } from "../input";
import { TextPropsInputGraphql } from "./textProps.inputGql";

// ============================================================================
// Data Source Types
// ============================================================================

// GraphQL input types (used in Pothos isOneOf definitions)
export type CountryDataSourceStudentNationalityInputGraphql = Record<string, never>;

export type CountryDataSourceInputGraphql = {
  studentNationality: CountryDataSourceStudentNationalityInputGraphql;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type CountryElementInputGraphql = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInputGraphql;
  countryProps: CountryElementCountryPropsInput;
};

export type CountryElementUpdateInputGraphql = CountryElementInputGraphql & {
  id: number;
};
