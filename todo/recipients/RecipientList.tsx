"use client";

import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import { 
    DataGrid, 
    GridColDef, 
    GridRenderCellParams,
    GridPreProcessEditCellProps,
    useGridApiRef,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import { useMemo } from 'react';
import { useTemplateRecipients } from '@/contexts/template/TemplateRecipientsContext';
import { useTemplateVariables } from '@/contexts/template/TemplateVariablesContext';

interface RecipientListProps {
    templateId: number;
}

interface RecipientRow {
    id: number;
    is_valid: boolean;
    [key: string]: any;
}

export default function RecipientList({ templateId }: RecipientListProps) {
    const {
        recipients,
        loading,
        pagination,
        setPagination,
        confirmDeleteRecipientId,
        setConfirmDeleteRecipientId,
        handleDeleteConfirm,
        updateRecipient,
    } = useTemplateRecipients();

    const { variables } = useTemplateVariables();
    const apiRef = useGridApiRef();

    // Rebuild columns when variables change
    const columns: GridColDef[] = useMemo(() => {
        if (!recipients.length) return [];

        // Create columns based on variables
        const dataColumns = variables.map((variable): GridColDef => ({
            field: variable.name,
            headerName: variable.name,
            flex: 1,
            editable: true,
            renderHeader: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {variable.is_key && <KeyIcon fontSize="small" color="primary" />}
                    <Typography>{variable.name}</Typography>
                </Box>
            ),
            preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                const hasChanged = params.props.value !== params.row[variable.name];
                const isValid = !variable.is_key || (params.props.value && params.props.value.trim() !== '');
                return { ...params.props, error: !isValid };
            }
        }));

        return [
            ...dataColumns,
            {
                field: 'status',
                headerName: 'Status',
                width: 120,
                editable: false,
                renderCell: (params: GridRenderCellParams<RecipientRow>) => (
                    params.row.is_valid ? (
                        <Typography color="success.main">Valid</Typography>
                    ) : (
                        <Typography color="error.main">Invalid</Typography>
                    )
                ),
            },
            {
                field: 'actions',
                headerName: 'Actions',
                width: 100,
                editable: false,
                renderCell: (params: GridRenderCellParams<RecipientRow>) => (
                    <DeleteIcon
                        onClick={() => setConfirmDeleteRecipientId(params.row.id)}
                        style={{ cursor: 'pointer' }}
                    />
                ),
            },
        ];
    }, [variables, setConfirmDeleteRecipientId]);

    // Transform recipients data for DataGrid
    const rows = recipients.map(recipient => ({
        id: recipient.id,
        is_valid: recipient.is_valid,
        ...recipient.data
    }));

    const processRowUpdate = async (newRow: RecipientRow, oldRow: RecipientRow) => {
        console.log('Processing row update:', {
            newRow,
            oldRow
        });

        try {
            // Extract only the data fields (exclude id, is_valid, status, and actions)
            const { id, is_valid, status, actions, ...data } = newRow;
            
            // Update the recipient with the new data
            const updatedRecipient = await updateRecipient(id, data);

            // Return the server response data formatted as a row
            const updatedRow = {
                id: updatedRecipient.id,
                is_valid: updatedRecipient.is_valid,
                ...updatedRecipient.data
            };
            
            console.log('Row update successful:', {
                original: oldRow,
                updated: updatedRow
            });
            
            return updatedRow;
        } catch (error) {
            console.error('Error updating row:', error);
            return oldRow;
        }
    };

    const handleProcessRowUpdateError = (error: any) => {
        console.error('Error updating row:', error);
    };

    return (
        <>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    apiRef={apiRef}
                    rows={rows}
                    columns={columns}
                    rowCount={pagination.totalRecipients}
                    loading={loading}
                    pageSizeOptions={[5, 10, 25]}
                    paginationMode="server"
                    paginationModel={{
                        page: pagination.page,
                        pageSize: pagination.rowsPerPage,
                    }}
                    onPaginationModelChange={(model) => {
                        setPagination(model.page, model.pageSize);
                    }}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    disableRowSelectionOnClick
                    editMode="cell"
                />
            </Box>

            <Dialog 
                open={!!confirmDeleteRecipientId} 
                onClose={() => setConfirmDeleteRecipientId(null)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this recipient? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteRecipientId(null)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
