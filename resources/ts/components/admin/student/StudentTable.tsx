"use client";

import type React from "react";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableContainer,
    Paper,
} from "@mui/material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import StudentTableHeader from "./StudentTableHeader";
import StudentTableRow from "./StudentTableRow";
import StudentTableFooter from "./StudentTableFooter";
import StudentTableFilter from "./StudentTableFilter";


export default function StudentTable() {
    const { students } = useStudentManagement();

    // State for filter popover
    const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [currentFilterColumn, setCurrentFilterColumn] = useState<string | null>(null);

    // Handle filter icon click
    const handleFilterClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        columnId: string,
    ) => {
        setFilterAnchorEl(event.currentTarget);
        setCurrentFilterColumn(columnId);
    };

    // Handle filter close
    const handleFilterClose = () => {
        setFilterAnchorEl(null);
        setCurrentFilterColumn(null);
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
                            <StudentTableRow
                                key={student.id}
                                student={student}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <StudentTableFooter />

            <StudentTableFilter
                anchorEl={filterAnchorEl}
                columnId={currentFilterColumn}
                onClose={handleFilterClose}
            />
        </Paper>
    );
}
