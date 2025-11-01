"use client";

import React from "react";
import { useQuery } from "@apollo/client/react";
import { useRecipientStore } from "./stores/useRecipientStore";
import { useRecipientOperations } from "./hooks/useRecipientOperations";
import { recipientsByGroupIdFilteredQueryDocument } from "./hooks/recipient.documents";
import RecipientTable from "./RecipientTable";
import {
  RecipientTableFooterEnd,
  RecipientTableFooterStart,
} from "./components/RecipientTableFooter";
import { useAppTranslation } from "@/client/locale";
import { CountryCode, Gender } from "@/client/graphql/generated/gql/graphql";

interface StudentsInGroupTableProps {
  templateId: number;
  isMobile: boolean;
}

type RecipientInGroupTableData = {
  id: number;
  recipientId: number;
  studentId: number;
  recipientGroupId: number;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
  nationality?: CountryCode | null;
  gender?: Gender | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

const StudentsInGroupTable: React.FC<StudentsInGroupTableProps> = ({
  templateId,
  isMobile,
}) => {
  const store = useRecipientStore();
  const operations = useRecipientOperations(templateId);
  const { recipientTranslations: strings } = useAppTranslation();
  // Get query variables from store
  const {
    recipientsByGroupIdFilteredQuery: studentsInGroupQueryParams,
    selectedGroup,
  } = store;

  // Fetch students directly with useQuery - Apollo handles refetch automatically
  const { data, loading } = useQuery(recipientsByGroupIdFilteredQueryDocument, {
    variables: {
      recipientGroupId: studentsInGroupQueryParams.recipientGroupId,
      paginationArgs: studentsInGroupQueryParams.paginationArgs,
      orderBy: studentsInGroupQueryParams.orderBy,
      filterArgs: studentsInGroupQueryParams.filterArgs,
    },
    skip: !selectedGroup,
    fetchPolicy: "cache-first",
  });

  const recipients = data?.recipientsByGroupIdFiltered?.data ?? [];
  const pageInfo = data?.recipientsByGroupIdFiltered?.pageInfo;

  // Transform recipients to expose student fields at top-level
  const transformedData: RecipientInGroupTableData[] = recipients
    .filter(r => r.student) // Only include recipients with student data
    .map(r => ({
      ...r.student!,
      id: r.id,
      recipientId: r.id,
      studentId: r.studentId,
      recipientGroupId: r.recipientGroupId,
    }));

  return (
    <RecipientTable<RecipientInGroupTableData, number>
      data={transformedData}
      getRowId={r => r.id}
      loading={loading}
      pageInfo={pageInfo}
      filters={operations.filtersInGroup}
      queryParams={operations.recipientsByGroupIdFilteredQuery}
      setColumnFilter={operations.setColumnFilterInGroup}
      clearFilter={operations.clearFilterInGroup}
      updateSort={operations.updateSortInGroup}
      onPageChange={operations.onPageChangeInGroup}
      onRowsPerPageChange={operations.onRowsPerPageChangeInGroup}
      selectedRowIds={store.selectedRecipientIdsInGroup}
      onSelectionChange={ids =>
        store.setSelectedRecipientIdsInGroup(ids.map(Number))
      }
      footerStartContent={
        <RecipientTableFooterStart
          tabType="manage"
          isMobile={isMobile}
          isLoading={loading}
        />
      }
      footerEndContent={
        <RecipientTableFooterEnd
          mode="remove"
          onAction={operations.deleteRecipients}
          actionButtonLabel={strings.removeFromGroup}
          confirmDialogTitle={strings.confirmRemoveStudents}
          confirmDialogMessage={strings.confirmRemoveStudentsMessage}
          isLoading={loading}
          isMobile={isMobile}
        />
      }
      isMobile={isMobile}
    />
  );
};

export default StudentsInGroupTable;
