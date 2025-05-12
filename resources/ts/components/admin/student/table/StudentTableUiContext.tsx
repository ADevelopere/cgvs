import { OrderByClause, Student } from "@/graphql/generated/types";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";
import { StudentTableColumns } from "./types";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";

type StudentTableUiContextProps = {
    columnsWidthMap: Record<string, number>;
    startResize: (
        columnId: keyof Student | "actions",
        clientX: number,
        cellElementId: string,
    ) => void;
    getColumnWidth: (columnId: keyof Student | "actions") => number;
    handleSort: (columnId: string) => void;
    getSortDirection: (columnId: string) => "asc" | "desc" | null;
};

const StudentTableUiContext = createContext<StudentTableUiContextProps>({
    columnsWidthMap: {},
    startResize: () => {},
    getColumnWidth: () => {
        return 150;
    },
    handleSort: () => {},
    getSortDirection: () => {
        return null;
    },
});

const useStudentTableUiContext = () => {
    const context = useContext(StudentTableUiContext);
    if (!context) {
        throw new Error(
            "useStudentTableUiContext must be used within a StudentTableUiProvider",
        );
    }
    return context;
};

const StudentTableUiProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { isRtl } = useAppTheme();
    const { queryParams, setQueryParams } = useStudentManagement();

    const [columnsWidthMap, setColumnsWidthMap] = useState<
        Record<string, number>
    >(() => {
        return StudentTableColumns.reduce((acc, col) => {
            let width = col.initialWidth;
            if (col.widthStorageKey) {
                const savedWidth = localStorage.getItem(col.widthStorageKey);
                if (savedWidth) {
                    const numericWidth = parseFloat(savedWidth);
                    if (!isNaN(numericWidth)) {
                        width = numericWidth;
                    }
                }
            }
            return { ...acc, [col.id]: width };
        }, {});
    });

    // Resize logic state
    const resizingColumnRef = useRef<{
        columnId: keyof Student | "actions";
        startX: number;
        startWidth: number;
    } | null>(null);

    const updateColumnWidth = useCallback(
        (columnId: keyof Student | "actions", newWidth: number) => {
            setColumnsWidthMap((prevWidthMap) => {
                const newWidthMap = { ...prevWidthMap };
                newWidthMap[columnId] = newWidth;

                const column = StudentTableColumns.find(
                    (col) => col.id === columnId,
                );
                if (column?.widthStorageKey) {
                    localStorage.setItem(
                        column.widthStorageKey,
                        String(newWidth),
                    );
                }

                return newWidthMap;
            });
        },
        [],
    );

    const handleResizeMove = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (!resizingColumnRef.current) return;

            const clientX =
                "touches" in event ? event.touches[0].clientX : event.clientX;
            const { columnId, startX, startWidth } = resizingColumnRef.current;
            const diff = isRtl ? startX - clientX : clientX - startX;
            const newWidth = startWidth + diff;

            updateColumnWidth(columnId, newWidth);
        },
        [isRtl, updateColumnWidth],
    );

    const handleResizeStop = useCallback(() => {
        if (resizingColumnRef.current) {
            const { columnId, startWidth } = resizingColumnRef.current;
            const cellElement = document.getElementById(
                `headerTableCell-${columnId}`,
            );
        }

        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener(
            "touchmove",
            handleResizeMove as EventListener,
        );
        document.removeEventListener("mouseup", handleResizeStop);
        document.removeEventListener(
            "touchend",
            handleResizeStop as EventListener,
        );
        resizingColumnRef.current = null;
    }, [handleResizeMove]);

    const startResize = useCallback(
        (
            columnId: keyof Student | "actions",
            clientX: number,
            cellElementId: string,
        ) => {
            let currentWidthPx: number;

            const cellElement = document.getElementById(cellElementId);
            if (cellElement instanceof HTMLElement) {
                currentWidthPx = cellElement.getBoundingClientRect().width;
            } else {
                currentWidthPx = columnsWidthMap[columnId] || 150;
            }

            resizingColumnRef.current = {
                columnId,
                startX: clientX,
                startWidth: currentWidthPx,
            };

            document.addEventListener("mousemove", handleResizeMove);
            document.addEventListener(
                "touchmove",
                handleResizeMove as EventListener,
            );
            document.addEventListener("mouseup", handleResizeStop);
            document.addEventListener(
                "touchend",
                handleResizeStop as EventListener,
            );
        },
        [handleResizeMove, handleResizeStop],
    );

    const getColumnWidth = useCallback(
        (columnId: keyof Student | "actions") => {
            return columnsWidthMap[columnId] || 150;
        },
        [columnsWidthMap],
    );

    const handleSort = useCallback(
        (columnId: string) => {
            const currentOrderBy: OrderByClause | OrderByClause[] =
                queryParams.orderBy || [];
            // Convert to array if single object
            const orderByArray = Array.isArray(currentOrderBy)
                ? currentOrderBy
                : [currentOrderBy];

            const columnIndex = orderByArray.findIndex(
                (order) => order.column === columnId.toUpperCase(),
            );

            let newOrderBy = [...orderByArray];

            if (columnIndex === -1) {
                // Add new sort
                newOrderBy.push({
                    column: columnId.toUpperCase(),
                    order: "ASC",
                });
            } else if (newOrderBy[columnIndex].order === "ASC") {
                // Change to DESC
                newOrderBy[columnIndex] = {
                    ...newOrderBy[columnIndex],
                    order: "DESC",
                };
            } else {
                // Remove sort
                newOrderBy = newOrderBy.filter(
                    (_, index) => index !== columnIndex,
                );
            }

            setQueryParams({ orderBy: newOrderBy });
        },
        [queryParams, setQueryParams],
    );

    const getSortDirection = useCallback(
        (columnId: string): "asc" | "desc" | null => {
            const currentOrderBy = queryParams.orderBy || [];
            // Convert to array if single object
            const orderByArray = Array.isArray(currentOrderBy)
                ? currentOrderBy
                : [currentOrderBy];

            const column = orderByArray.find(
                (order) => order.column === columnId.toUpperCase(),
            );

            if (!column) return null;
            return column.order.toLowerCase() as "asc" | "desc";
        },
        [queryParams],
    );

    const value = useMemo(
        () => ({
            columnsWidthMap,
            startResize,
            getColumnWidth,
            handleSort,
            getSortDirection,
        }),
        [
            columnsWidthMap,
            startResize,
            getColumnWidth,
            handleSort,
            getSortDirection,
        ],
    );
    return (
        <StudentTableUiContext.Provider value={value}>
            {children}
        </StudentTableUiContext.Provider>
    );
};

export { StudentTableUiProvider, useStudentTableUiContext };
export type { StudentTableUiContextProps };
