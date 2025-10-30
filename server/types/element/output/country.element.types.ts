import type { CertificateElementEntity } from "./base.element.types";
import type { ElementTextPropsEntity } from "./config.element.types";
import type { countryElement } from "@/server/db/schema";

// ============================================================================
// COUNTRY-specific Enums
// ============================================================================

export enum CountryRepresentation {
  COUNTRY_NAME = "COUNTRY_NAME",
  NATIONALITY = "NATIONALITY",
}

export enum CountryDataSourceType {
  STUDENT_NATIONALITY = "STUDENT_NATIONALITY",
}

// ============================================================================
// Data Source Types
// ============================================================================

export type CountryDataSource = {
  type: CountryDataSourceType.STUDENT_NATIONALITY;
};

// ============================================================================
// Raw Entity (from Drizzle schema)
// ============================================================================

export type CountryElementEntity = typeof countryElement.$inferSelect;
// { elementId, textPropsId, representation }

// ============================================================================
// Output Type (mirrors database - base + country_element + element_text_props joined)
// ============================================================================
export type CountryElementCountryProps = Omit<
  CountryElementEntity,
  "representation"
> & {
  representation: CountryRepresentation;
};

export type CountryElementOutput = {
  base: CertificateElementEntity;
  textPropsEntity: ElementTextPropsEntity;
  countryProps: CountryElementCountryProps;
};
