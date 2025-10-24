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

export type TableDataContextType<TColumnId extends string = string> = {
  // Cell Editing
  getEditingState: <TValue>(
    rowId: string | number,
    columnId: TColumnId
  ) => TableCellEditingState<TValue> | null;
  setEditingState: <TValue>(
    rowId: string | number,
    columnId: TColumnId,
    state: TableCellEditingState<TValue> | null
  ) => void;
};

const TableDataContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createContext<TableDataContextType<any> | null>(null);

export type TableDataProviderProps<_TColumnId extends string = string> = {
  children: React.ReactNode;
};

export const TableDataProvider = <TColumnId extends string = string>({
  children,
}: TableDataProviderProps<TColumnId>) => {
  // Cell editing state management
  const [editingCells, setEditingCells] = useState<
    Record<string, TableCellEditingState<unknown>>
  >({});

  const getEditingState = useCallback(
    (
      rowId: string | number,
      columnId: TColumnId
    ) => {
      const cellKey = `${rowId}:${columnId}`;
      return editingCells[cellKey] ?? null;
    },
    [editingCells]
  ) as <TValue>(
    rowId: string | number,
    columnId: TColumnId
  ) => TableCellEditingState<TValue> | null;

  const setEditingState = useCallback(
    (
      rowId: string | number,
      columnId: TColumnId,
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
    columnId: TColumnId,
    state: TableCellEditingState<TValue> | null
  ) => void;

  const value: TableDataContextType<TColumnId> = useMemo(
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

export const useTableDataContext = <
  TColumnId extends string = string,
>(): TableDataContextType<TColumnId> => {
  const context = useContext(TableDataContext);
  if (!context) {
    throw new Error("useTableDataContext must be used within a TableProvider");
  }
  return context;
};

export default TableDataContext;
