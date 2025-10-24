# useStudentTable Hook - Refactored Implementation

**File:** `client/views/student/useStudentTable.tsx`

This hook provides table-specific logic including validators, filter state, sort state, and cell update handlers.

```typescript
"use client";

import { useState, useCallback, useMemo } from "react";
import validator from "validator";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
  isValidCountryCode,
  isValidPhoneNumber,
} from "@/client/views/student/validators";
import { buildStudentColumns } from "./columns";
import { useStudentOperations } from "./useStudentOperations";

export const useStudentTable = () => {
  const { partialUpdateStudent, updateSort as sortOp, setColumnFilter } = useStudentOperations();
  const strings = useAppTranslation("studentTranslations");
  const genderStrings = useAppTranslation("genderTranslations");

  // Filter UI State
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});

  // Sort State (managed locally or from store)
  const [sortState, setSortState] = useState<Record<string, "ASC" | "DESC" | null>>({});

  // Validator functions
  const validateFullName = useCallback(
    (value: string): string | null => {
      if (!value) return strings?.nameRequired || "Name is required";
      const words = value.trim().split(/\s+/);
      if (words.length < 3) return strings?.fullNameMinWords || "Full name must have at least 3 words";
      if (!words.every(word => word.length >= 3)) {
        return strings?.nameMinLength || "Each word must be at least 3 characters";
      }
      const nameRegex = /^[\p{L}\p{M}'-]+$/u;
      if (!words.every(word => nameRegex.test(word))) {
        return strings?.nameInvalidChars || "Name contains invalid characters";
      }
      return null;
    },
    [strings]
  );

  const validateEmail = useCallback(
    (value: string | null | undefined): string | null => {
      if (!value) return null; // Allow empty
      const trimmedValue = value.trim();
      if (!trimmedValue) return null;
      return validator.isEmail(trimmedValue) ? null : strings?.emailInvalid || "Invalid email";
    },
    [strings]
  );

  const validateGender = useCallback(
    (value?: string | null): string | null => {
      if (!value) return null;
      return ["MALE", "FEMALE", "OTHER"].includes(value.toUpperCase())
        ? null
        : strings?.genderInvalid || "Invalid gender";
    },
    [strings]
  );

  const validateNationality = useCallback(
    (value: string): string | null | undefined => {
      return isValidCountryCode(value) ? null : strings?.nationalityInvalid || "Invalid nationality";
    },
    [strings]
  );

  const validateDateOfBirth = useCallback(
    (value: string): string | null | undefined => {
      if (!validator.isDate(value)) return strings?.dateOfBirthInvalid || "Invalid date";
      const date = new Date(value);
      const now = new Date();
      return date <= now ? null : strings?.dateOfBirthFuture || "Date cannot be in the future";
    },
    [strings]
  );

  const validatePhoneNumber = useCallback(
    (value: string): string | null | undefined => {
      return isValidPhoneNumber(value) ? null : strings?.phoneNumberInvalid || "Invalid phone number";
    },
    [strings]
  );

  // Handle cell updates
  const handleUpdateCell = useCallback(
    async (
      rowId: number,
      columnId: string,
      value: unknown
    ): Promise<void> => {
      const input: Graphql.PartialStudentUpdateInput = {
        id: rowId,
      };

      // Type conversion based on column
      switch (columnId) {
        case "dateOfBirth":
          input.dateOfBirth = value ? new Date(value as string).toISOString() : null;
          break;
        case "gender":
          input.gender = value as Graphql.Gender;
          break;
        case "nationality":
          input.nationality = value as Graphql.CountryCode;
          break;
        default:
          input[columnId as keyof Graphql.PartialStudentUpdateInput] = value;
          break;
      }

      await partialUpdateStudent({ input });
    },
    [partialUpdateStudent]
  );

  // Filter state management
  const filterState = useMemo(
    () => ({
      anchorEl: filterAnchorEl,
      activeColumn: activeFilterColumn,
      values: filterValues,
      openFilter: (columnId: string, anchor: HTMLElement) => {
        setActiveFilterColumn(columnId);
        setFilterAnchorEl(anchor);
      },
      closeFilter: () => {
        setActiveFilterColumn(null);
        setFilterAnchorEl(null);
      },
    }),
    [filterAnchorEl, activeFilterColumn, filterValues]
  );

  // Handle sort
  const handleSort = useCallback(
    (columnId: string) => {
      const currentDirection = sortState[columnId];
      let newDirection: "ASC" | "DESC" | null = "ASC";

      if (currentDirection === "ASC") {
        newDirection = "DESC";
      } else if (currentDirection === "DESC") {
        newDirection = null;
      }

      setSortState(prev => ({
        ...prev,
        [columnId]: newDirection,
      }));

      // Convert to GraphQL format and call operation
      const orderByClause = newDirection
        ? [{ column: columnId, order: newDirection }]
        : [];
      sortOp(orderByClause);
    },
    [sortState, sortOp]
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (columnId: string, value: unknown) => {
      setFilterValues(prev => {
        if (value === null || value === undefined) {
          const newValues = { ...prev };
          delete newValues[columnId];
          return newValues;
        }
        return { ...prev, [columnId]: value };
      });

      // Call operation to sync with backend
      if (value !== null && value !== undefined) {
        setColumnFilter(
          {
            columnId,
            operation: "contains", // Default operation
            value,
          },
          columnId
        );
      } else {
        setColumnFilter(null, columnId);
      }
    },
    [setColumnFilter]
  );

  // Build columns with all config
  const columns = useMemo(
    () =>
      buildStudentColumns({
        strings: {
          name: strings.name || "Name",
          email: strings.email || "Email",
          dateOfBirth: strings.dateOfBirth || "Date of Birth",
          gender: strings.gender || "Gender",
          nationality: strings.nationality || "Nationality",
          phoneNumber: strings.phoneNumber || "Phone Number",
          createdAt: strings.createdAt || "Created At",
          updatedAt: strings.updatedAt || "Updated At",
        },
        genderOptions: [
          { label: genderStrings.male || "Male", value: "MALE" },
          { label: genderStrings.female || "Female", value: "FEMALE" },
        ],
        filterState,
        sortState,
        onSort: handleSort,
        onFilterChange: handleFilterChange,
        onUpdate: handleUpdateCell,
        validators: {
          validateFullName,
          validateEmail,
          validateDateOfBirth,
          validateGender,
          validateNationality,
          validatePhoneNumber,
        },
      }),
    [
      strings,
      genderStrings,
      filterState,
      sortState,
      handleSort,
      handleFilterChange,
      handleUpdateCell,
      validateFullName,
      validateEmail,
      validateDateOfBirth,
      validateGender,
      validateNationality,
      validatePhoneNumber,
    ]
  );

  return {
    columns,
    filterState,
    sortState,
    validators: {
      validateFullName,
      validateEmail,
      validateDateOfBirth,
      validateGender,
      validateNationality,
      validatePhoneNumber,
    },
  };
};
```

## Key Changes from Old Implementation

### Old Architecture

```typescript
// Columns were built from static definitions + runtime enhancement
const columns = useMemo(
  () =>
    STUDENT_TABLE_COLUMNS.map((column): EditableColumn => {
      if (!column.editable) return column;
      return {
        ...column,
        onUpdate: (rowId, value) =>
          handleUpdateCell(rowId, column.accessor, value),
        getIsValid: getValidatorForColumn(column.accessor),
      };
    }),
  [handleUpdateCell, getValidatorForColumn]
);
```

### New Architecture

```typescript
// Columns are built with full renderer definitions
const columns = useMemo(
  () =>
    buildStudentColumns({
      strings,
      genderOptions,
      filterState,
      sortState,
      onSort: handleSort,
      onFilterChange: handleFilterChange,
      onUpdate: handleUpdateCell,
      validators,
    }),
  [
    /* all dependencies */
  ]
);
```

## Benefits

1. **Centralized Filter State**: Single source of truth for filter UI state
2. **Sort Management**: Local sort state with backend sync
3. **Validation**: All validators accessible for reuse
4. **Type Safety**: Full TypeScript support with generic types
5. **Separation of Concerns**: UI state separate from business logic

## Integration

This hook is used in `StudentTable.tsx`:

```typescript
const StudentTable = () => {
  const { columns } = useStudentTable();
  const { queryParams, filters, onPageChange, ... } = useStudentOperations();

  return (
    <TableProvider data={students} columns={columns} ...>
      <Table />
    </TableProvider>
  );
};
```
