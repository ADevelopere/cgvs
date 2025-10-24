/**
 * Determine the state of the "select all" checkbox
 */
export const getSelectAllCheckboxState = <TRowData, TRowId extends string | number>(
  data: TRowData[],
  selectedRowIds: TRowId[],
  getRowId: (row: TRowData) => TRowId
): boolean | null => {
  if (!data || data.length === 0 || !selectedRowIds) return false;

  const selectableRowIds = data.map(row => getRowId(row));
  const selectedCount = selectableRowIds.filter(id =>
    selectedRowIds.includes(id)
  ).length;

  if (selectedCount === 0) return false;
  if (selectedCount === selectableRowIds.length) return true;
  return null; // indeterminate state
};
