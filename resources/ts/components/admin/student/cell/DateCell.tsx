"use client";

import type React from "react";
import { TextField, Box } from "@mui/material";
import { format } from "date-fns";
import { CellProps } from "../types";

const DateCell: React.FC<CellProps> = ({
    value,
    onEdit,
    onSave,
    isEditing,
    editable,
}) => {
    if (isEditing) {
        return (
            <TextField
                type="date"
                variant="standard"
                value={value}
                onChange={(e) => onEdit(e.target.value)}
                onBlur={onSave}
                autoFocus
                fullWidth
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
            {value && format(new Date(value), "yyyy-MM-dd")}
        </Box>
    );
};

export default DateCell;
