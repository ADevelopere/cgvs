# Student Column Definitions - New Renderer API

**File:** `client/views/student/columns.tsx` (new file)

This file contains the complete column definitions for the student table using the new renderer-based architecture.

```typescript
import React, { useCallback } from "react";
import type * as Graphql from "@/client/graphql/generated/gql/graphql";
import { AnyColumn } from "@/client/components/Table/table.type";
import { BaseHeaderRenderer } from "@/client/components/Table/renderers/headers/BaseHeaderRenderer";
import { TextFilterPopover } from "@/client/components/Table/renderers/filters/TextFilterPopover";
import { DateFilterPopover } from "@/client/components/Table/renderers/filters/DateFilterPopover";
import { SelectFilterPopover } from "@/client/components/Table/renderers/filters/SelectFilterPopover";
import { TextViewRenderer } from "@/client/components/Table/renderers/view/TextViewRenderer";
import { DateViewRenderer } from "@/client/components/Table/renderers/view/DateViewRenderer";
import { SelectViewRenderer } from "@/client/components/Table/renderers/view/SelectViewRenderer";
import { CountryViewRenderer } from "@/client/components/Table/renderers/view/CountryViewRenderer";
import { PhoneViewRenderer } from "@/client/components/Table/renderers/view/PhoneViewRenderer";
import { TextEditRenderer } from "@/client/components/Table/renderers/edit/TextEditRenderer";
import { DateEditRenderer } from "@/client/components/Table/renderers/edit/DateEditRenderer";
import { SelectEditRenderer } from "@/client/components/Table/renderers/edit/SelectEditRenderer";
import { CountryEditRenderer } from "@/client/components/Table/renderers/edit/CountryEditRenderer";
import { PhoneEditRenderer } from "@/client/components/Table/renderers/edit/PhoneEditRenderer";

export type StudentColumnConfig = {
  strings: {
    name: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
  };
  genderOptions: Array<{ label: string; value: string }>;
  filterState: {
    anchorEl: HTMLElement | null;
    activeColumn: string | null;
    values: Record<string, unknown>;
    openFilter: (columnId: string, anchor: HTMLElement) => void;
    closeFilter: () => void;
  };
  sortState: Record<string, "ASC" | "DESC" | null>;
  onSort: (columnId: string) => void;
  onFilterChange: (columnId: string, value: unknown) => void;
  onUpdate: (rowId: number, columnId: string, value: unknown) => Promise<void>;
  validators: {
    validateFullName: (value: string) => string | null;
    validateEmail: (value: string | null | undefined) => string | null;
    validateDateOfBirth: (value: string) => string | null | undefined;
    validateGender: (value?: string | null) => string | null;
    validateNationality: (value: string) => string | null | undefined;
    validatePhoneNumber: (value: string) => string | null | undefined;
  };
};

export const buildStudentColumns = (
  config: StudentColumnConfig
): AnyColumn<Graphql.Student>[] => {
  const {
    strings,
    genderOptions,
    filterState,
    sortState,
    onSort,
    onFilterChange,
    onUpdate,
    validators,
  } = config;

  return [
    // Name Column
    {
      id: "name",
      type: "editable",
      resizable: true,
      initialWidth: 300,
      minWidth: 150,
      widthStorageKey: "student_table_student_name_column_width",
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer
          column={column}
          label={strings.name}
          onSort={() => onSort(column.id)}
          sortDirection={sortState[column.id]}
          onFilter={(e) => filterState.openFilter(column.id, e.currentTarget)}
          isFiltered={!!filterState.values[column.id]}
          filterPopoverRenderer={() => (
            <TextFilterPopover
              anchorEl={filterState.anchorEl}
              open={filterState.activeColumn === column.id}
              onClose={() => filterState.closeFilter()}
              value={filterState.values[column.id]}
              onChange={(value) => onFilterChange(column.id, value)}
            />
          )}
        />
      ),
      viewRenderer: ({ row }) => <TextViewRenderer value={row.name} />,
      editRenderer: ({ row, onSave, onCancel }) => (
        <TextEditRenderer
          value={row.name}
          onSave={onSave}
          onCancel={onCancel}
          validator={validators.validateFullName}
        />
      ),
      onUpdate: (rowId, value) => onUpdate(rowId, "name", value),
    },

    // Email Column
    {
      id: "email",
      type: "editable",
      resizable: true,
      initialWidth: 250,
      minWidth: 150,
      widthStorageKey: "student_table_student_email_column_width",
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer
          column={column}
          label={strings.email}
          onSort={() => onSort(column.id)}
          sortDirection={sortState[column.id]}
          onFilter={(e) => filterState.openFilter(column.id, e.currentTarget)}
          isFiltered={!!filterState.values[column.id]}
          filterPopoverRenderer={() => (
            <TextFilterPopover
              anchorEl={filterState.anchorEl}
              open={filterState.activeColumn === column.id}
              onClose={() => filterState.closeFilter()}
              value={filterState.values[column.id]}
              onChange={(value) => onFilterChange(column.id, value)}
            />
          )}
        />
      ),
      viewRenderer: ({ row }) => <TextViewRenderer value={row.email} />,
      editRenderer: ({ row, onSave, onCancel }) => (
        <TextEditRenderer
          value={row.email}
          onSave={onSave}
          onCancel={onCancel}
          validator={validators.validateEmail}
          type="email"
        />
      ),
      onUpdate: (rowId, value) => onUpdate(rowId, "email", value),
    },

    // Date of Birth Column
    {
      id: "dateOfBirth",
      type: "editable",
      resizable: true,
      initialWidth: 200,
      minWidth: 150,
      widthStorageKey: "student_table_student_dateOfBirth_column_width",
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer
          column={column}
          label={strings.dateOfBirth}
          onSort={() => onSort(column.id)}
          sortDirection={sortState[column.id]}
          onFilter={(e) => filterState.openFilter(column.id, e.currentTarget)}
          isFiltered={!!filterState.values[column.id]}
          filterPopoverRenderer={() => (
            <DateFilterPopover
              anchorEl={filterState.anchorEl}
              open={filterState.activeColumn === column.id}
              onClose={() => filterState.closeFilter()}
              value={filterState.values[column.id]}
              onChange={(value) => onFilterChange(column.id, value)}
            />
          )}
        />
      ),
      viewRenderer: ({ row }) => (
        <DateViewRenderer value={row.dateOfBirth} />
      ),
      editRenderer: ({ row, onSave, onCancel }) => (
        <DateEditRenderer
          value={row.dateOfBirth}
          onSave={onSave}
          onCancel={onCancel}
          validator={validators.validateDateOfBirth}
        />
      ),
      onUpdate: (rowId, value) => onUpdate(rowId, "dateOfBirth", value),
    },

    // Gender Column
    {
      id: "gender",
      type: "editable",
      resizable: true,
      initialWidth: 150,
      minWidth: 100,
      widthStorageKey: "student_table_student_gender_column_width",
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer
          column={column}
          label={strings.gender}
          onSort={() => onSort(column.id)}
          sortDirection={sortState[column.id]}
          onFilter={(e) => filterState.openFilter(column.id, e.currentTarget)}
          isFiltered={!!filterState.values[column.id]}
          filterPopoverRenderer={() => (
            <SelectFilterPopover
              anchorEl={filterState.anchorEl}
              open={filterState.activeColumn === column.id}
              onClose={() => filterState.closeFilter()}
              options={genderOptions}
              value={filterState.values[column.id]}
              onChange={(value) => onFilterChange(column.id, value)}
            />
          )}
        />
      ),
      viewRenderer: ({ row }) => (
        <SelectViewRenderer value={row.gender} options={genderOptions} />
      ),
      editRenderer: ({ row, onSave, onCancel }) => (
        <SelectEditRenderer
          value={row.gender}
          options={genderOptions}
          onSave={onSave}
          onCancel={onCancel}
          validator={validators.validateGender}
        />
      ),
      onUpdate: (rowId, value) => onUpdate(rowId, "gender", value),
    },

    // Nationality Column
    {
      id: "nationality",
      type: "editable",
      resizable: true,
      initialWidth: 200,
      minWidth: 150,
      widthStorageKey: "student_table_student_nationality_column_width",
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer
          column={column}
          label={strings.nationality}
          onSort={() => onSort(column.id)}
          sortDirection={sortState[column.id]}
          onFilter={(e) => filterState.openFilter(column.id, e.currentTarget)}
          isFiltered={!!filterState.values[column.id]}
          filterPopoverRenderer={() => (
            <TextFilterPopover
              anchorEl={filterState.anchorEl}
              open={filterState.activeColumn === column.id}
              onClose={() => filterState.closeFilter()}
              value={filterState.values[column.id]}
              onChange={(value) => onFilterChange(column.id, value)}
            />
          )}
        />
      ),
      viewRenderer: ({ row }) => (
        <CountryViewRenderer value={row.nationality} />
      ),
      editRenderer: ({ row, onSave, onCancel }) => (
        <CountryEditRenderer
          value={row.nationality}
          onSave={onSave}
          onCancel={onCancel}
          validator={validators.validateNationality}
        />
      ),
      onUpdate: (rowId, value) => onUpdate(rowId, "nationality", value),
    },

    // Phone Number Column
    {
      id: "phoneNumber",
      type: "editable",
      resizable: true,
      initialWidth: 200,
      minWidth: 150,
      widthStorageKey: "student_table_student_phoneNumber_column_width",
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer
          column={column}
          label={strings.phoneNumber}
          onFilter={(e) => filterState.openFilter(column.id, e.currentTarget)}
          isFiltered={!!filterState.values[column.id]}
          filterPopoverRenderer={() => (
            <TextFilterPopover
              anchorEl={filterState.anchorEl}
              open={filterState.activeColumn === column.id}
              onClose={() => filterState.closeFilter()}
              value={filterState.values[column.id]}
              onChange={(value) => onFilterChange(column.id, value)}
            />
          )}
        />
      ),
      viewRenderer: ({ row }) => (
        <PhoneViewRenderer value={row.phoneNumber} />
      ),
      editRenderer: ({ row, onSave, onCancel }) => (
        <PhoneEditRenderer
          value={row.phoneNumber}
          onSave={onSave}
          onCancel={onCancel}
          validator={validators.validatePhoneNumber}
        />
      ),
      onUpdate: (rowId, value) => onUpdate(rowId, "phoneNumber", value),
    },

    // Created At Column (View-Only)
    {
      id: "createdAt",
      type: "viewonly",
      resizable: true,
      initialWidth: 180,
      minWidth: 150,
      widthStorageKey: "student_table_student_createdAt_column_width",
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer
          column={column}
          label={strings.createdAt}
          onSort={() => onSort(column.id)}
          sortDirection={sortState[column.id]}
          onFilter={(e) => filterState.openFilter(column.id, e.currentTarget)}
          isFiltered={!!filterState.values[column.id]}
          filterPopoverRenderer={() => (
            <DateFilterPopover
              anchorEl={filterState.anchorEl}
              open={filterState.activeColumn === column.id}
              onClose={() => filterState.closeFilter()}
              value={filterState.values[column.id]}
              onChange={(value) => onFilterChange(column.id, value)}
            />
          )}
        />
      ),
      viewRenderer: ({ row }) => <DateViewRenderer value={row.createdAt} />,
    },

    // Updated At Column (View-Only)
    {
      id: "updatedAt",
      type: "viewonly",
      resizable: true,
      initialWidth: 180,
      minWidth: 150,
      widthStorageKey: "student_table_student_updatedAt_column_width",
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer
          column={column}
          label={strings.updatedAt}
          onSort={() => onSort(column.id)}
          sortDirection={sortState[column.id]}
          onFilter={(e) => filterState.openFilter(column.id, e.currentTarget)}
          isFiltered={!!filterState.values[column.id]}
          filterPopoverRenderer={() => (
            <DateFilterPopover
              anchorEl={filterState.anchorEl}
              open={filterState.activeColumn === column.id}
              onClose={() => filterState.closeFilter()}
              value={filterState.values[column.id]}
              onChange={(value) => onFilterChange(column.id, value)}
            />
          )}
        />
      ),
      viewRenderer: ({ row }) => <DateViewRenderer value={row.updatedAt} />,
    },
  ];
};
```

## Key Features

1. **Type Safety**: Uses `AnyColumn<Graphql.Student>[]` for full type checking
2. **Complete Rendering Control**: Each column defines its own header, view, and edit renderers
3. **Consistent Filtering**: All columns use standardized filter popovers
4. **Validation**: Edit renderers receive validator functions
5. **Accessibility**: All components support keyboard navigation and screen readers
6. **Responsive**: Column widths adapt and persist to localStorage
7. **Sortable**: Columns integrate with sort state management
8. **Filterable**: Columns integrate with filter state management

## Usage

```typescript
import { buildStudentColumns } from "./columns";
import { useStudentTable } from "./useStudentTable";

const { filterState, sortState, validators, ...operations } = useStudentTable();

const columns = buildStudentColumns({
  strings: strings.studentTranslations,
  genderOptions: [
    { label: genderStrings.male, value: "MALE" },
    { label: genderStrings.female, value: "FEMALE" },
  ],
  filterState,
  sortState,
  onSort: operations.updateSort,
  onFilterChange: operations.setColumnFilter,
  onUpdate: operations.handleUpdateCell,
  validators,
});
```
