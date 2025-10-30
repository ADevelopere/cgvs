import {
  CertificateElementBaseInput,
  CertificateElementBaseUpdateInput,
} from "../input";
import { CountryRepresentation } from "../output";
import {
  TextPropsInputGraphql,
  TextPropsUpdateInputGraphql,
} from "./config.element.inputGql";

// ============================================================================
// Data Source Types
// ============================================================================

// GraphQL input types (used in Pothos isOneOf definitions)
export type CountryDataSourceStudentNationalityInputGraphql = Record<
  string,
  never
>;

export type CountryDataSourceInputGraphql = {
  studentNationality: CountryDataSourceStudentNationalityInputGraphql;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type CountryElementCreateInputGraphql =
  CertificateElementBaseInput & {
    textProps: TextPropsInputGraphql;
    representation: CountryRepresentation;
  };

export type CountryElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    textProps?: TextPropsUpdateInputGraphql | null;
    representation?: CountryRepresentation | null;
  };
