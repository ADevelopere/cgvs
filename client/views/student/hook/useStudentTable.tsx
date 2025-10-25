"use client";

import React, { useCallback, useMemo } from "react";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Table from "@/client/components/Table";
import * as Validators from "@/client/views/student/validators";
import { useStudentOperations } from "./useStudentOperations";

// Helper function to map column IDs to GraphQL column names
const mapColumnIdToGraphQLColumn = (columnId: string): string | null => {
  const columnMap: Record<string, string> = {
    name: "NAME",
    email: "EMAIL",
    dateOfBirth: "DATE_OF_BIRTH",
    gender: "GENDER",
    nationality: "NATIONALITY",
    createdAt: "CREATED_AT",
    updatedAt: "UPDATED_AT",
  };
  return columnMap[columnId] || null;
};

// Column type definitions
type NameColumn = Table.EditableColumn<Graphql.Student, string, number>;
type EmailColumn = Table.EditableColumn<
  Graphql.Student,
  string | null | undefined,
  number
>;
type DateOfBirthColumn = Table.EditableColumn<
  Graphql.Student,
  Date | string | null | undefined,
  number
>;
type GenderColumn = Table.EditableColumn<
  Graphql.Student,
  Graphql.Gender | null | undefined,
  number
>;
type NationalityColumn = Table.EditableColumn<
  Graphql.Student,
  Graphql.CountryCode | null | undefined,
  number
>;
type PhoneNumberColumn = Table.EditableColumn<
  Graphql.Student,
  string | null | undefined,
  number
>;
type CreatedAtColumn = Table.Column<Graphql.Student>;
type UpdatedAtColumn = Table.Column<Graphql.Student>;

/**
 * Table-specific logic for student management
 * Builds columns with renderer-based API
 */
export const useStudentTable = () => {
  const {
    partialUpdateStudent,
    updateSort,
    setColumnFilter,
    clearFilter,
    filters,
    queryParams,
  } = useStudentOperations();
  const strings = useAppTranslation("studentTranslations");
  const genderStrings = useAppTranslation("genderTranslations");

  // Build gender options
  const genderOptions: {
    label: string;
    value: Graphql.Gender | null | undefined;
  }[] = useMemo(
    () => [
      { label: genderStrings.male, value: "MALE" },
      { label: genderStrings.female, value: "FEMALE" },
    ],
    [genderStrings]
  );

  /**
   * Handle cell updates
   */
  const handleUpdateCell = useCallback(
    async (
      rowId: number,
      columnId: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any
    ): Promise<void> => {
      const input: Graphql.PartialStudentUpdateInput = {
        id: rowId,
      };

      // Type conversion based on column
      switch (columnId) {
        case "dateOfBirth":
          input.dateOfBirth = value ? new Date(value).toISOString() : null;
          break;
        case "gender":
          input.gender = value as Graphql.Gender;
          break;
        case "nationality":
          input.nationality = value as Graphql.CountryCode;
          break;
        default:
          // For all other columns, use the value directly
          input[columnId as keyof Graphql.PartialStudentUpdateInput] = value;
          break;
      }

      await partialUpdateStudent({ input });
    },
    [partialUpdateStudent]
  );

  /**
   * Helper component for text filterable headers
   */
  const TextFilterHeader = useCallback(
    <TColumnId extends string>({
      label,
      columnId,
      sortable = true,
    }: {
      label: string;
      columnId: TColumnId;
      sortable?: boolean;
    }) => {
      // Get current filter from store
      const currentFilter = filters[columnId];

      // Get current sort direction
      const graphqlColumnName = mapColumnIdToGraphQLColumn(columnId);
      const orderByArray = Array.isArray(queryParams.orderBy)
        ? queryParams.orderBy
        : queryParams.orderBy
          ? [queryParams.orderBy]
          : [];
      const sortDirection =
        orderByArray[0]?.column === graphqlColumnName
          ? orderByArray[0].order
          : null;

      return (
        <Table.BaseHeaderRenderer
          label={label}
          sortable={sortable}
          filterable
          onSort={() => {
            const nextDirection = sortDirection === "ASC" ? "DESC" : "ASC";
            updateSort([{ column: columnId, order: nextDirection }]);
          }}
          sortDirection={sortDirection}
          isFiltered={!!currentFilter}
          filterPopoverRenderer={(anchorEl, onClose) => (
            <Table.TextFilterPopover
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={onClose}
              columnId={columnId}
              columnLabel={label}
              value={currentFilter}
              onApply={clause => setColumnFilter(clause, columnId as string)}
              onClear={() => clearFilter(columnId as keyof Graphql.Student)}
            />
          )}
        />
      );
    },
    [filters, queryParams, updateSort, setColumnFilter, clearFilter]
  );

  /**
   * Helper component for date filterable headers
   */
  const DateFilterHeader = useCallback(
    <TColumnId extends string>({
      label,
      columnId,
    }: {
      label: string;
      columnId: TColumnId;
    }) => {
      // Get current filter from store
      const currentFilter = filters[columnId];

      // Get current sort direction
      const graphqlColumnName = mapColumnIdToGraphQLColumn(columnId);
      const orderByArray = Array.isArray(queryParams.orderBy)
        ? queryParams.orderBy
        : queryParams.orderBy
          ? [queryParams.orderBy]
          : [];
      const sortDirection =
        orderByArray[0]?.column === graphqlColumnName
          ? orderByArray[0].order
          : null;

      return (
        <Table.BaseHeaderRenderer
          label={label}
          sortable
          filterable
          onSort={() => {
            const nextDirection = sortDirection === "ASC" ? "DESC" : "ASC";
            updateSort([{ column: columnId, order: nextDirection }]);
          }}
          sortDirection={sortDirection}
          isFiltered={!!currentFilter}
          filterPopoverRenderer={(anchorEl, onClose) => (
            <Table.DateFilterPopover
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={onClose}
              columnId={columnId}
              columnLabel={label}
              value={currentFilter}
              onApply={clause => setColumnFilter(clause, columnId as string)}
              onClear={() => clearFilter(columnId as keyof Graphql.Student)}
            />
          )}
        />
      );
    },
    [filters, queryParams, updateSort, setColumnFilter, clearFilter]
  );

  /**
   * Build columns with renderer-based API
   */
  const columns = useMemo(() => {
    const nameColumn: NameColumn = {
      id: "name" as const,
      type: "editable" as const,
      label: strings.name,
      resizable: true,
      widthStorageKey: "student_table_student_name_column_width",
      headerRenderer: () => (
        <TextFilterHeader label={strings.name} columnId="name" />
      ),
      viewRenderer: ({ row }) => <Table.TextViewRenderer value={row.name} />,
      editRenderer: ({ row, ...props }) => (
        <Table.TextEditRenderer
          value={row.name}
          {...props}
          validator={Validators.validateName}
        />
      ),
      onUpdate: async (rowId, newValue) => {
        await handleUpdateCell(rowId, "name", newValue);
      },
    };

    const emailColumn: EmailColumn = {
      id: "email" as const,
      type: "editable" as const,
      label: strings.email,
      resizable: true,
      widthStorageKey: "student_table_student_email_column_width",
      headerRenderer: () => (
        <TextFilterHeader label={strings.email} columnId="email" />
      ),
      viewRenderer: ({ row }) => <Table.TextViewRenderer value={row.email} />,
      editRenderer: ({ row, ...props }) => (
        <Table.TextEditRenderer
          value={row.email || ""}
          {...props}
          validator={Validators.validateEmail}
        />
      ),
      onUpdate: async (rowId, newValue) => {
        await handleUpdateCell(rowId, "email", newValue);
      },
    };

    const dateOfBirthColumn: DateOfBirthColumn = {
      id: "dateOfBirth" as const,
      type: "editable" as const,
      label: strings.dateOfBirth,
      resizable: true,
      widthStorageKey: "student_table_student_dateOfBirth_column_width",
      headerRenderer: () => (
        <DateFilterHeader label={strings.dateOfBirth} columnId="dateOfBirth" />
      ),
      viewRenderer: ({ row }) => (
        <Table.DateViewRenderer value={row.dateOfBirth} format="PP" />
      ),
      editRenderer: ({ row, ...props }) => (
        <Table.DateEditRenderer
          value={row.dateOfBirth}
          {...props}
          validator={Validators.validateDateOfBirth}
        />
      ),
      onUpdate: async (rowId, newValue) => {
        await handleUpdateCell(rowId, "dateOfBirth", newValue);
      },
    };

    const genderColumn: GenderColumn = {
      id: "gender" as const,
      type: "editable" as const,
      label: strings.gender,
      resizable: true,
      widthStorageKey: "student_table_student_gender_column_width",
      headerRenderer: () => {
        const graphqlColumnName = mapColumnIdToGraphQLColumn("gender");
        const orderByArray = Array.isArray(queryParams.orderBy)
          ? queryParams.orderBy
          : queryParams.orderBy
            ? [queryParams.orderBy]
            : [];
        const sortDirection =
          orderByArray[0]?.column === graphqlColumnName
            ? orderByArray[0].order
            : null;

        return (
          <Table.BaseHeaderRenderer
            label={strings.gender}
            sortable
            filterable={false}
            onSort={() => {
              const nextDirection = sortDirection === "ASC" ? "DESC" : "ASC";
              updateSort([{ column: "gender", order: nextDirection }]);
            }}
            sortDirection={sortDirection}
          />
        );
      },
      viewRenderer: ({ row }) => (
        <Table.SelectViewRenderer value={row.gender} options={genderOptions} />
      ),
      editRenderer: ({ row, ...props }) => (
        <Table.SelectEditRenderer
          value={row.gender}
          options={genderOptions}
          {...props}
        />
      ),
      onUpdate: async (rowId, newValue) => {
        await handleUpdateCell(rowId, "gender", newValue);
      },
    };

    const nationalityColumn: NationalityColumn = {
      id: "nationality" as const,
      type: "editable" as const,
      label: strings.nationality,
      resizable: true,
      widthStorageKey: "student_table_student_nationality_column_width",
      headerRenderer: () => {
        const graphqlColumnName = mapColumnIdToGraphQLColumn("nationality");
        const orderByArray = Array.isArray(queryParams.orderBy)
          ? queryParams.orderBy
          : queryParams.orderBy
            ? [queryParams.orderBy]
            : [];
        const sortDirection =
          orderByArray[0]?.column === graphqlColumnName
            ? orderByArray[0].order
            : null;

        return (
          <Table.BaseHeaderRenderer
            label={strings.nationality}
            sortable
            filterable={false}
            onSort={() => {
              const nextDirection = sortDirection === "ASC" ? "DESC" : "ASC";
              updateSort([{ column: "nationality", order: nextDirection }]);
            }}
            sortDirection={sortDirection}
          />
        );
      },
      viewRenderer: ({ row }) => (
        <Table.CountryViewRenderer value={row.nationality} />
      ),
      editRenderer: ({ row, ...props }) => (
        <Table.CountryEditRenderer
          value={row.nationality}
          {...props}
          validator={Validators.validateNationality}
        />
      ),
      onUpdate: async (rowId, newValue) => {
        await handleUpdateCell(rowId, "nationality", newValue);
      },
    };

    const phoneNumberColumn: PhoneNumberColumn = {
      id: "phoneNumber" as const,
      type: "editable" as const,
      label: strings.phoneNumber,
      resizable: true,
      widthStorageKey: "student_table_student_phoneNumber_column_width",
      headerRenderer: () => (
        <TextFilterHeader
          label={strings.phoneNumber}
          columnId="phoneNumber"
          sortable={false}
        />
      ),
      viewRenderer: ({ row }) => (
        <Table.PhoneViewRenderer value={row.phoneNumber} />
      ),
      editRenderer: ({ row, ...props }) => (
        <Table.PhoneEditRenderer
          value={row.phoneNumber || ""}
          {...props}
          validator={Validators.validatePhoneNumber}
        />
      ),
      onUpdate: async (rowId, newValue) => {
        await handleUpdateCell(rowId, "phoneNumber", newValue);
      },
    };

    const createdAtColumn: CreatedAtColumn = {
      id: "createdAt" as const,
      type: "viewonly" as const,
      label: strings.createdAt,
      resizable: true,
      widthStorageKey: "student_table_student_createdAt_column_width",
      headerRenderer: () => (
        <DateFilterHeader label={strings.createdAt} columnId="createdAt" />
      ),
      viewRenderer: ({ row }) => (
        <Table.DateViewRenderer value={row.createdAt} format="PPp" />
      ),
    };

    const updatedAtColumn: UpdatedAtColumn = {
      id: "updatedAt" as const,
      type: "viewonly" as const,
      label: strings.updatedAt,
      resizable: true,
      widthStorageKey: "student_table_student_updatedAt_column_width",
      headerRenderer: () => (
        <DateFilterHeader label={strings.updatedAt} columnId="updatedAt" />
      ),
      viewRenderer: ({ row }) => (
        <Table.DateViewRenderer value={row.updatedAt} format="PPp" />
      ),
    };

    return [
      nameColumn,
      emailColumn,
      dateOfBirthColumn,
      genderColumn,
      nationalityColumn,
      phoneNumberColumn,
      createdAtColumn,
      updatedAtColumn,
    ] as const;
  }, [
    strings,
    genderOptions,
    handleUpdateCell,
    TextFilterHeader,
    DateFilterHeader,
    queryParams,
    updateSort,
  ]);

  return {
    columns,
  };
};
