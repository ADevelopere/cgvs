"use client";

import { Checkbox, IconButton, Box, useTheme } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import type { Student } from "@/graphql/generated/types";
import { StudentTableColumnType } from "./types";
import CellRenderer from "./cell/CellRenderer";

interface StudentTableRowProps {
    student: Student;
    columns: StudentTableColumnType[];
    onStartResize: (
        columnIndex: number,
        clientX: number,
        cellElementId: string,
    ) => void;
}

export default function StudentTableRow({
    student,
    columns,
    onStartResize,
}: StudentTableRowProps) {
    const theme = useTheme();
    const isRtl = theme.direction === "rtl";

    const { selectedStudents, deleteStudent, toggleStudentSelect } =
        useStudentManagement();

    // Handle delete student
    const handleDeleteStudent = async () => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await deleteStudent(student.id);
        }
    };

    // Render cell content based on column type

    return (
        <tr
            style={{
                backgroundColor: theme.palette.background.paper,
                // '&:hover': {
                //     backgroundColor: theme.palette.action.hover,
                // }
            }}
        >
            <td
                style={{
                    borderInlineEnd: `1px solid ${theme.palette.divider}`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary,
                    padding: 0,
                }}
            >
                <Checkbox
                    slotProps={{
                        root: {
                            sx: {
                                width: 40,
                                height: 40,
                            },
                        },
                    }}
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudentSelect(student.id)}
                />
            </td>

            {columns.map((column, index) => (
                <td
                    key={`${student.id}-${column.id}`}
                    style={{
                        paddingInline: 10,
                        borderInlineEnd: `1px solid ${theme.palette.divider}`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        width: column.width,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                        position: "relative",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        color: theme.palette.text.primary,
                    }}
                    id={`cellTableCell-${student.id}-${column.id}`}
                >
                    <CellRenderer student={student} column={column} />
                    {/* Resizer */}
                    {index < columns.length + 1 && (
                        <Box
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onStartResize(
                                    index,
                                    e.clientX,
                                    `cellTableCell-${student.id}-${column.id}`,
                                );
                            }}
                            onTouchStart={(e) => {
                                e.preventDefault();
                                onStartResize(
                                    index,
                                    e.touches[0].clientX,
                                    `cellTableCell-${student.id}-${column.id}`,
                                );
                            }}
                            sx={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                [isRtl ? "right" : "left"]: "-5px",
                                width: 10,
                                cursor: "col-resize",
                                zIndex: 10,
                                "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            }}
                        />
                    )}
                </td>
            ))}

            <td
                style={{
                    width: "100px",
                    minWidth: "80px",
                    whiteSpace: "nowrap",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary,
                }}
            >
                <IconButton
                    color="error"
                    onClick={handleDeleteStudent}
                    size="small"
                >
                    <DeleteIcon />
                </IconButton>
            </td>
        </tr>
    );
}
