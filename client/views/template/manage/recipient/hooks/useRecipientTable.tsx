"use client";

import React, { useCallback, useMemo } from "react";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Table from "@/client/components/Table";
import { FilterClause } from "@/client/types/filters";
import { mapColumnIdToGraphQLColumn } from "../columns";

// Column type definitions
type NameColumn = Table.Column<Graphql.Student>;
type EmailColumn = Table.Column<Graphql.Student>;
type DateOfBirthColumn = Table.Column<Graphql.Student>;
type GenderColumn = Table.Column<Graphql.Student>;
type NationalityColumn = Table.Column<Graphql.Student>;
type CreatedAtColumn = Table.Column<Graphql.Student>;

interface UseRecipientTableParams {
  filters: Record<string, FilterClause | null>;
  queryParams: {
    orderBy?:
      | Graphql.StudentsOrderByClause[]
      | Graphql.StudentsOrderByClause
      | null;
  };
  setColumnFilter: (
    filterClause: FilterClause | null,
    columnId: string
  ) => void;
  clearFilter: (columnId: string) => void;
  updateSort: (
    orderByClause: {
      column: string;
      order: Graphql.OrderSortDirection | null;
    }[]
  ) => void;
}

/**
 * Table-specific logic for recipient management
 * Builds columns with renderer-based API
 */
export const useRecipientTable = ({
  filters,
  queryParams,
  setColumnFilter,
  clearFilter,
  updateSort,
}: UseRecipientTableParams) => {
  const strings = useAppTranslation("recipientTranslations");
  const genderStrings = useAppTranslation("genderTranslations");

  // Build gender options
  const genderOptions = useMemo(
    () => [
      { label: genderStrings.male, value: "MALE" },
      { label: genderStrings.female, value: "FEMALE" },
    ],
    [genderStrings]
  );

  /**
   * Helper component for text filterable headers
   */
  const TextFilterHeader = useCallback(
    ({
      label,
      columnId,
      sortable = true,
    }: {
      label: string;
      columnId: string;
      sortable?: boolean;
    }) => {
      // Get current filter from filters
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
          onSort={direction => {
            updateSort([{ column: columnId, order: direction }]);
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
              onClear={() => clearFilter(columnId as string)}
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
    ({ label, columnId }: { label: string; columnId: string }) => {
      // Get current filter from filters
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
          onSort={direction => {
            updateSort([{ column: columnId, order: direction }]);
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
              onClear={() => clearFilter(columnId as string)}
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
      type: "viewonly" as const,
      label: strings.name,
      resizable: false,
      initialWidth: 200,
      headerRenderer: () => (
        <TextFilterHeader label={strings.name} columnId="name" />
      ),
      viewRenderer: ({ row }) => <Table.TextViewRenderer value={row.name} />,
    };

    const nationalityColumn: NationalityColumn = {
      id: "nationality" as const,
      type: "viewonly" as const,
      label: strings.nationality,
      resizable: false,
      initialWidth: 150,
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
            onSort={direction => {
              updateSort([{ column: "nationality", order: direction }]);
            }}
            sortDirection={sortDirection}
          />
        );
      },
      viewRenderer: ({ row }) => (
        <Table.CountryViewRenderer value={row.nationality} />
      ),
    };

    const dateOfBirthColumn: DateOfBirthColumn = {
      id: "dateOfBirth" as const,
      type: "viewonly" as const,
      label: strings.dateOfBirth,
      resizable: false,
      initialWidth: 150,
      headerRenderer: () => (
        <DateFilterHeader label={strings.dateOfBirth} columnId="dateOfBirth" />
      ),
      viewRenderer: ({ row }) => (
        <Table.DateViewRenderer value={row.dateOfBirth} format="PPP" />
      ),
    };

    const genderColumn: GenderColumn = {
      id: "gender" as const,
      type: "viewonly" as const,
      label: strings.gender,
      resizable: false,
      initialWidth: 100,
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
            onSort={direction => {
              updateSort([{ column: "gender", order: direction }]);
            }}
            sortDirection={sortDirection}
          />
        );
      },
      viewRenderer: ({ row }) => (
        <Table.SelectViewRenderer value={row.gender} options={genderOptions} />
      ),
    };

    const emailColumn: EmailColumn = {
      id: "email" as const,
      type: "viewonly" as const,
      label: strings.email,
      resizable: false,
      initialWidth: 200,
      headerRenderer: () => (
        <TextFilterHeader label={strings.email} columnId="email" />
      ),
      viewRenderer: ({ row }) => <Table.TextViewRenderer value={row.email} />,
    };

    const createdAtColumn: CreatedAtColumn = {
      id: "createdAt" as const,
      type: "viewonly" as const,
      label: strings.createdAt,
      resizable: false,
      initialWidth: 150,
      headerRenderer: () => (
        <DateFilterHeader label={strings.createdAt} columnId="createdAt" />
      ),
      viewRenderer: ({ row }) => (
        <Table.DateViewRenderer value={row.createdAt} format="PPP" />
      ),
    };

    return [
      nameColumn,
      nationalityColumn,
      dateOfBirthColumn,
      genderColumn,
      emailColumn,
      createdAtColumn,
    ] as const;
  }, [
    strings,
    genderOptions,
    TextFilterHeader,
    DateFilterHeader,
    queryParams,
    updateSort,
  ]);

  return {
    columns,
  };
};
