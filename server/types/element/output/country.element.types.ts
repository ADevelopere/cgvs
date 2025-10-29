import type { CertificateElementEntity } from "./base.element.types";
import type { TextProps, ElementTextPropsEntity } from "./config.element.types";
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

export type CountryElementOutput = CertificateElementEntity &
  CountryElementEntity & {
    // From element_text_props table (joined)
    textPropsEntity: ElementTextPropsEntity;
    textProps: TextProps;
    
    // From country_element table
    representation: CountryRepresentation;
  };

// ============================================================================
// Pothos Definition
// ============================================================================

export type CountryElementPothosDefinition = CountryElementOutput;
