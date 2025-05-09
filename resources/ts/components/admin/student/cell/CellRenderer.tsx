"use client";

import type React from "react";
import { Typography } from "@mui/material";
import { format } from "date-fns";
import type { Student, UpdateStudentInput } from "@/graphql/generated/types";
import { StudentTableColumnType } from "../types";
import useAppTranslation from "@/locale/useAppTranslation";
import { useState } from "react";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import DefaultCell from "./DefaultCell";
import DateCell from "./DateCell";
import GenderCell from "./GenderCell";
import CountryCell from "./CountryCell";

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
};

const CellRenderer: React.FC<CellRendererProps> = ({ student, column }) => {
    const countryStrings = useAppTranslation("countryTranslations");

    const { updateStudent } = useStudentManagement();

    // State for tracking edited cells
    const [editingCell, setEditingCell] = useState<{
        field: keyof Student;
    } | null>(null);
    const [editValue, setEditValue] = useState<string>("");

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

    const value = formatCellValue(student[column.id], column.id);
    const isEditing = editingCell?.field === column.id;
    const handleEdit = (newValue: string) => setEditValue(newValue);
    const handleSave = () => handleCellEditSave();

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

export default CellRenderer;
