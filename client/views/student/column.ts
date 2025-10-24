import {
  Column,
  EditableColumn,
} from "@/client/components/Table/types/column.type";
import type { Student, Gender, CountryCode } from "@/client/graphql/generated/gql/graphql";

// Column IDs as const
export const STUDENT_COLUMN_IDS = {
  name: "name",
  email: "email",
  dateOfBirth: "dateOfBirth",
  gender: "gender",
  nationality: "nationality",
  phoneNumber: "phoneNumber",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

// Properly typed column types for each column
// Using runtime types instead of GraphQL's 'any' for custom scalars
export type NameColumn = EditableColumn<Student, string, "name", number>;
export type EmailColumn = EditableColumn<
  Student,
  string | null | undefined,
  "email",
  number
>;
export type DateOfBirthColumn = EditableColumn<
  Student,
  Date | string | null | undefined,
  "dateOfBirth",
  number
>;
export type GenderColumn = EditableColumn<
  Student,
  Gender | null | undefined,
  "gender",
  number
>;
export type NationalityColumn = EditableColumn<
  Student,
  CountryCode | null | undefined,
  "nationality",
  number
>;
export type PhoneNumberColumn = EditableColumn<
  Student,
  string | null | undefined,
  "phoneNumber",
  number
>;
export type CreatedAtColumn = Column<Student, "createdAt", number>;
export type UpdatedAtColumn = Column<Student, "updatedAt", number>;

// Union type of all student columns
export type StudentColumn =
  | NameColumn
  | EmailColumn
  | DateOfBirthColumn
  | GenderColumn
  | NationalityColumn
  | PhoneNumberColumn
  | CreatedAtColumn
  | UpdatedAtColumn;
