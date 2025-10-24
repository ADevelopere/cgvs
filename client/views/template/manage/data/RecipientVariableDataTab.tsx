"use client";

import React, { useEffect, useMemo } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { Template } from "@/client/graphql/generated/gql/graphql";
import { useRecipientVariableDataOperations } from "./hooks/useRecipientVariableDataOperations";
import { useRecipientVariableDataStore } from "./stores/useRecipientVariableDataStore";
import RecipientVariableDataGroupSelector from "./RecipientVariableDataGroupSelector";
import RecipientVariableDataTable from "./RecipientVariableDataTable";
import { templateRecipientGroupsByTemplateIdQueryDocument } from "../recipientGroup/hooks/recipientGroup.documents";
import { useAppTranslation } from "@/client/locale";
import logger from "@/client/lib/logger";

interface RecipientVariableDataTabProps {
  template: Template;
}

const RecipientVariableDataTab: React.FC<RecipientVariableDataTabProps> = ({
  template,
}) => {
  const operations = useRecipientVariableDataOperations();
  const store = useRecipientVariableDataStore();
  const strings = useAppTranslation("recipientVariableDataTranslations");

  // Fetch recipient groups
  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError,
  } = useQuery(templateRecipientGroupsByTemplateIdQueryDocument, {
    variables: { templateId: template.id },
    fetchPolicy: "cache-first",
  });

  const groups = useMemo(
    () => groupsData?.templateRecipientGroupsByTemplateId || [],
    [groupsData]
  );

  // Auto-select first group if no group is selected
  useEffect(() => {
    if (groups.length > 0 && !store.selectedGroup) {
      logger.info(
        "🔍 RecipientVariableDataTab: Auto-selecting first group:",
        groups[0]
      );
      operations.setSelectedGroup(groups[0]);
    }
  }, [groups, store.selectedGroup, operations]);

  // Show error state if there's an error
  if (groupsError) {
    return (
      <Alert
        severity="error"
        sx={{
          minWidth: { xs: 200, sm: 250, md: 300 },
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {strings.errorFetchingData}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Group Selector Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
          minHeight: 0,
        }}
      >
        <RecipientVariableDataGroupSelector
          groups={groups}
          selectedGroup={store.selectedGroup}
          onGroupChange={operations.setSelectedGroup}
          loading={groupsLoading}
        />
      </Box>

      {/* Content Area */}
      {groupsLoading ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : store.selectedGroup ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <RecipientVariableDataTable
            templateId={template.id}
            selectedGroupId={store.selectedGroup.id || 0}
          />
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: 8,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {strings.selectGroupPrompt}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RecipientVariableDataTab;
