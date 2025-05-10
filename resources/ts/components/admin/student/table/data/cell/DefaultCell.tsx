"use client";

import type React from "react";
import { TextField, Typography } from "@mui/material";
import { CellProps } from "../../types";

const DefaultCell: React.FC<CellProps> = ({
    value,
    onEdit,
    onSave,
    isEditing,
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
                sx={{
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                    },
                    "& .MuiInputBase-input": {
                        padding: 0,
                        height: "inherit",
                    }
                }}
            />
        );
    }

    return <Typography sx={{ padding: 0 }}>{value}</Typography>;
};

export default DefaultCell;
