import type React from "react";
import { useTheme } from "@mui/material/styles";
import { TextField, IconButton } from "@mui/material";
import { Check, Clear } from "@mui/icons-material";

type InlineFilterProps = {
    columnId: string;
    columnLabel: string;
    value: string;
    hasActiveFilter: boolean;
    onChange: (columnId: string, value: string) => void;
    onApply: (columnId: string) => void;
    onClear: (columnId: string) => void;
    onKeyDown: (event: React.KeyboardEvent, columnId: string) => void;
};

const InlineFilter: React.FC<InlineFilterProps> = ({
    columnId,
    columnLabel,
    value,
    hasActiveFilter,
    onChange,
    onApply,
    onClear,
    onKeyDown,
}) => {
    const theme = useTheme();

    const filterContainerStyle = {
        position: "absolute" as const,
        left: 0,
        right: 0,
        top: "100%",
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderLeft: `1px solid ${theme.palette.divider}`,
        borderRight: `1px solid ${theme.palette.divider}`,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    };

    return (
        <div style={filterContainerStyle}>
            <TextField
                variant="standard"
                size="small"
                placeholder={`Filter ${columnLabel}...`}
                value={value}
                onChange={(e) => onChange(columnId, e.target.value)}
                onKeyDown={(e) => onKeyDown(e, columnId)}
                fullWidth
                autoFocus
            />

            {hasActiveFilter ? (
                <IconButton
                    size="small"
                    onClick={() => onClear(columnId)}
                    color="error"
                >
                    <Clear fontSize="small" />
                </IconButton>
            ) : (
                <IconButton
                    size="small"
                    onClick={() => onApply(columnId)}
                    disabled={!value}
                    color="primary"
                >
                    <Check fontSize="small" />
                </IconButton>
            )}
        </div>
    );
};

export default InlineFilter;
