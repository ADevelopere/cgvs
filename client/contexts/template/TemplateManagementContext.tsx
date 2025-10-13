"use client";

/**
 * Template Management Context
 *
 * Architecture:
 * - UI State: Managed by Zustand (useTemplateUIStore) with automatic persistence
 * - Data & Services: Managed by React Context (Apollo queries, business logic)
 * - Components: Use combined hook (useTemplateManagement) that merges both
 *
 * This pattern provides:
 * - Automatic state persistence across navigation
 * - Clean separation of concerns
 * - Backward compatible API for existing components
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useDashboardLayout } from "../DashboardLayoutContext";
import { NavigationPageItem } from "../adminLayout.types";
import { useQuery } from "@apollo/client/react";
import * as Document from "@/client/graphql/documents";
import { TemplateVariableManagementProvider } from "../templateVariable";
import { RecipientManagementProvider } from "../recipient";
import { useTemplateService } from "@/client/graphql/service";
import {
  useTemplateUIStore,
  initializeTemplateUIFromURL,
} from "@/client/stores/useTemplateUIStore";

// Re-export types for backward compatibility with existing components
export type { TemplateManagementTabType, TabError } from "@/client/stores/useTemplateUIStore";

const defaultConfig: Graphql.TemplatesConfigs = {
  configs: [
    { key: "MAX_BACKGROUND_SIZE", value: "5125048" },
    { key: "ALLOWED_FILE_TYPES", value: '["image/jpeg", "image/png"]' },
  ],
};

/**
 * Context type now only contains data and services
 * UI state is managed by Zustand store
 */
type TemplateManagementContextType = {
  config: Graphql.TemplatesConfigs;
  template: Graphql.Template | undefined;
  loading: boolean;
  error: string | undefined;
};

const TemplateManagementContext = createContext<
  TemplateManagementContextType | undefined
>(undefined);

export const TemplateManagementProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const pathParams = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = pathParams?.id;
  const templateService = useTemplateService();
  const { setNavigation } = useDashboardLayout();

  // Apollo query for template data
  const { data: apolloTemplateData, loading: apolloLoading } = useQuery(
    Document.templateQueryDocument,
    {
      variables: { id: id ? parseInt(id, 10) : 0 },
      skip: !id,
      fetchPolicy: "cache-first",
    },
  );

  const [config, setConfig] = useState<Graphql.TemplatesConfigs>(defaultConfig);
  const [template, setTemplate] = useState<Graphql.Template | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  // Initialize store from URL params once on mount
  useEffect(() => {
    initializeTemplateUIFromURL(searchParams);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync template from Apollo query
  useEffect(() => {
    if (apolloTemplateData?.template) {
      setTemplate(apolloTemplateData.template);
      setError(undefined);
    } else if (!id) {
      setError("Template ID not found in URL");
    }
  }, [apolloTemplateData, id]);

  // Fetch config once on mount
  useEffect(() => {
    const fetchConfig = async () => {
      const config = await templateService.fetchTemplateConfig();
      if (config) {
        setConfig(config);
      }
    };
    fetchConfig();
  }, [templateService]);

  // Update navigation
  useEffect(() => {
    if (!template?.id) return;

    setNavigation((prevNav) => {
      if (!prevNav) return prevNav;
      return prevNav.map((item) => {
        if ("id" in item && item.id === "templates") {
          return {
            ...item,
            segment: `admin/templates/${template.id}/manage`,
          } as NavigationPageItem;
        }
        return item;
      });
    });
  }, [setNavigation, template?.id]);

  // Reset store on unmount
  useEffect(() => {
    return () => {
      useTemplateUIStore.getState().reset();
    };
  }, []);

  // Context value only contains data and services
  const value = {
    config,
    template,
    loading: apolloLoading,
    error,
  };

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

  return (
    <TemplateManagementContext.Provider value={value}>
      <TemplateVariableManagementProvider>
        <RecipientManagementProvider templateId={template.id}>
          {children}
        </RecipientManagementProvider>
      </TemplateVariableManagementProvider>
    </TemplateManagementContext.Provider>
  );
};

/**
 * Hook that combines context (data/services) with Zustand store (UI state)
 * Components only use this hook - Zustand is an implementation detail
 */
export const useTemplateManagement = () => {
  const context = useContext(TemplateManagementContext);
  const uiStore = useTemplateUIStore();

  if (context === undefined) {
    throw new Error(
      "useTemplateManagement must be used within a TemplateManagementProvider",
    );
  }

  // Combine context data with UI store state
  return {
    ...context,
    ...uiStore,
  };
};
