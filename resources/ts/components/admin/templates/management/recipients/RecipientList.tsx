import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import { useTemplateRecipients } from '@/contexts/template/TemplateRecipientsContext';

interface RecipientListProps {
    templateId: number;
}

export default function RecipientList({ templateId }: RecipientListProps) {
    const {
        recipients,
        loading,
        pagination,
        setPagination,
        fetchRecipients,
        confirmDeleteRecipientId,
        setConfirmDeleteRecipientId,
        handleDeleteConfirm
    } = useTemplateRecipients();

    useEffect(() => {
        fetchRecipients(templateId, pagination.page, pagination.rowsPerPage);
    }, [templateId, pagination.page, pagination.rowsPerPage, fetchRecipients]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPagination(newPage, pagination.rowsPerPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPagination(0, parseInt(event.target.value, 10));
    };

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

    const columns = Object.keys(recipients[0]?.data || {});

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column}>{column}</TableCell>
                            ))}
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recipients.map((recipient) => (
                            <TableRow key={recipient.id}>
                                {columns.map((column) => (
                                    <TableCell key={column}>
                                        {recipient.data[column]}
                                    </TableCell>
                                ))}
                                <TableCell align="right">
                                    {recipient.is_valid ? (
                                        <Typography color="success.main">Valid</Typography>
                                    ) : (
                                        <Tooltip title={recipient.validation_errors?.join('\n') || ''}>
                                            <Typography color="error.main">Invalid</Typography>
                                        </Tooltip>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Delete">
                                        <IconButton
                                            onClick={() => setConfirmDeleteRecipientId(recipient.id)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={pagination.totalRecipients}
                page={pagination.page}
                onPageChange={handleChangePage}
                rowsPerPage={pagination.rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

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
                    <Button onClick={() => handleDeleteConfirm(templateId)} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
