import React from 'react';
import {
  Box,
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

export default function VariableList({ variables, onEdit, onDelete }: VariableListProps) {
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'preview_value', headerName: 'Preview Value', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton onClick={() => onEdit(params.row as Variable)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete((params.row as Variable).id)} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '200px',
        width: '100%'
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
      />
    </Box>
  );
}
