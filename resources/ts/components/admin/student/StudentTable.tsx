"use client";

import type React from "react";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Checkbox,
    IconButton,
    TextField,
    Popover,
    Box,
    Typography,
    Pagination,
    Stack,
    MenuItem,
    Select,
} from "@mui/material";
import {
    Delete as DeleteIcon,
    FilterList as FilterListIcon,
    Clear as ClearIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import CountrySelect from "@/components/input/CountrySelect";
import countries from "@/utils/country";
import type { CountryType } from "@/utils/country";
import type { Student, UpdateStudentInput } from "@/graphql/generated/types";
import StudentTableHeader from "./StudentTableHeader";
import { Column } from "./types";
import useAppTranslation from "@/locale/useAppTranslation";

export const StudentTableColumns: Column[] = [
    { id: "name", label: "Name", sortable: true, filterable: true },
    { id: "email", label: "Email", sortable: true, filterable: true },
    {
        id: "date_of_birth",
        label: "Date of Birth",
        sortable: true,
        filterable: true,
    },
    { id: "gender", label: "Gender", sortable: true, filterable: true },
    {
        id: "nationality",
        label: "Nationality",
        sortable: true,
        filterable: true,
    },
    {
        id: "phone_number",
        label: "Phone Number",
        sortable: true,
        filterable: true,
    },
    { id: "created_at", label: "Created At", sortable: true, filterable: true },
    { id: "updated_at", label: "Updated At", sortable: true, filterable: true },
];

export default function StudentTable() {
    const {
        students,
        selectedStudents,
        paginatorInfo,
        queryParams,
        createStudent,
        updateStudent,
        deleteStudent,
        setQueryParams,
        toggleStudentSelect,
    } = useStudentManagement();

    const countryStrings = useAppTranslation("countryTranslations");

    // State for filter popover
    const [filterAnchorEl, setFilterAnchorEl] =
        useState<HTMLButtonElement | null>(null);
    const [currentFilterColumn, setCurrentFilterColumn] = useState<
        string | null
    >(null);
    const [filterValue, setFilterValue] = useState<string>("");

    // State for tracking edited cells
    const [editingCell, setEditingCell] = useState<{
        studentId: string;
        field: string;
    } | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    // Handle filter icon click
    const handleFilterClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        columnId: string,
    ) => {
        setFilterAnchorEl(event.currentTarget);
        setCurrentFilterColumn(columnId);
        setFilterValue("");
    };

    // Handle filter close
    const handleFilterClose = () => {
        setFilterAnchorEl(null);
        setCurrentFilterColumn(null);
    };

    // Apply filter
    const applyFilter = () => {
        if (currentFilterColumn && filterValue) {
            // In a real implementation, you would update the queryParams with the filter
            // This is a simplified example
            handleFilterClose();
        }
    };

    // Handle country selection change
    const handleCountryChange = async (
        studentId: string,
        country: CountryType,
    ) => {
        const updateInput: UpdateStudentInput = {
            id: studentId,
            nationality: country.code,
        };
        await updateStudent({ input: updateInput });
    };

    // Handle cell edit start
    const handleCellEditStart = (
        studentId: string,
        field: keyof Student,
        value: string,
    ) => {
        setEditingCell({ studentId, field });
        setEditValue(value || "");
    };

    // Handle cell edit change
    const handleCellEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    };

    // Handle cell edit save
    const handleCellEditSave = async () => {
        if (!editingCell) return;

        const { studentId, field } = editingCell;

        const updateInput: UpdateStudentInput = {
            id: studentId,
            [field]: editValue,
        };

        // Update student
        await updateStudent({ input: updateInput });

        // Reset editing state
        setEditingCell(null);
    };

    // Handle delete student
    const handleDeleteStudent = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await deleteStudent(id);
        }
    };

    // Handle page change
    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        page: number,
    ) => {
        setQueryParams({ page });
    };

    // Format cell value for display
    const formatCellValue = (value: any, columnId: string): string => {
        if (value === null || value === undefined) return "";

        if (columnId === "date_of_birth" && value) {
            return format(new Date(value), "yyyy-MM-dd");
        }

        if (columnId === "created_at" || columnId === "updated_at") {
            return format(new Date(value), "yyyy-MM-dd HH:mm");
        }

        return String(value);
    };

    // Render cell content based on column type
    const renderCellContent = (student: Student, column: Column) => {
        if (
            editingCell?.studentId === student.id &&
            editingCell?.field === column.id
        ) {
            if (column.id === "gender") {
                return (
                    <Select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value as string)}
                        onBlur={handleCellEditSave}
                        variant="standard"
                        fullWidth
                        autoFocus
                    >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </Select>
                );
            }

            if (column.id === "nationality") {
                return (
                    <CountrySelect
                        country={
                            countries.find((c) => c.code === editValue) ||
                            countries[0]
                        }
                        setCountry={(country) =>
                            handleCountryChange(student.id, country)
                        }
                        fullWidth
                    />
                );
            }

            if (column.id === "date_of_birth") {
                return (
                    <TextField
                        type="date"
                        variant="standard"
                        value={editValue}
                        onChange={handleCellEditChange}
                        onBlur={handleCellEditSave}
                        autoFocus
                        fullWidth
                    />
                );
            }

            return (
                <TextField
                    variant="standard"
                    value={editValue}
                    onChange={handleCellEditChange}
                    onBlur={handleCellEditSave}
                    autoFocus
                    fullWidth
                />
            );
        }

        // Display mode
        if (column.id === "nationality") {
            const countryCode = student[column.id];
            const country = countryCode
                ? countries.find((c) => c.code === countryCode)
                : null;
            if (country) {
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <img
                            loading="lazy"
                            width="20"
                            height="15"
                            src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                            alt=""
                        />
                        {countryStrings[country.code]}
                    </Box>
                );
            }
            return formatCellValue(countryCode, column.id);
        }

        const value = student[column.id];
        return (
            <Box
                onClick={() =>
                    handleCellEditStart(
                        student.id,
                        column.id,
                        formatCellValue(value, column.id),
                    )
                }
                sx={{
                    cursor: "text",
                    p: 1,
                    minHeight: "2rem",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
            >
                {formatCellValue(value, column.id)}
            </Box>
        );
    };

    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
            }}
        >
            <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
                <Table stickyHeader aria-label="student management table">
                    <StudentTableHeader onFilterClick={handleFilterClick} />

                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id} hover>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedStudents.includes(
                                            student.id,
                                        )}
                                        onChange={() =>
                                            toggleStudentSelect(student.id)
                                        }
                                    />
                                </TableCell>

                                {StudentTableColumns.map((column) => (
                                    <TableCell
                                        key={`${student.id}-${column.id}`}
                                    >
                                        {renderCellContent(student, column)}
                                    </TableCell>
                                ))}

                                <TableCell>
                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            handleDeleteStudent(student.id)
                                        }
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Footer */}
            {paginatorInfo && (
                <Box
                    sx={{ p: 2, borderTop: "1px solid rgba(224, 224, 224, 1)" }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="body2">
                            Showing {paginatorInfo.firstItem || 0} to{" "}
                            {paginatorInfo.lastItem || 0} of{" "}
                            {paginatorInfo.total} entries
                        </Typography>

                        <Pagination
                            count={paginatorInfo.lastPage}
                            page={paginatorInfo.currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Stack>
                </Box>
            )}

            {/* Filter Popover */}
            <Popover
                open={Boolean(filterAnchorEl)}
                anchorEl={filterAnchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <Box sx={{ p: 2, width: 250 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Filter by {currentFilterColumn}
                    </Typography>

                    <TextField
                        label="Filter value"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                    >
                        <IconButton size="small" onClick={handleFilterClose}>
                            <ClearIcon />
                        </IconButton>

                        <IconButton
                            size="small"
                            color="primary"
                            onClick={applyFilter}
                        >
                            <FilterListIcon />
                        </IconButton>
                    </Stack>
                </Box>
            </Popover>
        </Paper>
    );
}
