import type React from "react";
import { Box, Typography, Pagination, Stack } from "@mui/material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";

export default function StudentTableFooter() {
    const { paginatorInfo, setQueryParams } = useStudentManagement();

    // Handle page change
    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        page: number,
    ) => {
        setQueryParams({ page });
    };

    if (!paginatorInfo) return null;

    return (
        <Box sx={{ p: 2, borderTop: "1px solid rgba(224, 224, 224, 1)" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">
                    Showing {paginatorInfo.firstItem || 0} to{" "}
                    {paginatorInfo.lastItem || 0} of{" "}
                    {paginatorInfo.total} entries
                </Typography>

                <Pagination
                    count={paginatorInfo.lastPage}
                    page={paginatorInfo.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Stack>
        </Box>
    );
}
