"use client";

import React from "react";
import { useQuery } from "@apollo/client/react";
import { useRecipientStore } from "./stores/useRecipientStore";
import { useRecipientOperations } from "./hooks/useRecipientOperations";
import { studentsNotInRecipientGroupQueryDocument } from "./hooks/recipient.documents";
import RecipientTable from "./RecipientTable";
import { RecipientTableFooterEnd, RecipientTableFooterStart } from "./components/RecipientTableFooter";
import { useAppTranslation } from "@/client/locale";
import { Student } from "@/client/graphql/generated/gql/graphql";

interface StudentsNotInGroupTableProps {
  templateId: number;
  isMobile: boolean;
}

const StudentsNotInGroupTable: React.FC<StudentsNotInGroupTableProps> = ({ templateId, isMobile }) => {
  const store = useRecipientStore();
  const operations = useRecipientOperations(templateId);
  const { recipientTranslations: strings } = useAppTranslation();

  // Get query variables from store
  const { studentsNotInGroupQueryParams, selectedGroup } = store;

  // Fetch students directly with useQuery - Apollo handles refetch automatically
  const { data, loading } = useQuery(studentsNotInRecipientGroupQueryDocument, {
    variables: {
      ...studentsNotInGroupQueryParams,
      recipientGroupId: studentsNotInGroupQueryParams.recipientGroupId,
    },
    skip: !selectedGroup, // Don't query if no group selected
    fetchPolicy: "cache-first",
  });

  const students = data?.studentsNotInRecipientGroup?.data ?? [];
  const pageInfo = data?.studentsNotInRecipientGroup?.pageInfo;

  return (
    <RecipientTable<Student, number>
      data={students}
      getRowId={row => row.id}
      loading={loading}
      pageInfo={pageInfo}
      filters={operations.filtersNotInGroup}
      queryParams={operations.studentsNotInGroupQueryParams}
      setColumnFilter={operations.setColumnFilter}
      clearFilter={operations.clearFilter}
      updateSort={operations.updateSort}
      onPageChange={operations.onPageChange}
      onRowsPerPageChange={operations.onRowsPerPageChange}
      selectedRowIds={store.selectedStudentIdsNotInGroup}
      onSelectionChange={ids => store.setSelectedStudentIdsNotInGroup(ids.map(Number))}
      footerStartContent={<RecipientTableFooterStart tabType="add" isMobile={isMobile} isLoading={loading} />}
      footerEndContent={
        <RecipientTableFooterEnd
          mode="add"
          onAction={operations.addStudentsToGroup}
          actionButtonLabel={strings.addToGroup}
          confirmDialogTitle={strings.confirmAddStudents}
          confirmDialogMessage={strings.confirmAddStudentsMessage}
          isLoading={loading}
          isMobile={isMobile}
        />
      }
      isMobile={isMobile}
    />
  );
};

export default StudentsNotInGroupTable;
