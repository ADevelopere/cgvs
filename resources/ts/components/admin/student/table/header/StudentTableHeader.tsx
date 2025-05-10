import type React from "react";
import { Checkbox, useTheme } from "@mui/material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import { StudentTableColumns, StudentTableColumnType } from "../types";
import useAppTranslation from "@/locale/useAppTranslation";
import { useEffect, useRef, useState } from "react";
import { Student } from "@/graphql/generated/types";
import StudentTableFilter from "./StudentTableFilter";
import HeaderCellData from "./HeaderCell";
import { useStudentTableUiContext } from "../StudentTableUiContext";

export default function StudentTableHeader() {
    const strings = useAppTranslation("studentTranslations");
    const theme = useTheme();

    const { students, selectedStudents, toggleStudentSelect } =
        useStudentManagement();
    const { getColumnWidth } = useStudentTableUiContext();

    // State for filter popover
    const [filterAnchorEl, setFilterAnchorEl] =
        useState<HTMLButtonElement | null>(null);
    const [currentFilterColumn, setCurrentFilterColumn] = useState<
        keyof Student | "actions" | null
    >(null);

    // Handle filter icon click
    const handleFilterClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        columnId: keyof Student | "actions",
    ) => {
        setFilterAnchorEl(event.currentTarget);
        setCurrentFilterColumn(columnId);
    };

    // Handle filter close
    const handleFilterClose = () => {
        setFilterAnchorEl(null);
        setCurrentFilterColumn(null);
    };

    // Handle select all
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            // Select all students
            students.forEach((student) => {
                if (!selectedStudents.includes(student.id)) {
                    toggleStudentSelect(student.id);
                }
            });
        } else {
            // Deselect all students
            students.forEach((student) => {
                if (selectedStudents.includes(student.id)) {
                    toggleStudentSelect(student.id);
                }
            });
        }
    };

    const headerRef = useRef<HTMLTableSectionElement | null>(null);
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    useEffect(() => {
        if (headerRef.current) {
            const header = headerRef.current;
            const height = header.offsetHeight;
            setHeaderHeight(height);
        }
    }, [headerRef.current]);

    return (
        <>
            <thead ref={headerRef}>
                <tr
                    style={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <th
                        style={{
                            borderInlineEnd: `1px solid ${theme.palette.divider}`,
                            width: 40,
                            backgroundColor: "background.paper",
                            boxShadow: `0 1px 0 divider`,
                            color: "text.primary",
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
                            indeterminate={
                                selectedStudents.length > 0 &&
                                selectedStudents.length < students.length
                            }
                            checked={
                                students.length > 0 &&
                                selectedStudents.length === students.length
                            }
                            onChange={handleSelectAll}
                        />
                    </th>

                    {StudentTableColumns.map((column, index) => (
                        <HeaderCellData
                            key={column.id}
                            column={column}
                            columnWidth={getColumnWidth(column.id)}
                            onFilterClick={handleFilterClick}
                            headerHeight={headerHeight}
                        />
                    ))}

                    <th
                        style={{
                            width: "100px",
                            minWidth: "80px",
                            whiteSpace: "nowrap",
                            padding: "16px 4px",
                            backgroundColor: theme.palette.background.paper,
                            position: "sticky",
                            top: 0,
                            zIndex: 2,
                        }}
                    >
                        {strings?.actions}
                    </th>
                </tr>
            </thead>

            <StudentTableFilter
                anchorEl={filterAnchorEl}
                columnId={currentFilterColumn}
                onClose={handleFilterClose}
            />
        </>
    );
}
