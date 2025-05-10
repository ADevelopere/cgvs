"use client";

import type React from "react";
import { Box, Typography } from "@mui/material";
import { format } from "date-fns";
import type { Student, UpdateStudentInput } from "@/graphql/generated/types";
import { StudentTableColumns, StudentTableColumnType } from "../../types";
import useAppTranslation from "@/locale/useAppTranslation";
import { useState } from "react";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import DefaultCell from "./DefaultCell";
import DateCell from "./DateCell";
import GenderCell from "./GenderCell";
import CountryCell from "./CountryCell";
import Resizer from "@/components/splitPane/Resizer";
import { useStudentTableUiContext } from "../../StudentTableUiContext";

// column: StudentTableColumnType

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

type CellRendererProps = {
    student: Student;
    column: StudentTableColumnType;
    index: number;
    editingCell: {
        field: keyof Student;
    } | null;
    onEditStart: () => void;
    cancelEdit: () => void;
    containerStyle?: React.CSSProperties;
    rowHeight?: number;
};

const RowRenderer: React.FC<CellRendererProps> = ({
    student,
    column,
    index,
    editingCell,
    cancelEdit,
    containerStyle,
    rowHeight,
}) => {
    const countryStrings = useAppTranslation("countryTranslations");
    const { startResize } = useStudentTableUiContext();

    const { updateStudent } = useStudentManagement();

    const value = formatCellValue(student[column.id], column.id);
    const [editValue, setEditValue] = useState<string>(value);

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
        cancelEdit();
    };

    const isEditing = editingCell?.field === column.id;
    const handleEdit = (newValue: string) => setEditValue(newValue);
    const handleSave = () => handleCellEditSave();

    const renderer = () => {
        if (!column.editable && isEditing) {
            return (
                <Typography
                    sx={{
                        fontSize: "0.875rem",
                        color: "text.secondary",
                    }}
                    className="cell-content"
                >
                    {value}
                </Typography>
            );
        }

        switch (column.id) {
            case "nationality":
                return (
                    <CountryCell
                        value={student[column.id]}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        isEditing={isEditing}
                        editable={column.editable}
                        countryStrings={countryStrings}
                    />
                );
            case "gender":
                return (
                    <GenderCell
                        value={value}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        isEditing={isEditing}
                        editable={column.editable}
                    />
                );
            case "date_of_birth":
                return (
                    <DateCell
                        value={value}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        isEditing={isEditing}
                        editable={column.editable}
                    />
                );
            default:
                return (
                    <DefaultCell
                        value={value}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        isEditing={isEditing}
                        editable={column.editable}
                    />
                );
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Box
                sx={{
                    ...containerStyle,
                    cursor: column.editable ? "text" : "default",
                    minHeight: "2rem",
                    "&:hover": column.editable
                        ? { backgroundColor: "rgba(0, 0, 0, 0.04)" }
                        : {},
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                }}
            >
                {renderer()}
            </Box>
            {index < StudentTableColumns.length + 1 && (
                <Resizer
                    allowResize={true}
                    orientation="vertical"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        startResize(
                            column.id,
                            e.clientX,
                            `headerTableCell-${column.id}`,
                        );
                    }}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        startResize(
                            column.id,
                            e.touches[0].clientX,
                            `headerTableCell-${column.id}`,
                        );
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="resizer"
                    containerStyle={{
                        minHeight: `${rowHeight}px`,
                        height: `${rowHeight}px`,
                    }}
                    internalStyle={{
                        left: "-10%",
                    }}
                    normalWidth={1}
                    whileResizingWidth={2}
                />
            )}
        </Box>
    );
};

export default RowRenderer;
