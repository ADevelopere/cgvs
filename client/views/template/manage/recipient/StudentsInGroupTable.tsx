"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import Table from "@/client/components/Table/Table/Table";
import RecipientTableWithSelection from "./components/RecipientTableWithSelection";
import { useRecipientStore } from "./stores/useRecipientStore";
import { useRecipientOperations } from "./hooks/useRecipientOperations";
import { studentsInRecipientGroupQueryDocument } from "./hooks/recipient.documents";
import { ROWS_PER_PAGE_OPTIONS } from "@/client/constants/tableConstants";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { FilterClause } from "@/client/types/filters";
import logger from "@/lib/logger";
import { mapColumnIdToGraphQLColumn, recipientBaseColumns } from "./columns";
import {
  RecipientTableFooterEnd,
  RecipientTableFooterStart,
} from "./components/RecipientTableFooter";
import { useAppTranslation } from "@/client/locale";

interface StudentsInGroupTableProps {
  templateId?: number;
}

const StudentsInGroupTable: React.FC<StudentsInGroupTableProps> = ({
  templateId,
}) => {
  const store = useRecipientStore();
  const operations = useRecipientOperations(templateId);
  const { syncFiltersToQueryParamsInGroup } = operations;
  const syncFiltersToQueryParamsRef = useRef(syncFiltersToQueryParamsInGroup);
  const strings = useAppTranslation("recipientTranslations");

  useEffect(() => {
    syncFiltersToQueryParamsRef.current = syncFiltersToQueryParamsInGroup;
  }, [syncFiltersToQueryParamsInGroup]);

  // Get query variables from store
  const { studentsInGroupQueryParams, selectedGroup, filtersInGroup } = store;

  // Fetch students directly with useQuery - Apollo handles refetch automatically
  const { data, loading } = useQuery(studentsInRecipientGroupQueryDocument, {
    variables: {
      ...studentsInGroupQueryParams,
      recipientGroupId: studentsInGroupQueryParams.recipientGroupId,
    },
    skip: !selectedGroup, // Don't query if no group selected
    fetchPolicy: "cache-first",
  });

  const students = data?.studentsInRecipientGroup?.data ?? [];
  const pageInfo = data?.studentsInRecipientGroup?.pageInfo;

  const [activeFilters, setActiveFilters] =
    useState<Record<string, FilterClause | null>>(filtersInGroup);
  const [initialWidths, setInitialWidths] = useState<Record<string, number>>(
    {},
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const widthsInitialized = useRef(false);

  // Initialize column widths as ratios of total available width
  useEffect(() => {
    if (!tableContainerRef.current || widthsInitialized.current) return;

    const newWidths: Record<string, number> = {};

    // Calculate total container width minus scrollbar and margins
    const containerWidth = tableContainerRef.current.offsetWidth - 20;

    // Calculate the sum of all initial width ratios
    const totalRatio = recipientBaseColumns.reduce(
      (sum, col) => sum + (col.initialWidth || 100),
      0,
    );

    // Calculate actual widths based on ratios
    recipientBaseColumns.forEach((column) => {
      const ratio = (column.initialWidth || 100) / totalRatio;
      newWidths[column.id] = Math.floor(containerWidth * ratio);
    });

    setInitialWidths(newWidths);
    widthsInitialized.current = true;
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filterClause: FilterClause | null, columnId: string) => {
      setActiveFilters((prev) => ({
        ...prev,
        [columnId]: filterClause,
      }));
      operations.setColumnFilterInGroup(columnId, filterClause);
    },
    [operations],
  );

  // Convert active filters to StudentFilterArgs
  useEffect(() => {
    if (!selectedGroup) return;
    syncFiltersToQueryParamsRef.current(activeFilters, recipientBaseColumns);
  }, [activeFilters, selectedGroup]);

  // Handle sort changes
  const handleSort = useCallback(
    (
      orderByClause: {
        column: string;
        order: Graphql.OrderSortDirection;
      }[],
    ) => {
      if (!selectedGroup) return;

      const graphqlOrderBy: Graphql.StudentsOrderByClause[] = [];

      orderByClause.forEach((clause) => {
        const graphqlColumn = mapColumnIdToGraphQLColumn(clause.column);
        if (!graphqlColumn) {
          logger.warn(
            `Column ${clause.column} is not sortable in GraphQL schema`,
          );
          return;
        }
        graphqlOrderBy.push({
          column: graphqlColumn,
          order: clause.order,
        });
      });

      operations.setSortInGroup(
        graphqlOrderBy.length > 0 ? graphqlOrderBy : null,
      );
    },
    [selectedGroup, operations],
  );

  return (
    <RecipientTableWithSelection
      tabType="manage"
      data={students}
      isLoading={loading}
      columns={recipientBaseColumns}
      dataProps={{
        onFilterChange: handleFilterChange,
        onSort: handleSort,
        filters: activeFilters,
      }}
      columnProps={{
        initialWidths,
      }}
      rowsProps={{
        enableRowResizing: false,
        rowSelectionEnabled: true,
        rowIdKey: "id",
      }}
      pageInfo={pageInfo}
      onPageChange={operations.onPageChangeInGroup}
      onRowsPerPageChange={operations.onRowsPerPageChangeInGroup}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      footerStartContent={<RecipientTableFooterStart tabType="manage" />}
      footerEndContent={
        <RecipientTableFooterEnd
          templateId={templateId}
          mode="remove"
          onAction={operations.deleteRecipients}
          actionButtonLabel={strings.removeFromGroup}
          confirmDialogTitle={strings.confirmRemoveStudents}
          confirmDialogMessage={strings.confirmRemoveStudentsMessage}
          queryDocument={studentsInRecipientGroupQueryDocument}
          queryVariables={studentsInGroupQueryParams}
        />
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 300px)",
          overflow: "hidden",
        }}
      >
        <Box
          ref={tableContainerRef}
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {widthsInitialized.current &&
            Object.keys(initialWidths).length > 0 && (
              <Table
                style={{
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              />
            )}
        </Box>
      </Box>
    </RecipientTableWithSelection>
  );
};

export default StudentsInGroupTable;
