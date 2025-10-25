"use client";

import type React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { People } from "@mui/icons-material";
import { useAppTranslation } from "@/client/locale";
import { useDashboardLayout } from "@/client/views/dashboard/layout/DashboardLayoutContext";
import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { Table, type AnyColumn } from "@/client/components/Table";
import CreateStudentRow from "./CreateStudentRow";
import { ROWS_PER_PAGE_OPTIONS } from "@/client/components/Table/constants";
import { useStudentOperations } from "./hook/useStudentOperations";
import { useStudentTable } from "./hook/useStudentTable";
import * as Document from "./hook/student.documents";
import { Student } from "@/client/graphql/generated/gql/graphql";

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

const StudentTable: React.FC = () => {
  // Get operations and store state
  const {
    queryParams,
    onPageChange,
    onRowsPerPageChange,
  } = useStudentOperations();

  // Fetch students directly with useQuery - Apollo handles refetch automatically
  const { data, loading } = useQuery(Document.studentsQueryDocument, {
    variables: queryParams,
    fetchPolicy: "cache-first",
  });

  const students = data?.students?.data ?? [];
  const pageInfo = data?.students?.pageInfo;

  const { setDashboardSlot } = useDashboardLayout();
  useEffect(() => {
    setDashboardSlot("titleRenderer", <StudentManagementDashboardTitle />);

    return () => {
      setDashboardSlot("titleRenderer", null);
    };
  }, [setDashboardSlot]);

  // Get columns from table hook
  const { columns } = useStudentTable();

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
        id="student-table"
      >
        <Table<Student, number>
          data={students}
          isLoading={loading}
          columns={columns as readonly AnyColumn<Student, number>[]}
          getRowId={row => row.id}
          pageInfo={pageInfo}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          initialWidths={{}}
          enableRowResizing={false}
          style={{
            height: "100%",
            overflow: "hidden",
            maxWidth: "calc(100vw - 48px)",
          }}
          creationRow={<CreateStudentRow />}
        />
      </Box>
    </Paper>
  );
};

export default StudentTable;
