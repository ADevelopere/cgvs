"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { Table, TableProvider } from "@/client/components/Table";
import { useRecipientStore } from "./stores/useRecipientStore";
import { useRecipientOperations } from "./hooks/useRecipientOperations";
import { recipientsByGroupIdFilteredQueryDocument } from "./hooks/recipient.documents";
import { ROWS_PER_PAGE_OPTIONS } from "@/client/components/Table/constants";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { FilterClause } from "@/client/types/filters";
import logger from "@/client/lib/logger";
import { mapColumnIdToGraphQLColumn, recipientBaseColumns } from "./columns";
import {
  RecipientTableFooterEnd,
  RecipientTableFooterStart,
} from "./components/RecipientTableFooter";
import { useAppTranslation } from "@/client/locale";

interface StudentsInGroupTableProps {
  templateId: number;
  isMobile: boolean;
}

const StudentsInGroupTable: React.FC<StudentsInGroupTableProps> = ({
  templateId,
  isMobile,
}) => {
  const store = useRecipientStore();
  const operations = useRecipientOperations(templateId);
  const strings = useAppTranslation("recipientTranslations");

  // Get query variables from store
  const {
    recipientsByGroupIdFilteredQuery: studentsInGroupQueryParams,
    selectedGroup,
    filtersInGroup,
  } = store;

  // Fetch students directly with useQuery - Apollo handles refetch automatically
  const { data, loading } = useQuery(recipientsByGroupIdFilteredQueryDocument, {
    variables: {
      recipientGroupId: studentsInGroupQueryParams.recipientGroupId,
      paginationArgs: studentsInGroupQueryParams.paginationArgs,
      orderBy: studentsInGroupQueryParams.orderBy,
      filterArgs: studentsInGroupQueryParams.filterArgs,
    },
    skip: !selectedGroup,
    fetchPolicy: "cache-first",
  });

  const recipients = data?.recipientsByGroupIdFiltered?.data ?? [];
  const pageInfo = data?.recipientsByGroupIdFiltered?.pageInfo;

  // Convert GraphQL orderBy to table format
  const initialOrderBy = Array.isArray(studentsInGroupQueryParams.orderBy)
    ? studentsInGroupQueryParams.orderBy
        .filter(order => order.order) // Filter out null/undefined orders
        .map(order => ({
          column: order.column.toLowerCase(), // Convert GraphQL enum to lowercase
          order: order.order as "ASC" | "DESC",
        }))
    : studentsInGroupQueryParams.orderBy?.order
      ? [
          {
            column: studentsInGroupQueryParams.orderBy.column.toLowerCase(),
            order: studentsInGroupQueryParams.orderBy.order as "ASC" | "DESC",
          },
        ]
      : [];

  const [activeFilters, setActiveFilters] =
    useState<Record<string, FilterClause | null>>(filtersInGroup);
  const [initialWidths, setInitialWidths] = useState<Record<string, number>>(
    {}
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
      0
    );

    // Calculate actual widths based on ratios
    recipientBaseColumns.forEach(column => {
      const ratio = (column.initialWidth || 100) / totalRatio;
      newWidths[column.id] = Math.floor(containerWidth * ratio);
    });

    setInitialWidths(newWidths);
    widthsInitialized.current = true;
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filterClause: FilterClause | null, columnId: string) => {
      setActiveFilters(prev => ({
        ...prev,
        [columnId]: filterClause,
      }));
      operations.setColumnFilterInGroup(columnId, filterClause);
    },
    [operations]
  );

  // Handle sort changes
  const handleSort = useCallback(
    (
      orderByClause: {
        column: string;
        order: Graphql.OrderSortDirection;
      }[]
    ) => {
      if (!selectedGroup) return;

      const graphqlOrderBy: Graphql.StudentsOrderByClause[] = [];

      orderByClause.forEach(clause => {
        const graphqlColumn = mapColumnIdToGraphQLColumn(clause.column);
        if (!graphqlColumn) {
          logger.warn(
            `Column ${clause.column} is not sortable in GraphQL schema`
          );
          return;
        }
        graphqlOrderBy.push({
          column: graphqlColumn,
          order: clause.order,
        });
      });

      operations.setSortInGroup(
        graphqlOrderBy.length > 0 ? graphqlOrderBy : null
      );
    },
    [selectedGroup, operations]
  );

  return (
    <TableProvider
      data={recipients.map(r => ({
        // expose student fields at top-level for columns
        ...(r.student || {}),
        // ensure row id is recipient id for selection/mutations
        id: r.id,
        // keep references if needed elsewhere
        recipientId: r.id,
        studentId: r.studentId,
        recipientGroupId: r.recipientGroupId,
      }))}
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
      initialOrderBy={initialOrderBy}
      footerStartContent={
        <RecipientTableFooterStart
          tabType="manage"
          isMobile={isMobile}
          isLoading={loading}
        />
      }
      footerEndContent={
        <RecipientTableFooterEnd
          mode="remove"
          onAction={operations.deleteRecipients}
          actionButtonLabel={strings.removeFromGroup}
          confirmDialogTitle={strings.confirmRemoveStudents}
          confirmDialogMessage={strings.confirmRemoveStudentsMessage}
          isLoading={loading}
          isMobile={isMobile}
        />
      }
      selectedRowIds={store.selectedRecipientIdsInGroup}
      onSelectionChange={selectedIds =>
        store.setSelectedRecipientIdsInGroup(selectedIds.map(Number))
      }
      hideRowsPerPage={isMobile}
      compact={isMobile}
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
    </TableProvider>
  );
};

export default StudentsInGroupTable;
