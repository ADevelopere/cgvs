"use client";

import React, {
 createContext,
 useContext,
 useState,
 useCallback,
 useMemo,
 useEffect,
} from "react";
import { useParams } from "next/navigation";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTemplateCategoryManagement } from "./TemplateCategoryManagementContext";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useTemplateGraphQL } from "./TemplateGraphQLContext";
import { useDashboardLayout } from "../DashboardLayoutContext";
import { NavigationPageItem } from "../adminLayout.types";
import { useQuery } from "@apollo/client/react";
import * as Document from "@/client/graphql/documents";
import { usePageNavigation } from "../navigation/usePageNavigation";
import { TemplateVariableManagementProvider } from "../templateVariable";
import { RecipientManagementProvider } from "../recipient";

export type TemplateManagementTabType =
 | "basic"
 | "variables"
 | "editor"
 | "recipients"
 | "recipientsManagement"
 | "preview";

export interface TabError {
 message: string;
}

const defaultConfig: Graphql.TemplatesConfigs = {
 configs: [
  { key: "MAX_BACKGROUND_SIZE", value: "5125048" },
  { key: "ALLOWED_FILE_TYPES", value: '["image/jpeg", "image/png"]' },
 ],
};

type TemplateManagementContextType = {
 activeTab: TemplateManagementTabType;
 unsavedChanges: boolean;
 loadedTabs: TemplateManagementTabType[];
 error: string | undefined;
 tabErrors: Record<TemplateManagementTabType, TabError | undefined>;
 config: Graphql.TemplatesConfigs;
 template: Graphql.Template | undefined;
 loading: boolean;
 changeTab: (tab: TemplateManagementTabType) => void;
 setTabLoaded: (tab: TemplateManagementTabType) => void;
 setUnsavedChanges: (hasChanges: boolean) => void;
 setTabError: (tab: TemplateManagementTabType, error: TabError) => void;
 clearTabError: (tab: TemplateManagementTabType) => void;
};

const TemplateManagementContext = createContext<
 TemplateManagementContextType | undefined
>(undefined);

export const TemplateManagementProvider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 const pathParams = useParams<{ id: string }>();
 const id = pathParams?.id;
 const { allTemplates, templateToManage } = useTemplateCategoryManagement();
 const { templateConfigQuery } = useTemplateGraphQL();
 const { setNavigation } = useDashboardLayout();

 // Use the new navigation system
 const { registerResolver, updateParams, getParam, restorePageState } =
  usePageNavigation();

 const { data: apolloTemplateData } = useQuery(Document.templateQueryDocument, {
  variables: { id: id ? parseInt(id, 10) : 0 },
  skip: !id,
  fetchPolicy: "cache-and-network", // This ensures we get cache updates and network updates
 });

 const [config, setConfig] = useState<Graphql.TemplatesConfigs>(defaultConfig);

 const [activeTab, setActiveTab] = useState<TemplateManagementTabType>("basic");
 const [unsavedChanges, setUnsavedChanges] = useState(false);
 const [loadedTabs, setLoadedTabs] = useState<TemplateManagementTabType[]>([]);

 const [error, setError] = useState<string | undefined>(undefined);
 const [tabErrors, setTabErrors] = useState<
  Record<TemplateManagementTabType, TabError | undefined>
 >({
  basic: undefined,
  variables: undefined,
  editor: undefined,
  recipients: undefined,
  recipientsManagement: undefined,
  preview: undefined,
 });

 const [template, settemplate] = useState<Graphql.Template | undefined>(
  templateToManage,
 );

 const [loading, setLoading] = useState(false);

 // Update tab when URL params are available
 useEffect(() => {
  const tab = getParam("tab") as TemplateManagementTabType | undefined;
  if (
   tab &&
   [
    "basic",
    "variables",
    "editor",
    "recipients",
    "recipientsManagement",
    "preview",
   ].includes(tab)
  ) {
   setActiveTab(tab);
  }
 }, [getParam]);

 // Sync activeTab with URL params when they change (backup)
 useEffect(() => {
  const tab = getParam("tab") as TemplateManagementTabType | undefined;
  if (
   tab &&
   [
    "basic",
    "variables",
    "editor",
    "recipients",
    "recipientsManagement",
    "preview",
   ].includes(tab) &&
   tab !== activeTab
  ) {
   setActiveTab(tab);
  }
 }, [getParam, activeTab]);

 // Register navigation resolver for this page
 useEffect(() => {
  const unregister = registerResolver({
   segment: "admin/templates/:id/manage",
   resolver: async (params) => {
    try {
     // Restore page state if available
     const restoredState = restorePageState("admin/templates/:id/manage");
     if (restoredState) {
      const tab = restoredState.tab as TemplateManagementTabType | undefined;
      if (
       tab &&
       [
        "basic",
        "variables",
        "editor",
        "recipients",
        "recipientsManagement",
        "preview",
       ].includes(tab)
      ) {
       setActiveTab(tab);
       // Merge restored state with current params
       return { success: true, params: restoredState };
      }
     }

     // Handle tab parameter from current params
     const tab = params.tab as TemplateManagementTabType | undefined;
     if (
      tab &&
      [
       "basic",
       "variables",
       "editor",
       "recipients",
       "recipientsManagement",
       "preview",
      ].includes(tab)
     ) {
      setActiveTab(tab);
     }

     // Handle other nested params based on active tab
     // For example, if tab=variables&variable=5, we can handle variable selection
     if (tab === "variables" && params.variable) {
      // This can be handled by a child component's resolver
      // For now, we just ensure the tab is set correctly
     }

     return { success: true };
    } catch (err) {
     return {
      success: false,
      error:
       err instanceof Error ? err.message : "Failed to resolve navigation",
     };
    }
   },
   priority: 10,
  });

  return unregister;
 }, [registerResolver, restorePageState]);

 const changeTab = useCallback(
  (tab: TemplateManagementTabType) => {
   setActiveTab(tab);
   // Update URL params to reflect tab change
   updateParams({ tab }, { replace: true, merge: true });
  },
  [updateParams],
 );

 const handleSetTabLoaded = useCallback((tab: TemplateManagementTabType) => {
  setLoadedTabs((prevTabs) =>
   prevTabs.includes(tab) ? prevTabs : [...prevTabs, tab],
  );
 }, []);

 const handleSetTabError = useCallback(
  (tab: TemplateManagementTabType, error: TabError) => {
   setTabErrors((prev) => ({
    ...prev,
    [tab]: error,
   }));
  },
  [],
 );

 const handleClearTabError = useCallback((tab: TemplateManagementTabType) => {
  setTabErrors((prev) => ({
   ...prev,
   [tab]: undefined,
  }));
 }, []);

 useEffect(() => {
  const fetchTemplate = async () => {
   setLoading(true);
   try {
    let template: Graphql.Template | undefined | null = undefined;
    // First set from templateToManage if available
    if (templateToManage) {
     template = templateToManage;
    }

    // Then check allTemplates for immediate UI update
    if (id && !templateToManage) {
     const templateId = parseInt(id, 10);
     const localTemplate = allTemplates.find((t) => t.id === templateId);
     template = localTemplate;
    }

    // Finally, if we have Apollo data with additional fields, use that
    if (apolloTemplateData?.template) {
     template = apolloTemplateData.template;
    }
    if (template) {
     settemplate(template);
    } else {
     setError("Template not found");
    }
   } catch (error) {
    let message = "Failed to load template";
    if (error instanceof Error) {
     message = error.message;
    } else if (
     typeof error === "object" &&
     error !== null &&
     "message" in error &&
     typeof (error as { message?: unknown }).message === "string"
    ) {
     message = (error as { message: string }).message;
    }
    setError(message);
   } finally {
    setLoading(false);
   }
  };

  fetchTemplate();
 }, [id, templateToManage, allTemplates, apolloTemplateData]);

 const fetchConfig = useCallback(async () => {
  try {
   const data: Graphql.TemplatesConfigsQuery = await templateConfigQuery();
   if (data.templatesConfigs) {
    setConfig(data.templatesConfigs);
   } else {
    setError("Failed to fetch template config");
    setTabErrors((prev) => ({
     ...prev,
     basic: {
      message: "Failed to fetch template config",
     },
    }));
   }
  } catch (error) {
   let message = "Failed to fetch template config";
   if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: { message?: unknown } } }).response?.data
     ?.message &&
    typeof (error as { response: { data: { message: unknown } } }).response.data
     .message === "string"
   ) {
    message = (error as { response: { data: { message: string } } }).response
     .data.message;
   } else if (error instanceof Error) {
    message = error.message;
   }
   setError(message);
   setTabErrors((prev) => ({
    ...prev,
    basic: {
     message,
    },
   }));
  }
 }, [templateConfigQuery]);

 useEffect(() => {
  fetchConfig();
 }, [fetchConfig]);

 useEffect(() => {
  setNavigation((prevNav) => {
   if (!prevNav) return prevNav;
   return prevNav.map((item) => {
    if ("id" in item && item.id === "templates") {
     return {
      ...item,
      segment: `admin/templates/${template?.id}/manage`,
     } as NavigationPageItem;
    }
    return item;
   });
  });
 }, [setNavigation, template?.id]);

 const value = useMemo(
  () => ({
   activeTab,
   unsavedChanges,
   loadedTabs,
   error,
   tabErrors,
   config,
   template,
   loading,
   changeTab,
   setTabLoaded: handleSetTabLoaded,
   setUnsavedChanges,
   setTabError: handleSetTabError,
   clearTabError: handleClearTabError,
  }),
  [
   activeTab,
   changeTab,
   unsavedChanges,
   loadedTabs,
   error,
   tabErrors,
   config,
   template,
   loading,
   handleSetTabLoaded,
   handleSetTabError,
   handleClearTabError,
  ],
 );

 if (loading) {
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
     <Typography color="text.secondary" sx={{ mb: 3 }}>
      {error}
     </Typography>
     {/* <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={() => {
                        }}
                    >
                        Try Again
                    </Button> */}
    </Paper>
   </Box>
  );
 }

 return (
  <TemplateManagementContext.Provider value={value}>
   <TemplateVariableManagementProvider templateId={template?.id}>
    <RecipientManagementProvider templateId={template.id}>
     {children}
    </RecipientManagementProvider>
   </TemplateVariableManagementProvider>
  </TemplateManagementContext.Provider>
 );
};

export const useTemplateManagement = () => {
 const context = useContext(TemplateManagementContext);
 if (context === undefined) {
  throw new Error(
   "useTemplateManagement must be used within a TemplateManagementProvider",
  );
 }
 return context;
};
