export enum ElementType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DATE = "DATE",
  IMAGE = "IMAGE",
  GENDER = "GENDER",
  COUNTRY = "COUNTRY",
  QR_CODE = "QR_CODE",
}

export enum FontSource {
  GOOGLE = "GOOGLE",
  SELF_HOSTED = "SELF_HOSTED",
}

export enum ElementAlignment {
  LEFT = "LEFT",
  CENTER = "CENTER",
  RIGHT = "RIGHT",
  TOP = "TOP",
  MIDDLE = "MIDDLE",
  BOTTOM = "BOTTOM",
}

export enum ElementOverflow {
  RESIZE_DOWN = "RESIZE_DOWN",
  TRUNCATE = "TRUNCATE",
  ELLIPSE = "ELLIPSE",
  WRAP = "WRAP",
}

export enum ElementImageFit {
  COVER = "COVER",
  CONTAIN = "CONTAIN",
  FILL = "FILL",
}

// text source types
export enum TextDataSourceType {
  STATIC = "STATIC",
  TEMPLATE_TEXT_VARIABLE = "TEMPLATE_TEXT_VARIABLE",
  TEMPLATE_SELECT_VARIABLE = "TEMPLATE_SELECT_VARIABLE",
  STUDENT_TEXT_FIELD = "STUDENT_TEXT_FIELD",
  CERTIFICATE_TEXT_FIELD = "CERTIFICATE_TEXT_FIELD",
}

export enum StudentTextField {
  STUDENT_NAME = "STUDENT_NAME",
  STUDENT_EMAIL = "STUDENT_EMAIL",
}

export enum CertificateTextField {
  VERIFICATION_CODE = "VERIFICATION_CODE",
}

// date source types
export enum StudentDateField {
  DATE_OF_BIRTH = "DATE_OF_BIRTH",
}

export enum CertificateDateField {
  RELEASE_DATE = "RELEASE_DATE",
}

export enum DateDataSourceType {
  STATIC = "STATIC",
  TEMPLATE_DATE_VARIABLE = "TEMPLATE_DATE_VARIABLE",
  STUDENT_DATE_FIELD = "STUDENT_DATE_FIELD",
  CERTIFICATE_DATE_FIELD = "CERTIFICATE_DATE_FIELD",
}

export enum CalendarType {
  GREGORIAN = "GREGORIAN",
  HIJRI = "HIJRI",
}

export enum CountryRepresentation {
  COUNTRY_NAME = "COUNTRY_NAME",
  NATIONALITY = "NATIONALITY",
}

export enum QRCodeDataSourceType {
  VERIFICATION_URL = "VERIFICATION_URL",
  VERIFICATION_CODE = "VERIFICATION_CODE",
}

export enum QRCodeErrorCorrection {
  L = "L", // Low (~7% correction)
  M = "M", // Medium (~15% correction)
  Q = "Q", // Quartile (~25% correction)
  H = "H", // High (~30% correction)
}

// ============================================================================
// Element Configuration Types (for JSONB storage)
// ============================================================================

// Font reference types
export type FontReference =
  | { type: FontSource.GOOGLE; identifier: string }
  | { type: FontSource.SELF_HOSTED; fontId: number };

// Base text properties shared by text-based elements
export interface TextProps {
  fontRef: FontReference;
  fontSize: number;
  color: string; // e.g., "#000000" or "rgba(0,0,0,1)"
  overflow: ElementOverflow;
}

// Data source types for TEXT elements
export type TextDataSource =
  | { type: TextDataSourceType.STATIC; value: string }
  | {
      type: TextDataSourceType.STUDENT_TEXT_FIELD;
      field: StudentTextField;
    }
  | {
      type: TextDataSourceType.CERTIFICATE_TEXT_FIELD;
      field: CertificateTextField;
    }
  | {
      type: TextDataSourceType.TEMPLATE_TEXT_VARIABLE;
      variableId: number;
    }
  | {
      type: TextDataSourceType.TEMPLATE_SELECT_VARIABLE;
      variableId: number;
    };

// Data source types for DATE elements
export type DateDataSource =
  | { type: DateDataSourceType.STATIC; value: string }
  | {
      type: DateDataSourceType.STUDENT_DATE_FIELD;
      field: StudentDateField;
    }
  | {
      type: DateDataSourceType.CERTIFICATE_DATE_FIELD;
      field: CertificateDateField;
    }
  | {
      type: DateDataSourceType.TEMPLATE_DATE_VARIABLE;
      variableId: number;
    };

// Data source types for QR_CODE elements
export type QRCodeDataSource =
  | { type: QRCodeDataSourceType.VERIFICATION_URL }
  | { type: QRCodeDataSourceType.VERIFICATION_CODE };

// Individual element configuration types
export interface TextElementConfig {
  type: ElementType.TEXT;
  textProps: TextProps;
  dataSource: TextDataSource;
}

export interface DateElementConfig {
  type: ElementType.DATE;
  textProps: TextProps;
  calendarType: CalendarType;
  offsetDays: number;
  format: string; // e.g., "YYYY-MM-DD", "DD/MM/YYYY"
  mapping?: Record<string, string>; // Custom date component mappings (e.g., month names)
  dataSource: DateDataSource;
}

export interface NumberElementConfig {
  type: ElementType.NUMBER;
  textProps: TextProps;
  templateVariableId: number;
  mapping: Record<string, string>; // Breakpoint-to-text rules
}

export interface CountryElementConfig {
  type: ElementType.COUNTRY;
  textProps: TextProps;
  representation: CountryRepresentation;
  // Data source is implicitly student.nationality
  // The application uses TemplateConfig.locale to map country code to country name
}

export interface GenderElementConfig {
  type: ElementType.GENDER;
  textProps: TextProps;
  // Data source is implicitly student.gender
  // The application uses TemplateConfig.locale for mapping gender to text
}

export interface ImageElementConfig {
  type: ElementType.IMAGE;
  storageFileId: number;
  fit: ElementImageFit;
}

export interface QRCodeElementConfig {
  type: ElementType.QR_CODE;
  dataSource: QRCodeDataSource;
  errorCorrection: QRCodeErrorCorrection;
  foregroundColor: string; // e.g., "#000000"
  backgroundColor: string; // e.g., "#FFFFFF"
}

// Discriminated union type for all element configurations
export type ElementConfig =
  | TextElementConfig
  | DateElementConfig
  | NumberElementConfig
  | CountryElementConfig
  | GenderElementConfig
  | ImageElementConfig
  | QRCodeElementConfig;
