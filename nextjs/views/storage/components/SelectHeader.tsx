"use client";

import React from "react";
import {
    Box,
    Checkbox,
    Typography,
    FormControlLabel,
    useTheme,
} from "@mui/material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";

const SelectHeader: React.FC = () => {
    const theme = useTheme();
    const { items, selectedPaths, selectAll, clearSelection } = useStorageManagement();
    const translations = useAppTranslation("storageTranslations");

    const isAllSelected = items.length > 0 && selectedPaths.length === items.length;
    const isIndeterminate = selectedPaths.length > 0 && selectedPaths.length < items.length;

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectAll();
        } else {
            clearSelection();
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                backgroundColor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isAllSelected}
                        indeterminate={isIndeterminate}
                        onChange={handleSelectAllChange}
                        size="small"
                    />
                }
                label={
                    <Typography variant="body2" color="text.secondary">
                        {translations.selectAllItems}
                    </Typography>
                }
            />

            {selectedPaths.length > 0 && (
                <Typography variant="body2" color="primary" fontWeight={500}>
                    {translations.selectedOfTotal
                        .replace("{selected}", String(selectedPaths.length))
                        .replace("{total}", String(items.length))}
                </Typography>
            )}
        </Box>
    );
};

export default SelectHeader;
