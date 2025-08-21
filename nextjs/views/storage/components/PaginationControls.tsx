"use client";

import React from "react";
import {
    Box,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Stack,
    SelectChangeEvent,
} from "@mui/material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";

const PaginationControls: React.FC = () => {
    const { pagination, params, setPage, setLimit } = useStorageManagement();

    if (!pagination) {
        return null;
    }

    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
    const totalPages = Math.ceil(pagination.totalCount / pagination.limit);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPage(page);
    };

    const handleLimitChange = (event: SelectChangeEvent<number>) => {
        const newLimit = event.target.value as number;
        setLimit(newLimit);
    };

    const startItem = pagination.offset + 1;
    const endItem = Math.min(
        pagination.offset + pagination.limit,
        pagination.totalCount
    );

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderTop: 1,
                borderColor: "divider",
                backgroundColor: "background.paper",
                flexWrap: "wrap",
                gap: 2,
            }}
        >
            {/* Items info */}
            <Typography variant="body2" color="text.secondary">
                Showing {startItem}-{endItem} of {pagination.totalCount} items
            </Typography>

            {/* Pagination and Page Size Controls */}
            <Stack direction="row" alignItems="center" spacing={2}>
                {/* Page Size Selector */}
                <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel id="page-size-label">Per page</InputLabel>
                    <Select
                        labelId="page-size-label"
                        value={params.limit}
                        onChange={handleLimitChange}
                        label="Per page"
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </FormControl>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="small"
                        showFirstButton
                        showLastButton
                        siblingCount={1}
                        boundaryCount={1}
                    />
                )}
            </Stack>
        </Box>
    );
};

export default PaginationControls;
