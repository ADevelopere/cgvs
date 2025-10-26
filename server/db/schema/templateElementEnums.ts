import { createPgEnumFromEnum } from "../../utils/db.utils";
import { ElementType } from "../../types";

// Element Types
export const elementTypeEnum = createPgEnumFromEnum(
  "element_type",
  ElementType
);

export enum ElementAlignment {
  LEFT = "LEFT",
  CENTER = "CENTER",
  RIGHT = "RIGHT",
  TOP = "TOP",
  MIDDLE = "MIDDLE",
  BOTTOM = "BOTTOM",
}

// Element Layout & Styling
export const elementAlignmentEnum = createPgEnumFromEnum(
  "element_alignment",
  ElementAlignment
);

export enum ElementOverflow {
  RESIZE_DOWN = "RESIZE_DOWN",
  TRUNCATE = "TRUNCATE",
  ELLIPSE = "ELLIPSE",
  WRAP = "WRAP",
}

export const elementOverflowEnum = createPgEnumFromEnum(
  "element_overflow",
  ElementOverflow
);

export enum ElementImageFit {
  COVER = "COVER",
  CONTAIN = "CONTAIN",
  FILL = "FILL",
}

export const elementImageFitEnum = createPgEnumFromEnum(
  "element_image_fit",
  ElementImageFit
);



// Data Source Configuration

export enum DataSourceType {
  STATIC = "STATIC",
  TEMPLATE_VARIABLE = "TEMPLATE_VARIABLE",
  STUDENT_FIELD = "STUDENT_FIELD",
  CERTIFICATE_FIELD = "CERTIFICATE_FIELD",
}

export const dataSourceTypeEnum = createPgEnumFromEnum("data_source_type", DataSourceType);

export enum DateSourceType {
  STATIC = "STATIC",
  TEMPLATE_VARIABLE = "TEMPLATE_VARIABLE",
  STUDENT_FIELD = "STUDENT_FIELD",
}

export const dateSourceTypeEnum = createPgEnumFromEnum("date_source_type", DateSourceType);

export enum StudentField {
  STUDENT_NAME = "STUDENT_NAME",
  STUDENT_EMAIL = "STUDENT_EMAIL",
  DATE_OF_BIRTH = "DATE_OF_BIRTH",
  GENDER = "GENDER",
  NATIONALITY = "NATIONALITY",
}

export const studentFieldEnum = createPgEnumFromEnum("student_field", StudentField);

export enum CertificateField {
  VERIFICATION_CODE = "VERIFICATION_CODE",
  RELEASE_DATE = "RELEASE_DATE",
}

export const certificateFieldEnum = createPgEnumFromEnum(
  "certificate_field",
  CertificateField
);

// Date Configuration

export enum CalendarType {
  GREGORIAN = "GREGORIAN",
  HIJRI = "HIJRI",
}

export const calendarTypeEnum = createPgEnumFromEnum("calendar_type", CalendarType);

export enum FontSource {
  GOOGLE = "GOOGLE",
  UPLOADED = "UPLOADED",
}

// Font Configuration
export const fontSourceEnum = createPgEnumFromEnum("font_source", FontSource);
