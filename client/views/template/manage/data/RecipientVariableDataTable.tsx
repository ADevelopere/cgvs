"use client";

import React, { useCallback, useMemo } from "react";
import { Box, Alert } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { Table, type AnyColumn } from "@/client/components/Table";
import { ROWS_PER_PAGE_OPTIONS } from "@/client/components/Table/constants";
import { useRecipientVariableDataOperations } from "./hooks/useRecipientVariableDataOperations";
import { useRecipientVariableDataStore } from "./stores/useRecipientVariableDataStore";
import { useVariableDataTable, VariableDataRow } from "./hooks/useVariableDataTable";
import * as Document from "./hooks/recipientVariableData.documents";
import { useAppTranslation } from "@/client/locale";
import { TemplateVariable } from "@/client/graphql/generated/gql/graphql";

interface RecipientVariableDataTableProps {
  selectedGroupId: number;
  variables: TemplateVariable[];
}

const RecipientVariableDataTable: React.FC<RecipientVariableDataTableProps> = ({ selectedGroupId, variables }) => {
  const operations = useRecipientVariableDataOperations();
  const store = useRecipientVariableDataStore();
  const { recipientVariableDataTranslations: strings } = useAppTranslation();

  // Fetch recipient variable data
  const { data, loading, error } = useQuery(Document.recipientVariableValuesByGroupQueryDocument, {
    variables: {
      recipientGroupId: selectedGroupId,
      limit: store.queryParams.limit,
      offset: store.queryParams.offset,
    },
    skip: !selectedGroupId,
    fetchPolicy: "cache-first",
  });

  const { recipientsVarValues, total } = useMemo(() => {
    return {
      recipientsVarValues: data?.recipientVariableValuesByGroup?.data || [],
      total: data?.recipientVariableValuesByGroup?.total || 0,
    };
  }, [data]);

  // Calculate page info for pagination
  const pageInfo = useMemo(() => {
    const currentPage = Math.floor(store.queryParams.offset / store.queryParams.limit) + 1;
    const totalPages = Math.ceil(total / store.queryParams.limit);

    return {
      currentPage,
      totalPages,
      total,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [store.queryParams.offset, store.queryParams.limit, total]);

  // Handle cell updates
  const handleUpdateCell = useCallback(
    async <T = unknown,>(rowId: number, columnId: string, value: T | null | undefined) => {
      // Extract variable ID from column ID (format: var_${variableId})
      if (columnId.startsWith("var_")) {
        const variableId = parseInt(columnId.replace("var_", ""), 10);
        await operations.updateRecipientVariableValue(rowId, variableId, value);
      }
    },
    [operations]
  );

  // Build dynamic columns using hook
  const { columns } = useVariableDataTable({
    variables,
    onUpdateCell: handleUpdateCell,
    strings,
  });

  // Transform data for table - flatten variableValues for performance
  const tableData = useMemo(() => {
    return recipientsVarValues.map(recipient => {
      const flattenedVars = Object.entries(recipient.variableValues || {}).reduce(
        (acc, [key, value]) => {
          acc[`var_${key}`] = value;
          return acc;
        },
        {} as Record<string, unknown>
      );

      return {
        id: recipient.recipientGroupItemId || 0,
        studentName: recipient.studentName || "",
        ...flattenedVars,
        _fullData: recipient,
      };
    });
  }, [recipientsVarValues]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      operations.onPageChange(newPage);
    },
    [operations]
  );

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      operations.onRowsPerPageChange(newRowsPerPage);
    },
    [operations]
  );

  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {strings.errorFetchingData}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 300px)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Table<VariableDataRow, number>
          data={tableData}
          isLoading={loading}
          columns={columns as readonly AnyColumn<VariableDataRow, number>[]}
          getRowId={(row: { id: number }) => row.id}
          pageInfo={{
            currentPage: pageInfo.currentPage,
            total: pageInfo.total,
            count: pageInfo.total,
            hasMorePages: pageInfo.hasNextPage,
            lastPage: pageInfo.totalPages,
            perPage: store.queryParams.limit,
          }}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          initialWidths={{}}
          enableRowResizing={false}
          style={{
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        />
      </Box>
    </Box>
  );
};

export default RecipientVariableDataTable;
