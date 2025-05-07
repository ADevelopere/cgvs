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
    Box,
} from "@mui/material";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import { formatDate } from "@/utils/dateUtils";

type Order = "asc" | "desc";
type OrderBy = "name" | "created_at" | "trashed_at";

const DeletionTemplatesCategory: React.FC = () => {
    const { deletionCategory, restoreTemplate } =
        useTemplateCategoryManagement();
    const [order, setOrder] = useState<Order>("desc");
    const [orderBy, setOrderBy] = useState<OrderBy>("trashed_at");

    // Get templates from the deleted category
    const templates = deletionCategory?.templates || [];

    const handleRequestSort = (property: OrderBy) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedTemplates = [...templates].sort((a, b) => {
        if (orderBy === "name") {
            return order === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }

        const dateA = new Date(a[orderBy] || "").getTime();
        const dateB = new Date(b[orderBy] || "").getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    return (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Background</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "name"}
                                    direction={
                                        orderBy === "name" ? order : "asc"
                                    }
                                    onClick={() => handleRequestSort("name")}
                                >
                                    Template Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "created_at"}
                                    direction={
                                        orderBy === "created_at" ? order : "asc"
                                    }
                                    onClick={() =>
                                        handleRequestSort("created_at")
                                    }
                                >
                                    Created At
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "trashed_at"}
                                    direction={
                                        orderBy === "trashed_at" ? order : "asc"
                                    }
                                    onClick={() =>
                                        handleRequestSort("trashed_at")
                                    }
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
                                        src={
                                            template.background_url ||
                                            "/storage/img/default-template-bg.png"
                                        }
                                        alt={`${template.name} background`}
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            objectFit: "cover",
                                            borderRadius: 1,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{template.name}</TableCell>
                                <TableCell>
                                    {formatDate(template.created_at)}
                                </TableCell>
                                <TableCell>
                                    {formatDate(template.trashed_at)}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() =>
                                            restoreTemplate(template.id)
                                        }
                                        color="primary"
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

export default DeletionTemplatesCategory;
