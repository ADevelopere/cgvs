"use client";

import type React from "react";
import { useState } from "react";
import {
    TableRow,
    TableCell,
    Checkbox,
    IconButton,
    TextField,
    Box,
    MenuItem,
    Select,
    Typography,
    useTheme,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import CountrySelect from "@/components/input/CountrySelect";
import countries from "@/utils/country";
import type { CountryType } from "@/utils/country";
import type { Student, UpdateStudentInput } from "@/graphql/generated/types";
import { StudentTableColumnType } from "./types";
import useAppTranslation from "@/locale/useAppTranslation";

interface StudentTableRowProps {
    student: Student;
    columns: StudentTableColumnType[];
    onStartResize: (columnIndex: number, clientX: number, cellElementId: string) => void;
}

export default function StudentTableRow({
    student,
    columns,
    onStartResize,
}: StudentTableRowProps) {
    const {
        selectedStudents,
        updateStudent,
        deleteStudent,
        toggleStudentSelect,
    } = useStudentManagement();

    const theme = useTheme();
    const isRtl = theme.direction === 'rtl';

    const countryStrings = useAppTranslation("countryTranslations");

    // State for tracking edited cells
    const [editingCell, setEditingCell] = useState<{
        field: keyof Student;
    } | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    // Handle country selection change
    const handleCountryChange = async (country: CountryType) => {
        const updateInput: UpdateStudentInput = {
            id: student.id,
            nationality: country.code,
        };
        await updateStudent({ input: updateInput });
    };

    // Handle cell edit start
    const handleCellEditStart = (
        field: keyof Student,
        value: string | null | undefined,
        editable: boolean,
    ) => {
        if (!editable) return;
        setEditingCell({ field });
        setEditValue(value || "");
    };

    // Handle cell edit change
    const handleCellEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    };

    // Handle cell edit save
    const handleCellEditSave = async () => {
        if (!editingCell) return;

        const { field } = editingCell;
        const originalValue = formatCellValue(student[field], field);

        // Only update if the value has changed
        if (editValue !== originalValue) {
            const updateInput: UpdateStudentInput = {
                id: student.id,
                [field]: editValue,
            };

            // Update student
            await updateStudent({ input: updateInput });
        }

        // Reset editing state regardless of whether we updated
        setEditingCell(null);
    };

    // Handle delete student
    const handleDeleteStudent = async () => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await deleteStudent(student.id);
        }
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
    const renderCellContent = (column: StudentTableColumnType) => {
        if (editingCell?.field === column.id) {
            if (!column.editable) {
                console.log("Column is not editable");
                return (
                    <Typography
                        sx={{
                            fontSize: "0.875rem",
                            color: "text.secondary",
                        }}
                        className="cell-content"
                    >
                        {formatCellValue(student[column.id], column.id)}
                    </Typography>
                );
            }

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
                        setCountry={(country) => {
                            setEditValue(country.code);
                            // Update immediately on country selection
                            const updateInput: UpdateStudentInput = {
                                id: student.id,
                                nationality: country.code,
                            };
                            updateStudent({ input: updateInput });
                        }}
                        onBlur={() => setEditingCell(null)}
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
                    className="cell-content"
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
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        onClick={() =>
                            handleCellEditStart(
                                column.id,
                                countryCode,
                                column.editable,
                            )
                        }
                    >
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
                        column.id,
                        formatCellValue(value, column.id),
                        column.editable,
                    )
                }
                sx={{
                    cursor: column.editable ? "text" : "default",
                    p: 1,
                    minHeight: "2rem",
                    "&:hover": column.editable
                        ? { backgroundColor: "rgba(0, 0, 0, 0.04)" }
                        : {},
                }}
                id={`cell-${student.id}-${column.id}`}
            >
                {formatCellValue(value, column.id)}
            </Box>
        );
    };

    return (
        <TableRow hover>
            <TableCell
                padding="checkbox"
                sx={{
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                    width: "60px",
                    position: "relative",
                }}
            >
                <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudentSelect(student.id)}
                />
            </TableCell>

            {columns.map((column, index) => (
                <TableCell
                    key={`${student.id}-${column.id}`}
                    sx={{
                        px: 1,
                        borderRight: "1px solid rgba(224, 224, 224, 1)",
                        "&:last-child": {
                            borderRight: "none",
                        },
                        width: column.width,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                        position: "relative",
                        overflow: "hidden",
                        textWrap: "nowrap",
                    }}
                    id={`cellTableCell-${student.id}-${column.id}`}
                    padding="checkbox"
                >
                    {renderCellContent(column)}
                    {/* Resizer */}
                    {index < columns.length && (
                        <Box
                            onMouseDown={(e) => { e.preventDefault(); onStartResize(index, e.clientX, `cellTableCell-${student.id}-${column.id}`); }}
                            onTouchStart={(e) => { e.preventDefault(); onStartResize(index, e.touches[0].clientX, `cellTableCell-${student.id}-${column.id}`); }}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                [isRtl ? 'left' : 'right']: '-5px',
                                width: '10px',
                                cursor: 'col-resize',
                                zIndex: 10,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                }
                            }}
                        />
                    )}
                </TableCell>
            ))}

            <TableCell padding="checkbox" sx={{ width: "100px", minWidth: '80px' }}>
                <IconButton
                    color="error"
                    onClick={handleDeleteStudent}
                    size="small"
                >
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}
