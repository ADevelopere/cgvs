"use client";

import React, { useEffect } from "react";
import { TableProvider } from "@/client/components/Table/Table/TableContext";
import { useTableRowsContext } from "@/client/components/Table/Table/TableRowsContext";
import { useRecipientStore } from "../stores/useRecipientStore";

interface RecipientTableWithSelectionProps {
  children: React.ReactNode;
  tabType: "add" | "manage";
  [key: string]: any; // Allow other props to be passed through
}

// Wrapper component that syncs table selection with store
const RecipientTableWithSelection: React.FC<RecipientTableWithSelectionProps> = ({
  children,
  tabType,
  ...tableProps
}) => {
  const store = useRecipientStore();

  // Get the appropriate selected IDs based on tab type
  const selectedIds = tabType === "add"
    ? store.selectedStudentIdsNotInGroup
    : store.selectedStudentIdsInGroup;

  // Get the appropriate setter based on tab type
  const setSelectedIds = tabType === "add"
    ? store.setSelectedStudentIdsNotInGroup
    : store.setSelectedStudentIdsInGroup;

  return (
    <TableProvider
      {...tableProps}
      rowsProps={{
        ...tableProps.rowsProps,
        selectedRowIds: selectedIds,
        onSelectionChange: setSelectedIds,
      }}
    >
      <SelectionSync tabType={tabType} />
      {children}
    </TableProvider>
  );
};

// Internal component that syncs selection changes from table to store
const SelectionSync: React.FC<{ tabType: "add" | "manage" }> = ({ tabType }) => {
  const { selectedRowIds } = useTableRowsContext();
  const store = useRecipientStore();

  const setSelectedIds = tabType === "add"
    ? store.setSelectedStudentIdsNotInGroup
    : store.setSelectedStudentIdsInGroup;

  // Sync table selection changes to store
  useEffect(() => {
    setSelectedIds(selectedRowIds.map(Number));
  }, [selectedRowIds, setSelectedIds]);

  return null;
};

export default RecipientTableWithSelection;
