import { useMemo } from "react";
import { Box, IconButton, Tooltip, Typography, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyIcon from "@mui/icons-material/Key";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { TemplateVariable } from "@/contexts/template/template.types";
import { useTemplateVariables } from "@/contexts/template/TemplateVariablesContext";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";

interface VariableListProps {
    variables: TemplateVariable[];
    onEdit: (variable: TemplateVariable) => void;
    onDelete: (id: string | number) => void;
}

export default function VariableList({
    variables,
    onEdit,
    onDelete,
}: VariableListProps) {
    const { moveVariableUp, moveVariableDown, reorderInProgress } =
        useTemplateVariables();
    const { template } = useTemplateManagement();

    const columns = useMemo<GridColDef[]>(
        () => [
            {
                field: "name",
                headerName: "Name",
                flex: 0.8,
                minWidth: 120,
                renderCell: (params: GridRenderCellParams) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {params.row.is_key && (
                            <Tooltip title="This is a key TemplateVariable that uniquely identifies recipients. It cannot be deleted or renamed.">
                                <KeyIcon color="primary" fontSize="small" />
                            </Tooltip>
                        )}
                        <Typography>{params.row.name}</Typography>
                    </Box>
                ),
            },
            { field: "type", headerName: "Type", flex: 0.6, minWidth: 100 },
            {
                field: "required",
                headerName: "Required",
                flex: 0.5,
                minWidth: 100,
                renderCell: (params: GridRenderCellParams) => (
                    <Chip
                        label={
                            params.row.is_key || params.row.required
                                ? "Required"
                                : "Optional"
                        }
                        color={
                            params.row.is_key || params.row.required
                                ? "primary"
                                : "default"
                        }
                        size="small"
                    />
                ),
            },
            {
                field: "description",
                headerName: "Description",
                flex: 1.5,
                minWidth: 200,
            },
            {
                field: "preview_value",
                headerName: "Preview Value",
                flex: 1,
                minWidth: 150,
            },
            {
                field: "actions",
                headerName: "Actions",
                sortable: false,
                flex: 0.8,
                minWidth: 160,
                disableColumnMenu: true,
                filterable: false,
                hideSortIcons: true,
                renderCell: (params: GridRenderCellParams) => {
                    const isKey = (params.row as TemplateVariable).is_key;
                    const isFirst = useMemo(
                        () =>
                            variables.indexOf(
                                params.row as TemplateVariable
                            ) === 0,
                        [variables, params.row]
                    );
                    const isSecond = useMemo(
                        () =>
                            variables.indexOf(
                                params.row as TemplateVariable
                            ) === 1,
                        [variables, params.row]
                    );
                    const isLast = useMemo(
                        () =>
                            variables.indexOf(
                                params.row as TemplateVariable
                            ) ===
                            variables.length - 1,
                        [variables, params.row]
                    );

                    return (
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Tooltip
                                title={
                                    isKey
                                        ? "Key variables can only be edited partially"
                                        : "Edit variable"
                                }
                            >
                                <span>
                                    <IconButton
                                        onClick={() =>
                                            onEdit(
                                                params.row as TemplateVariable
                                            )
                                        }
                                        size="small"
                                        disabled={false}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip
                                title={
                                    isKey
                                        ? "Key variables cannot be deleted"
                                        : "Delete variable"
                                }
                            >
                                <span>
                                    <IconButton
                                        onClick={() =>
                                            onDelete(
                                                (params.row as TemplateVariable)
                                                    .id
                                            )
                                        }
                                        size="small"
                                        color="error"
                                        disabled={isKey}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="Move variable up">
                                <span>
                                    <IconButton
                                        onClick={() =>
                                            template &&
                                            moveVariableUp(
                                                template.id,
                                                params.row.id
                                            )
                                        }
                                        size="small"
                                        disabled={isFirst || isSecond || reorderInProgress}
                                    >
                                        <ArrowUpwardIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="Move variable down">
                                <span>
                                    <IconButton
                                        onClick={() =>
                                            template &&
                                            moveVariableDown(
                                                template.id,
                                                params.row.id
                                            )
                                        }
                                        size="small"
                                        disabled={
                                            isKey || isLast || reorderInProgress
                                        }
                                    >
                                        <ArrowDownwardIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                    );
                },
            },
        ],
        [
            onEdit,
            onDelete,
            variables,
            template,
            moveVariableUp,
            moveVariableDown,
            reorderInProgress,
        ]
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "200px",
                width: "100%",
            }}
        >
            <DataGrid
                rows={variables}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                    sorting: {
                        sortModel: [{ field: "order", sort: "asc" }],
                    },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                    width: "100%",
                    "& .MuiDataGrid-root": {
                        width: "100%",
                    },
                }}
            />
        </Box>
    );
}
