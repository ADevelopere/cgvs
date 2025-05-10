"use client";

import type React from "react";
import { Paper, Stack, Typography, Box } from "@mui/material";
import { People } from "@mui/icons-material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";
import StudentTableFooter from "./StudentTableFooter";
import useAppTranslation from "@/locale/useAppTranslation";
import { useEffect } from "react";
import StudentTableHeader from "./header/StudentTableHeader";
import StudentTableRow from "./data/StudentTableRow";
import { func } from "prop-types";
import { StudentTableUiProvider } from "./StudentTableUiContext";

const StudentManagementDashboardTitle: React.FC = () => {
    const strings = useAppTranslation("studentTranslations");
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%", paddingInlineStart: 1 }}
            gap={1}
        >
            <People color="primary" />
            <Typography variant="h6" component="div">
                {strings?.studentManagement}
            </Typography>
        </Stack>
    );
};

function StudentTableSelf() {
    const { students } = useStudentManagement();

    const { setDashboardSlot } = useDashboardLayout();
    useEffect(() => {
        setDashboardSlot("titleRenderer", <StudentManagementDashboardTitle />);

        return () => {
            setDashboardSlot("titleRenderer", null);
        };
    }, [setDashboardSlot]);

    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
                maxWidth: "calc(100vw - 48px)",
            }}
        >
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    "& table": {
                        width: "100%",
                        borderCollapse: "collapse",
                        tableLayout: "fixed",
                        backgroundColor: "background.paper",
                        color: "text.primary",
                        borderColor: "divider",
                    },
                    "& tr:hover td": {
                        backgroundColor: "action.hover",
                    },
                    "& th, & td": {
                        borderColor: "divider",
                    },
                }}
            >
                <table>
                    <StudentTableHeader />
                    <tbody>
                        {students.map((student) => (
                            <StudentTableRow
                                key={student.id}
                                student={student}
                            />
                        ))}
                    </tbody>
                </table>
            </Box>

            <StudentTableFooter />
        </Paper>
    );
}

export default function StudentTable() {
    return (
        <StudentTableUiProvider>
            <StudentTableSelf />
        </StudentTableUiProvider>
    );
}
