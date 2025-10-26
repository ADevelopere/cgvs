import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

export type TableCellEditingState<TValue> = {
  isEditing: boolean;
  tmpValue: TValue;
  errorMessage: string | null;
};

export type TableDataContextType = {
  // Cell Editing
  getEditingState: <TValue>(
    rowId: string | number,
    columnId: string
  ) => TableCellEditingState<TValue> | null;
  setEditingState: <TValue>(
    rowId: string | number,
    columnId: string,
    state: TableCellEditingState<TValue> | null
  ) => void;
};

const TableDataContext = createContext<TableDataContextType | null>(null);

export type TableDataProviderProps = {
  children: React.ReactNode;
};

export const TableDataProvider = ({ children }: TableDataProviderProps) => {
  // Cell editing state management
  const [editingCells, setEditingCells] = useState<
    Record<string, TableCellEditingState<unknown>>
  >({});

  const getEditingState = useCallback(
    (rowId: string | number, columnId: string) => {
      const cellKey = `${rowId}:${columnId}`;
      return editingCells[cellKey] ?? null;
    },
    [editingCells]
  ) as <TValue>(
    rowId: string | number,
    columnId: string
  ) => TableCellEditingState<TValue> | null;

  const setEditingState = useCallback(
    (
      rowId: string | number,
      columnId: string,
      state: TableCellEditingState<unknown> | null
    ) => {
      const cellKey = `${rowId}:${columnId}`;
      setEditingCells(prev => {
        if (state === null) {
          const { [cellKey]: _removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [cellKey]: state };
      });
    },
    []
  ) as <TValue>(
    rowId: string | number,
    columnId: string,
    state: TableCellEditingState<TValue> | null
  ) => void;

  const value: TableDataContextType = useMemo(
    () => ({
      getEditingState,
      setEditingState,
    }),
    [getEditingState, setEditingState]
  );

  return (
    <TableDataContext.Provider value={value}>
      {children}
    </TableDataContext.Provider>
  );
};

export const useTableDataContext = (): TableDataContextType => {
  const context = useContext(TableDataContext);
  if (!context) {
    throw new Error("useTableDataContext must be used within a TableProvider");
  }
  return context;
};

export default TableDataContext;
