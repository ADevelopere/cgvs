import { useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Variable {
    id: string | number;
    name: string;
    type: string;
    description?: string;
    preview_value?: string;
}

interface VariableListProps {
    variables: Variable[];
    onEdit: (variable: Variable) => void;
    onDelete: (id: string | number) => void;
}

export default function VariableList({
    variables,
    onEdit,
    onDelete,
}: VariableListProps) {
    const columns = useMemo<GridColDef[]>(
        () => [
            { field: "name", headerName: "Name", flex: 0.8, minWidth: 120 },
            { field: "type", headerName: "Type", flex: 0.6, minWidth: 100 },
            { field: "description", headerName: "Description", flex: 1.5, minWidth: 200 },
            { field: "preview_value", headerName: "Preview Value", flex: 1, minWidth: 150 },
            {
                field: "actions",
                headerName: "Actions",
                sortable: false,
                flex: 0.5,
                minWidth: 100,
                disableColumnMenu: true,
                filterable: false,
                hideSortIcons: true,
                renderCell: (params: GridRenderCellParams) => (
                    <Box>
                        <IconButton
                            onClick={() => onEdit(params.row as Variable)}
                            size="small"
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() =>
                                onDelete((params.row as Variable).id)
                            }
                            size="small"
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ),
            },
        ],
        [onEdit, onDelete]
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
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                    width: "100%",
                    '& .MuiDataGrid-root': {
                        width: '100%'
                    }
                }}
            />
        </Box>
    );
}
