"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { TableProvider, Table, AnyColumn } from "@/client/components/Table";
import { ROWS_PER_PAGE_OPTIONS } from "@/client/components/Table/constants";
import { useRecipientVariableDataOperations } from "./hooks/useRecipientVariableDataOperations";
import { useRecipientVariableDataStore } from "./stores/useRecipientVariableDataStore";
import { useVariableDataTable, VariableDataRow } from "./hooks/useVariableDataTable";
import * as Document from "./hooks/recipientVariableData.documents";
import { loadFromLocalStorage } from "@/client/utils/localStorage";
import { useAppTranslation } from "@/client/locale";
import { Typography } from "@mui/material";
import { TemplateVariable } from "@/client/graphql/generated/gql/graphql";

interface RecipientVariableDataTableProps {
  selectedGroupId: number;
  variables: TemplateVariable[];
}

const RecipientVariableDataTable: React.FC<RecipientVariableDataTableProps> = ({
  selectedGroupId,
  variables,
}) => {
  const operations = useRecipientVariableDataOperations();
  const store = useRecipientVariableDataStore();
  const strings = useAppTranslation("recipientVariableDataTranslations");

  // Fetch recipient variable data
  const { data, loading, error } = useQuery(
    Document.recipientVariableValuesByGroupQueryDocument,
    {
      variables: {
        recipientGroupId: selectedGroupId,
        limit: store.queryParams.limit,
        offset: store.queryParams.offset,
      },
      skip: !selectedGroupId,
      fetchPolicy: "cache-first",
    }
  );

  const { recipientsVarValues, total } = useMemo(() => {
    return {
      recipientsVarValues: data?.recipientVariableValuesByGroup?.data || [],
      total: data?.recipientVariableValuesByGroup?.total || 0,
    };
  }, [data]);

  // Calculate page info for pagination
  const pageInfo = useMemo(() => {
    const currentPage =
      Math.floor(store.queryParams.offset / store.queryParams.limit) + 1;
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
    async (rowId: number, columnId: string, value: unknown) => {
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

  // Column width initialization
  const [initialWidths, setInitialWidths] = useState<Record<string, number>>(
    {}
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const widthsInitialized = useRef(false);

  useEffect(() => {
    if (
      !tableContainerRef.current ||
      widthsInitialized.current ||
      columns.length === 0
    )
      return;

    const totalWidth = tableContainerRef.current.offsetWidth - 20;

    const newWidths: Record<string, number> = {};

    // First, handle non-resizable columns and load from localStorage
    let totalFixedWidth = 0;
    columns.forEach(column => {
      if (!column.resizable) {
        if (column.initialWidth) {
          newWidths[column.id] = column.initialWidth;
          totalFixedWidth += column.initialWidth;
        } else {
          newWidths[column.id] = 100;
          totalFixedWidth += 100;
        }
      }
    });

    // Then distribute remaining width among resizable columns
    const resizableColumns = columns.filter(
      col => col.resizable && !newWidths[col.id]
    );

    if (resizableColumns.length > 0) {
      const remainingWidth = Math.max(totalWidth - totalFixedWidth, 0);
      const widthPerColumn = Math.floor(
        remainingWidth / resizableColumns.length
      );

      resizableColumns.forEach(column => {
        newWidths[column.id] = Math.max(widthPerColumn, 50);
      });
    }

    // Load saved widths from localStorage
    columns.forEach(column => {
      if (column.widthStorageKey) {
        const savedWidth = loadFromLocalStorage<string>(column.widthStorageKey);
        if (savedWidth) {
          newWidths[column.id] = Math.max(parseInt(savedWidth, 10), 50);
        }
      }
    });

    setInitialWidths(newWidths);
    widthsInitialized.current = true;
  }, [columns, tableContainerRef]);

  // Transform data for table - flatten variableValues for performance
  const tableData = useMemo(() => {
    return recipientsVarValues.map(recipient => {
      const flattenedVars = Object.entries(
        recipient.variableValues || {}
      ).reduce(
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

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {strings.errorFetchingData}
      </Alert>
    );
  }

  // Show no data state
  if (recipientsVarValues.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {strings.noRecipientsFound}
        </Typography>
      </Box>
    );
  }

  return (
    <TableProvider<VariableDataRow, number>
      data={tableData}
      isLoading={loading}
      columns={columns as unknown as readonly AnyColumn<VariableDataRow, number>[]}
      dataProps={{}}
      columnProps={{
        initialWidths,
      }}
      rowsProps={{
        getRowId: (row: { id: number }) => row.id,
        enableRowResizing: false,
      }}
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

export default RecipientVariableDataTable;
