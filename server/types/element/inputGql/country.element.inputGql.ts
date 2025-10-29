import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "../input";
import { CountryRepresentation } from "../output";
import {
  TextPropsCreateInputGraphql,
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
// Element Config
// ============================================================================

// compatible with isOneOf definitions
export type CountryElementConfigCreateInputGraphql = {
  textProps: TextPropsCreateInputGraphql;
  representation: CountryRepresentation;
  dataSource: CountryDataSourceInputGraphql;
};

// GraphQL update input type (deep partial)
export type CountryElementConfigUpdateInputGraphql = {
  textProps?: TextPropsUpdateInputGraphql | null;
  representation?: CountryRepresentation | null;
  dataSource?: CountryDataSourceInputGraphql | null;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type CountryElementCreateInputGraphql =
  CertificateElementBaseCreateInput & {
    config: CountryElementConfigCreateInputGraphql;
  };

export type CountryElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    config?: CountryElementConfigUpdateInputGraphql | null;
  };
