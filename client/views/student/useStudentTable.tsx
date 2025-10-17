"use client";

import { useCallback, useMemo } from "react";
import validator from "validator";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { EditableColumn } from "@/client/types/table.type";
import {
  isValidCountryCode,
  isValidPhoneNumber,
} from "@/client/views/student/validators";
import { STUDENT_TABLE_COLUMNS } from "@/client/views/student/column";
import { useStudentOperations } from "./useStudentOperations";

/**
 * Table-specific logic for student management
 * Handles columns, validators, and cell updates
 */
export const useStudentTable = () => {
  const { partialUpdateStudent } = useStudentOperations();
  const strings = useAppTranslation("studentTranslations");

  // Validator functions
  const validateFullName = useCallback(
    (value: string): string | null | undefined => {
      if (!value) return strings?.nameRequired;
      const words = value.trim().split(/\s+/);
      if (words.length < 3) return strings?.fullNameMinWords;
      if (!words.every((word) => word.length >= 3)) {
        return strings?.nameMinLength;
      }
      // Unicode regex for letters from any language plus allowed special characters
      const nameRegex = /^[\p{L}\p{M}'-]+$/u;
      if (!words.every((word) => nameRegex.test(word))) {
        return strings?.nameInvalidChars;
      }
      return null;
    },
    [strings],
  );

  const validateEmail = useCallback(
    (value: string | null | undefined): string | null => {
      // Handle null/undefined/empty values
      if (!value) {
        return null; // Allow empty values as per current requirements
      }

      // Trim the value to handle whitespace
      const trimmedValue = value.trim();

      // Check if empty after trim
      if (!trimmedValue) {
        return null; // Allow empty values as per current requirements
      }

      // Validate email format
      return validator.isEmail(trimmedValue) ? null : strings?.emailInvalid;
    },
    [strings],
  );

  const validateGender = useCallback(
    (value?: string | null): string | null => {
      if (!value) return null;
      return ["MALE", "FEMALE"].includes(value.toLocaleUpperCase())
        ? null
        : strings?.genderInvalid;
    },
    [strings],
  );

  const validateNationality = useCallback(
    (value: string): string | null | undefined => {
      return isValidCountryCode(value) ? null : strings?.nationalityInvalid;
    },
    [strings],
  );

  const validateDateOfBirth = useCallback(
    (value: string): string | null | undefined => {
      if (!validator.isDate(value)) return strings?.dateOfBirthInvalid;
      const date = new Date(value);
      const now = new Date();
      return date <= now ? null : strings?.dateOfBirthFuture;
    },
    [strings],
  );

  const validatePhoneNumber = useCallback(
    (value: string): string | null | undefined => {
      return isValidPhoneNumber(value) ? null : strings?.phoneNumberInvalid;
    },
    [strings],
  );

  /**
   * Handle cell updates
   */
  const handleUpdateCell = useCallback(
    async (
      rowId: number,
      columnId: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any,
    ): Promise<void> => {
      const input: Graphql.PartialStudentUpdateInput = {
        id: rowId,
        [columnId]: value,
      };

      // Type conversion based on column
      switch (columnId) {
        case "dateOfBirth":
          input.dateOfBirth = value
            ? new Date(value).toISOString().split("T")[0]
            : null;
          break;
        case "gender":
          input.gender = value as Graphql.Gender;
          break;
        case "nationality":
          input.nationality = value as Graphql.CountryCode;
          break;
      }

      await partialUpdateStudent({ input });
    },
    [partialUpdateStudent],
  );

  /**
   * Get validator for a specific column
   */
  const getValidatorForColumn = useCallback(
    (columnAccessor: string) => {
      switch (columnAccessor) {
        case "name":
          return validateFullName;
        case "email":
          return validateEmail;
        case "gender":
          return validateGender;
        case "nationality":
          return validateNationality;
        case "dateOfBirth":
          return validateDateOfBirth;
        case "phoneNumber":
          return validatePhoneNumber;
        default:
          return () => null;
      }
    },
    [
      validateFullName,
      validateEmail,
      validateGender,
      validateNationality,
      validateDateOfBirth,
      validatePhoneNumber,
    ],
  );

  /**
   * Build columns with validators and update handlers
   */
  const columns = useMemo(
    () =>
      STUDENT_TABLE_COLUMNS.map((column): EditableColumn => {
        if (!column.editable) return column;

        const enhancedColumn: EditableColumn = {
          ...column,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onUpdate: (rowId: number, value: any) =>
            handleUpdateCell(rowId, column.accessor as string, value),
          getIsValid: getValidatorForColumn(column.accessor as string),
        };

        return enhancedColumn;
      }),
    [handleUpdateCell, getValidatorForColumn],
  );

  return {
    columns,
  };
};
