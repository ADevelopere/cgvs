import type React from "react";
import { Stack, Typography } from "@mui/material";
import { People } from "@mui/icons-material";
import useAppTranslation from "@/locale/useAppTranslation";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";
import { useEffect } from "react";
import { TableProvider } from "@/components/Table/Table/TableContext";
import { STUDENT_TABLE_COLUMNS } from "./constants";
import Table from "@/components/Table/Table/Table";
import { useStudentFilter } from "@/contexts/student/StudentFilterContext";
import { FilterClause } from "@/types/filters";

const StudentManagementDashboardTitle: React.FC = () => {
    const strings = useAppTranslation("studentTranslations");
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%", paddingInlineStart: 1 }}
            gap={1}
        >
            <People color="primary" />
            <Typography variant="h6" component="div">
                {strings?.studentManagement}
            </Typography>
        </Stack>
    );
};

const StudentTableNew: React.FC = () => {
    const { students, paginatorInfo } = useStudentManagement();
    const { applySingleFilter } = useStudentFilter();

    const { setDashboardSlot } = useDashboardLayout();
    useEffect(() => {
        setDashboardSlot("titleRenderer", <StudentManagementDashboardTitle />);

        return () => {
            setDashboardSlot("titleRenderer", null);
        };
    }, [setDashboardSlot]);

    return (
        <TableProvider
            data={students}
            // isLoading={isLoading}
            columns={STUDENT_TABLE_COLUMNS}
            dataProps={{
                onFilter: applySingleFilter as (
                    filterClause: FilterClause<any, any> | null,
                    columnId: string,
                ) => void,
                // sortBy: { sortBy },
                // sortDirection: sortDirection,
                // filters: { filters },
                // serverOperationMode: serverOperationMode,
                // onServerSortChange: handleServerSortChange,
                // onServerFiltersChange: handleServerFiltersChange,
            }}
            columnProps={{}}
            rowsProps={
                {
                    // rowIdKey: rowIdKey,
                    // onLoadMoreRows: loadMoreRows,
                    // getRowStyle: getRowStyle,
                    // rowSelectionEnabled: enableRowSelection,
                    // selectedRowIds={selectedRowIds}
                    // totalRows: filteredTotalRows,
                    // pageSize: 50,
                }
            }
            // Server operation props
            // serverFilterUi={serverFilterUi}
            // Selection props
            // onSelectionChange={handleSelectionChange}
            // Pagination props
            paginatorInfo={paginatorInfo}
            // onPageChange={handlePageChange}
            // onRowsPerPageChange={handleRowsPerPageChange}
            // rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            // initialPageSize={100}
        >
            <Table />
        </TableProvider>
    );
};

export default StudentTableNew;
