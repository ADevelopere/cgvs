"use client";

import type React from "react";
import { Box, MenuItem, Select } from "@mui/material";
import { CellProps } from "../types";

const GenderCell: React.FC<CellProps> = ({
    value,
    onEdit,
    onSave,
    isEditing,
    editable,
}) => {
    if (isEditing) {
        return (
            <Select
                value={value}
                onChange={(e) => onEdit(e.target.value as string)}
                onBlur={onSave}
                variant="standard"
                fullWidth
                autoFocus
            >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
            </Select>
        );
    }

    return (
        <Box
            onClick={() => editable && onEdit(value)}
            sx={{
                cursor: editable ? "text" : "default",
                minHeight: "2rem",
                "&:hover": editable
                    ? { backgroundColor: "rgba(0, 0, 0, 0.04)" }
                    : {},
            }}
        >
            {value}
        </Box>
    );
};


export default GenderCell;