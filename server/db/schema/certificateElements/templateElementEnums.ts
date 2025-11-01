import * as ElementTypes from "@/server/types/element";
import { createPgEnumFromEnum } from "@/server/utils/db.utils";

/**
 * IMPORTANT: All certificate element enums must be defined in this file.
 *
 * This centralized location prevents circular dependency issues during module initialization.
 * When Drizzle ORM processes the schema, it needs all enums to be initialized before
 * any table definitions that reference them. Defining enums in individual table files
 * (like dateElement.ts, countryElement.ts, etc.) can cause "Cannot access X before initialization"
 * errors due to the barrel export chain in index.ts.
 *
 * Pattern: Always define enums here, then import them in the table definition files.
 */

// Element Types
export const elementTypeEnum = createPgEnumFromEnum(
  "element_type",
  ElementTypes.ElementType
);

// Element Layout & Styling
export const elementAlignmentEnum = createPgEnumFromEnum(
  "element_alignment",
  ElementTypes.ElementAlignment
);

export const elementOverflowEnum = createPgEnumFromEnum(
  "element_overflow",
  ElementTypes.ElementOverflow
);

export const elementImageFitEnum = createPgEnumFromEnum(
  "element_image_fit",
  ElementTypes.ElementImageFit
);

// Text Data Source Configuration
export const textDataSourceTypeEnum = createPgEnumFromEnum(
  "text_data_source_type",
  ElementTypes.TextDataSourceType
);

export const studentTextFieldEnum = createPgEnumFromEnum(
  "student_text_field",
  ElementTypes.StudentTextField
);

export const certificateTextFieldEnum = createPgEnumFromEnum(
  "certificate_text_field",
  ElementTypes.CertificateTextField
);

// Date Data Source Configuration
export const dateDataSourceTypeEnum = createPgEnumFromEnum(
  "date_data_source_type",
  ElementTypes.DateDataSourceType
);

export const studentDateFieldEnum = createPgEnumFromEnum(
  "student_date_field",
  ElementTypes.StudentDateField
);

export const certificateDateFieldEnum = createPgEnumFromEnum(
  "certificate_date_field",
  ElementTypes.CertificateDateField
);

// Date Configuration
export const calendarTypeEnum = createPgEnumFromEnum(
  "calendar_type",
  ElementTypes.CalendarType
);

export const dateTransformationTypeEnum = createPgEnumFromEnum(
  "date_transformation_type",
  ElementTypes.DateTransformationType
);

export const countryRepresentationEnum = createPgEnumFromEnum(
  "country_representation",
  ElementTypes.CountryRepresentation
);

export const qrCodeErrorCorrectionEnum = createPgEnumFromEnum(
  "qr_code_error_correction",
  ElementTypes.QRCodeErrorCorrection
);

// Font Configuration
export const fontSourceEnum = createPgEnumFromEnum(
  "font_source",
  ElementTypes.FontSource
);
