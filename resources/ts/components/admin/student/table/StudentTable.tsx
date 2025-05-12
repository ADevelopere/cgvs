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
import {
    StudentTableUiProvider,
    useStudentTableUiContext,
} from "./StudentTableUiContext";
import { StudentTableColumns } from "./types";
import Resizer from "@/components/splitPane/Resizer";
import { useAppTheme } from "@/contexts/ThemeContext";

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

const Resizers: React.FC = () => {
    const { startResize, columnsWidthMap } = useStudentTableUiContext();
    const { sideBarWidth } = useDashboardLayout();
    console.log("Resizers sideBarWidth", sideBarWidth);
    const { isRtl } = useAppTheme();

    return (
        <>
            {StudentTableColumns.map((column, index) => {
                // Calculate the position as the sum of all previous columns' widths
                const position =
                    StudentTableColumns.slice(0, index + 1).reduce(
                        (acc, prevColumn) =>
                            acc + (columnsWidthMap[prevColumn.id] || 0),
                        0,
                    ) +
                    sideBarWidth +
                    40 -4;

                return (
                    <Resizer
                        key={column.id}
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
                        containerStyle={{
                            maxHeight: `100%`,
                            height: "100%",
                            minHeight: "100%",
                            position: "absolute",
                            top: 0,
                            // Use `right` if `isRtl` is true, otherwise use `left`
                            ...(isRtl
                                ? { right: position }
                                : { left: position }),
                            zIndex: 1,
                        }}
                        internalStyle={{
                            left: "-10%",
                        }}
                        normalWidth={1}
                        whileResizingWidth={2}
                    />
                );
            })}
        </>
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
                    overflow: "hidden",
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
                <table
                    style={{
                        overflow: "hidden",
                        maxHeight: "100vh",
                    }}
                >
                    <StudentTableHeader />
                    <tbody>
                        {students.map((student) => (
                            <StudentTableRow
                                key={student.id}
                                student={student}
                            />
                        ))}
                    </tbody>

                    <Resizers />
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
