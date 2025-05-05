import { useState } from "react";
import { 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    TableSortLabel,
    Button,
    Box
} from "@mui/material";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import { formatDate } from "@/utils/dateUtils";
import { Template } from "@/contexts/template/template.types";

type Order = 'asc' | 'desc';
type OrderBy = 'name' | 'created_at' | 'deleted_at';

const DeletedTemplatesCategory: React.FC = () => {
    const { deletedCategory } = useTemplateCategoryManagement();
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<OrderBy>('deleted_at');

    // Get templates from the deleted category
    const templates = deletedCategory?.templates || [];

    const handleRequestSort = (property: OrderBy) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedTemplates = [...templates].sort((a, b) => {
        if (orderBy === 'name') {
            return order === 'asc' 
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
        
        const dateA = new Date(a[orderBy] || '').getTime();
        const dateB = new Date(b[orderBy] || '').getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Background</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Template Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'created_at'}
                                    direction={orderBy === 'created_at' ? order : 'asc'}
                                    onClick={() => handleRequestSort('created_at')}
                                >
                                    Created At
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'deleted_at'}
                                    direction={orderBy === 'deleted_at' ? order : 'asc'}
                                    onClick={() => handleRequestSort('deleted_at')}
                                >
                                    Deleted At
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedTemplates.map((template) => (
                            <TableRow key={template.id}>
                                <TableCell>
                                    <Box 
                                        component="img"
                                        src={template.background_url}
                                        alt={`${template.name} background`}
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            objectFit: 'cover',
                                            borderRadius: 1
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{template.name}</TableCell>
                                <TableCell>{formatDate(template.created_at)}</TableCell>
                                <TableCell>{formatDate(template.deleted_at)}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            // Restore logic will be added later
                                            console.log('Restore template:', template.id);
                                        }}
                                    >
                                        Restore
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {sortedTemplates.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No deleted templates found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default DeletedTemplatesCategory;
