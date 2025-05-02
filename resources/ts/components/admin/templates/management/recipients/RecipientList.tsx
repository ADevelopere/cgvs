import {
    Box,
    Typography,
    CircularProgress,
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
    GridCellParams,
    GridPreProcessEditCellProps,
    GridCellEditStopParams,
    GridCellEditStopReasons,
    useGridApiRef,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import { useMemo} from 'react';
import { useTemplateRecipients } from '@/contexts/template/TemplateRecipientsContext';
import { useTemplateVariables } from '@/contexts/template/TemplateVariablesContext';

interface RecipientListProps {
    templateId: number;
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

        // Add status and actions columns
        return [
            ...dataColumns,
            {
                field: 'status',
                headerName: 'Status',
                width: 120,
                editable: false,
                renderCell: (params: GridRenderCellParams) => (
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
                renderCell: (params: GridRenderCellParams) => (
                    <DeleteIcon
                        onClick={() => setConfirmDeleteRecipientId(params.row.id)}
                        style={{ cursor: 'pointer' }}
                    />
                ),
            },
        ];
    }, [variables, setConfirmDeleteRecipientId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (recipients.length === 0) {
        return (
            <Box textAlign="center" p={4}>
                <Typography color="textSecondary">
                    No recipients found. Import some using the button above.
                </Typography>
            </Box>
        );
    }

    // Transform recipients data for DataGrid
    const rows = recipients.map(recipient => ({
        id: recipient.id,
        is_valid: recipient.is_valid,
        ...recipient.data
    }));

    const handleCellEditStop = (params: GridCellEditStopParams) => {
        if (params.reason === GridCellEditStopReasons.escapeKeyDown) {
            return; // Cancel edit on Escape
        }

        const variable = variables.find(v => v.name === params.field);
        if (variable?.is_key && (!params.value || params.value.trim() === '')) {
            return false; // Cancel edit if key field is empty
        }

        // Save changes for Tab, Shift+Tab, and Enter
        if (params.reason === GridCellEditStopReasons.tabKeyDown || 
            params.reason === GridCellEditStopReasons.shiftTabKeyDown ||
            params.reason === GridCellEditStopReasons.enterKeyDown) {
            const recipient = recipients.find(r => r.id === Number(params.id));
            if (!recipient) return;

            const updatedData = {
                ...recipient.data,
                [params.field]: params.value
            };

            updateRecipient(recipient.id, { data: updatedData }).catch(() => {
                // Error handling is managed by the context
            });
        }
        
        if (params.reason === GridCellEditStopReasons.cellFocusOut) {
            return false; // Cancel edit when clicking outside
        }
    };

    const handleCellKeyDown = (params: GridCellParams, event: React.KeyboardEvent) => {
        const { key, shiftKey } = event;

        if (key === 'Tab') {
            // Prevent default Tab behavior
            event.preventDefault();

            // Get the current cell indices
            const columnFields = columns
                .filter(col => col.editable !== false)
                .map(col => col.field);
            const currentColIndex = columnFields.indexOf(params.field);
            const rowIndex = rows.findIndex(row => row.id === params.id);

            // Calculate next cell position
            let nextColIndex = shiftKey ? currentColIndex - 1 : currentColIndex + 1;
            let nextRowIndex = rowIndex;

            // Handle row wrapping
            if (nextColIndex < 0) {
                nextColIndex = columnFields.length - 1;
                nextRowIndex--;
            } else if (nextColIndex >= columnFields.length) {
                nextColIndex = 0;
                nextRowIndex++;
            }

            // If we have a valid next cell, move to it
            if (nextRowIndex >= 0 && nextRowIndex < rows.length) {
                const nextField = columnFields[nextColIndex];
                const nextId = rows[nextRowIndex].id;

                // Start editing the next cell
                apiRef.current?.startCellEditMode({ id: nextId, field: nextField });
            }
        }
    };

    return (
        <>
            <Box sx={{ height: 400, width: '100%' }}>
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
                    onCellEditStop={handleCellEditStop}
                    onCellKeyDown={handleCellKeyDown}
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
