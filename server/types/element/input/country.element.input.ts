import { CertificateElementBaseInput } from "./base.element.input";
import { CountryDataSourceType, CountryRepresentation } from "../output";
import { TextPropsInput } from "./textProps.input";
import { countryElement } from "@/server/db/schema";

// ============================================================================
// Data Source Types
// ============================================================================

export type CountryDataSourceInput = {
  type: CountryDataSourceType.STUDENT_NATIONALITY;
};

// ============================================================================
// Mutation Inputs (no config field)
// ============================================================================

export type CountryElementEntityInput = typeof countryElement.$inferInsert;
export type CountryElementCountryPropsInput = Omit<
  CountryElementEntityInput,
  "elementId" | "textPropsId" | "representation"
> & {
  representation: CountryRepresentation;
};

export type CountryElementInput = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInput;
  countryProps: CountryElementCountryPropsInput;
};

export type CountryElementUpdateInput = CountryElementInput & {
  id: number;
};

export type CountryElementSpecPropsStandaloneUpdateInput = {
  elementId: number;
  countryProps: CountryElementCountryPropsInput;
};
