"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useQuery } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import TemplateManagement from "./TemplateManagement";
import { templateQueryDocument } from "../hooks/template.documents";

/**
 * Wrapper component that handles template fetching, loading states, error states, and provider nesting
 * This component wraps the actual TemplateManagement component and provides all necessary data
 */
export const TemplateManagementPage: React.FC = () => {
  const pathParams = useParams<{ id: string }>();
  const id = pathParams?.id;

  // Apollo query for template data
  const {
    data: templateQuery,
    loading: apolloLoading,
    error: apolloError,
  } = useQuery(templateQueryDocument, {
    variables: { id: id ? parseInt(id, 10) : 0 },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const [template, setTemplate] = useState<Graphql.Template | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (apolloLoading || !templateQuery) return;
    if (templateQuery.template) {
      setTemplate(templateQuery.template);
      setLoading(false);
    } else if (!templateQuery.template) {
      setError("Template not found");
      setLoading(false);
    } else if (apolloError) {
      setError(apolloError.message);
      setLoading(false);
    }
  }, [apolloLoading, templateQuery, apolloError]);

  // Show loading spinner during Apollo query
  if (apolloLoading || loading) {
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
            {error ?? "Error Loading Template"}
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Wrap providers and pass template to TemplateManagement
  return <TemplateManagement template={template} />;
};

export default TemplateManagementPage;
