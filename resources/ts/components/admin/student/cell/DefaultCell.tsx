"use client";

import type React from "react";
import { TextField, Box } from "@mui/material";
import { CellProps } from "../types";

const DefaultCell: React.FC<CellProps> = ({
    value,
    onEdit,
    onSave,
    isEditing,
    editable,
}) => {
    if (isEditing) {
        return (
            <TextField
                variant="standard"
                value={value}
                onChange={(e) => onEdit(e.target.value)}
                onBlur={onSave}
                autoFocus
                fullWidth
                className="cell-content"
            />
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

export default DefaultCell;
