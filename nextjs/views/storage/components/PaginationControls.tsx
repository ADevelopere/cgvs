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
import useAppTranslation from "@/locale/useAppTranslation";

export interface PaginationControlsProps {
    pagination: {
        totalCount: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    } | null;
    currentLimit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    pagination,
    currentLimit,
    onPageChange,
    onLimitChange,
}) => {
    const translations = useAppTranslation("storageTranslations");

    if (!pagination) {
        return null;
    }

    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
    const totalPages = Math.ceil(pagination.totalCount / pagination.limit);

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        page: number,
    ) => {
        onPageChange(page);
    };

    const handleLimitChange = (event: SelectChangeEvent<number>) => {
        const newLimit = event.target.value;
        onLimitChange(newLimit);
    };

    const startItem = pagination.offset + 1;
    const endItem = Math.min(
        pagination.offset + pagination.limit,
        pagination.totalCount,
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
                {translations.showingItems
                    .replace("{startItem}", String(startItem))
                    .replace("{endItem}", String(endItem))
                    .replace("{totalCount}", String(pagination.totalCount))}
            </Typography>

            {/* Pagination and Page Size Controls */}
            <Stack direction="row" alignItems="center" spacing={2}>
                {/* Page Size Selector */}
                <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel id="page-size-label">
                        {translations.perPage}
                    </InputLabel>
                    <Select
                        labelId="page-size-label"
                        value={currentLimit}
                        onChange={handleLimitChange}
                        label={translations.perPage}
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
