"use client";

import React, { useEffect, useMemo } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { Template, TemplateVariable } from "@/client/graphql/generated/gql/graphql";
import { useRecipientVariableDataOperations } from "./hooks/useRecipientVariableDataOperations";
import { useRecipientVariableDataStore } from "./stores/useRecipientVariableDataStore";
import RecipientVariableDataGroupSelector from "./RecipientVariableDataGroupSelector";
import RecipientVariableDataTable from "./RecipientVariableDataTable";
import { templateRecipientGroupsByTemplateIdQueryDocument } from "../recipientGroup/hooks/recipientGroup.documents";
import { useAppTranslation } from "@/client/locale";
import logger from "@/client/lib/logger";
import { templateVariablesByTemplateIdQueryDocument } from "../variables/hooks/templateVariable.documents";

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

  // Fetch template variables
  const {
    data: variablesData,
    loading: variablesLoading,
    error: variablesError,
  } = useQuery(templateVariablesByTemplateIdQueryDocument, {
    variables: { templateId: template.id },
    skip: !template.id,
    fetchPolicy: "cache-first",
  });

  const variables: TemplateVariable[] = useMemo(
    () => variablesData?.templateVariablesByTemplateId || [],
    [variablesData]
  );

  // Log errors when they occur
  useEffect(() => {
    if (groupsError) {
      logger.error("RecipientVariableDataTab: Error fetching recipient groups", {
        templateId: template.id,
        error: groupsError,
      });
    }
  }, [groupsError, template.id]);

  useEffect(() => {
    if (variablesError) {
      logger.error("RecipientVariableDataTab: Error fetching template variables", {
        templateId: template.id,
        error: variablesError,
      });
    }
  }, [variablesError, template.id]);

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
  if (groupsError || variablesError) {
    logger.error("RecipientVariableDataTab: Displaying error state to user", {
      templateId: template.id,
      hasGroupsError: !!groupsError,
      hasVariablesError: !!variablesError,
    });

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
      {groupsLoading || variablesLoading ? (
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
            selectedGroupId={store.selectedGroup.id || 0}
            variables={variables}
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
