"use client";

import { Checkbox, IconButton, Box, useTheme } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import type { Student } from "@/graphql/generated/types";
import { StudentTableColumns } from "../types";
import RowRenderer from "./cell/DataRowRenderer";
import { useEffect, useRef, useState } from "react";
import { useStudentTableUiContext } from "../StudentTableUiContext";

interface StudentTableRowProps {
    student: Student;
}

export default function StudentTableRow({ student }: StudentTableRowProps) {
    const theme = useTheme();

    const { selectedStudents, deleteStudent, toggleStudentSelect } =
        useStudentManagement();

    const { getColumnWidth } = useStudentTableUiContext();

    // Handle delete student
    const handleDeleteStudent = async () => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await deleteStudent(student.id);
        }
    };

    // State for tracking edited cells
    const [editingCell, setEditingCell] = useState<{
        field: keyof Student;
        // } | null>(null);
    } | null>(null);

    // Handle cell edit start
    const handleCellEditStart = (field: keyof Student, editable: boolean) => {
        if (!editable) return;
        setEditingCell({ field });
    };

    return (
        <tr
            style={{
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <td
                style={{
                    position: "relative",
                    zIndex: 0,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    borderInline: `1px solid ${theme.palette.divider}`,
                    borderInlineEnd: `1px solid ${theme.palette.divider}`,
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

            {StudentTableColumns.map((column, index) => {
                const isCurrentCellEditing = editingCell?.field === column.id;
                const currentCellEffectiveBorderColor = isCurrentCellEditing
                    ? theme.palette.primary.main
                    : theme.palette.divider;

                return (
                    <td
                        key={`${student.id}-${column.id}`}
                        style={{
                            paddingInlineStart: 10,
                            marginInlineEnd: 10,
                            width: getColumnWidth(column.id),
                            color: theme.palette.text.primary,
                            borderWidth: isCurrentCellEditing ? "2px" : "1px",
                            borderStyle: "solid",
                            borderColor: currentCellEffectiveBorderColor,
                        }}
                        onDoubleClick={() =>
                            column.editable &&
                            handleCellEditStart(
                                column.id as keyof Student,
                                true,
                            )
                        }
                        id={`cellTableCell-${student.id}-${column.id}`}
                    >
                        <RowRenderer
                            student={student}
                            column={column}
                            index={index}
                            editingCell={editingCell}
                            cancelEdit={() => setEditingCell(null)}
                            onEditStart={() =>
                                handleCellEditStart(
                                    column.id as keyof Student,
                                    column.editable,
                                )
                            }
                        />
                    </td>
                );
            })}

            <td
                style={{
                    position: "relative",
                    zIndex: 0,
                    width: getColumnWidth("actions"),
                    minWidth: "80px",
                    whiteSpace: "nowrap",
                    borderTop: `1px solid ${theme.palette.divider}`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    borderInlineStart: `1px solid ${theme.palette.divider}`,
                    borderInlineEnd: `1px solid ${theme.palette.divider}`,
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
