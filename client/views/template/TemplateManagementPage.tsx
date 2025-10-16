"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useQuery } from "@apollo/client/react";
import * as Document from "@/client/graphql/sharedDocuments";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { TemplateVariableManagementProvider } from "../../contexts/templateVariable";
import { RecipientManagementProvider } from "../../contexts/recipient";
import { initializeTemplateUIFromURL } from "./useTemplateUIStore";
import TemplateManagement from "./TemplateManagement";

const defaultConfig: Graphql.TemplatesConfigs = {
  configs: [
    { key: "MAX_BACKGROUND_SIZE", value: "5125048" },
    { key: "ALLOWED_FILE_TYPES", value: '["image/jpeg", "image/png"]' },
  ],
};

/**
 * Wrapper component that handles template fetching, loading states, error states, and provider nesting
 * This component wraps the actual TemplateManagement component and provides all necessary data
 */
export const TemplateManagementPage: React.FC = () => {
  const pathParams = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = pathParams?.id;

  // Initialize store from URL params once on mount
  useEffect(() => {
    initializeTemplateUIFromURL(searchParams);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Apollo query for template data
  const { data: apolloTemplateData, loading: apolloLoading } = useQuery(
    Document.templateQueryDocument,
    {
      variables: { id: id ? parseInt(id, 10) : 0 },
      skip: !id,
      fetchPolicy: "cache-first",
    },
  );

  const template = apolloTemplateData?.template;
  const error = !id ? "Template ID not found in URL" : undefined;

  // Show loading spinner during Apollo query
  if (apolloLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error UI if template fetch fails or ID missing
  if (error || !template) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            maxWidth: 400,
            width: "100%",
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Template
          </Typography>
          <Typography color="text.secondary">
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Wrap providers and pass template to TemplateManagement
  return (
    <TemplateVariableManagementProvider>
      <RecipientManagementProvider templateId={template.id}>
        <TemplateManagement template={template} />
      </RecipientManagementProvider>
    </TemplateVariableManagementProvider>
  );
};

export default TemplateManagementPage;
