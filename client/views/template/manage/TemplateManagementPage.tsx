"use client";

import React, { useState, useEffect, startTransition, lazy, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Box, Fade, Slide, CircularProgress, styled } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { templateQueryDocument } from "../hooks/template.documents";
import { useDashboardLayout } from "@/client/views/dashboard/layout/DashboardLayoutContext";
import { TabContext, TabPanel } from "@mui/lab";
import { TemplateManagementTabType, useTemplateUIStore } from "./useTemplateManagementStore";
import BasicInfoTab from "./BasicInfoTab";
import TemplateVariableManagement from "./variables/TemplateVariableManagement";
import RecipientGroupTab from "./recipientGroup/RecipientGroupTab";
import { EditorTab } from "./editor/EditorTab";
import { ManagementTabList } from "./ManagementTabList";
import { TemplateManagementHeader } from "./components/TemplateManagementHeader";
import { TemplateNotFoundError } from "./components/TemplateNotFoundError";
import { TemplateContentSkeleton } from "./components/TemplateContentSkeleton";
import { useAppTheme } from "@/client/contexts";
import { Preview } from "./preview/Preview";

// Lazy load heavy components that block on mount
const RecipientsManagementTab = lazy(() => import("./recipient/RecipientsManagementTab "));
const RecipientVariableDataTab = lazy(() => import("./data/RecipientVariableDataTab"));

// Fallback component for lazy-loaded tabs
const TabLoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      minHeight: 200,
    }}
  >
    <CircularProgress />
  </Box>
);

/**
 * Main template management page component
 * Handles template fetching, loading states, error states, and renders header/tabs before data loading
 */
// Tab order for determining slide direction
const TAB_ORDER: TemplateManagementTabType[] = [
  "basic",
  "variables",
  "recipients",
  "recipientsManagement",
  "data",
  "editor",
  "preview",
];

const StyledTabPanel = styled(TabPanel)(() => ({
  width: "100%",
  height: "100%",
  overflow: "hidden",
}));

const TabContent = styled(Box)(() => ({
  width: "100%",
  height: "100%",
}));

export const TemplateManagementPageContent: React.FC = () => {
  const pathParams = useParams<{ id: string }>();
  const id = pathParams?.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setDashboardSlot } = useDashboardLayout();
  const { activeTab, setActiveTab } = useTemplateUIStore();
  const [prevTabIndex, setPrevTabIndex] = React.useState(TAB_ORDER.indexOf(activeTab));

  const { isRtl } = useAppTheme();

  // Apollo query for template data
  const {
    data: templateQuery,
    loading: apolloLoading,
    error,
  } = useQuery(templateQueryDocument, {
    variables: { id: id ? Number.parseInt(id, 10) : 0 },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const [template, setTemplate] = useState<Graphql.Template | null>(null);
  const [updating, setUpdating] = useState(true);
  const loading = React.useMemo(() => updating || apolloLoading, [updating, apolloLoading]);
  const templateNotFound = React.useMemo(() => !template && !loading && !error, [template, loading, error]);

  useEffect(() => {
    if (apolloLoading || !templateQuery) return;
    if (templateQuery.template) {
      setTemplate(templateQuery.template);
    }
    setUpdating(false);
  }, [apolloLoading, templateQuery, error]);

  const handleBack = React.useCallback(() => {
    router.push("/admin/templates");
  }, [router]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: TemplateManagementTabType) => {
    // Update immediately for smooth UI feedback
    setPrevTabIndex(TAB_ORDER.indexOf(activeTab));

    // Defer the heavy state updates to prevent blocking
    startTransition(() => {
      setActiveTab(newValue);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", newValue);
      router.push(`?${params.toString()}`);
    });
  };

  // Calculate slide direction based on tab indices and RTL mode
  const slideDirection = React.useMemo(() => {
    const currentTabIndex = TAB_ORDER.indexOf(activeTab);
    const baseDirection = currentTabIndex > prevTabIndex ? "left" : "right";
    // Reverse direction in RTL mode
    return isRtl ? (baseDirection === "left" ? "right" : "left") : baseDirection;
  }, [activeTab, prevTabIndex, isRtl]);

  // Set dashboard title slot
  useEffect(() => {
    setDashboardSlot(
      "titleRenderer",
      <TemplateManagementHeader
        templateName={template?.name || undefined}
        isLoading={loading}
        isError={Boolean(error || templateNotFound)}
        onBackAction={handleBack}
      />
    );

    return () => {
      setDashboardSlot("titleRenderer", null);
    };
  }, [setDashboardSlot, template?.name, loading, error, templateNotFound, handleBack]);

  // Render tab content based on state
  const renderTabContent = () => {
    if (loading) {
      return <TemplateContentSkeleton />;
    }

    if (error || templateNotFound) {
      return <TemplateNotFoundError onBack={handleBack} />;
    }

    if (!template) {
      return <TemplateContentSkeleton />;
    }

    // Render actual tab content when template is available
    return (
      <TabContext value={activeTab}>
        <StyledTabPanel value="basic">
          <Fade in={activeTab === "basic"} timeout={300}>
            <Slide direction={slideDirection} in={activeTab === "basic"} timeout={250}>
              <TabContent>
                <BasicInfoTab template={template} />
              </TabContent>
            </Slide>
          </Fade>
        </StyledTabPanel>
        <StyledTabPanel value="variables">
          <Fade in={activeTab === "variables"} timeout={300}>
            <Slide direction={slideDirection} in={activeTab === "variables"} timeout={250}>
              <TabContent>
                <TemplateVariableManagement template={template} />
              </TabContent>
            </Slide>
          </Fade>
        </StyledTabPanel>
        <StyledTabPanel value="recipients">
          <Fade in={activeTab === "recipients"} timeout={300}>
            <Slide direction={slideDirection} in={activeTab === "recipients"} timeout={250}>
              <TabContent>
                <RecipientGroupTab template={template} />
              </TabContent>
            </Slide>
          </Fade>
        </StyledTabPanel>
        <StyledTabPanel value="recipientsManagement">
          <Suspense fallback={<TabLoadingFallback />}>
            <Fade in={activeTab === "recipientsManagement"} timeout={300}>
              <Slide direction={slideDirection} in={activeTab === "recipientsManagement"} timeout={250}>
                <TabContent>
                  <RecipientsManagementTab template={template} />
                </TabContent>
              </Slide>
            </Fade>
          </Suspense>
        </StyledTabPanel>
        <StyledTabPanel value="data">
          <Suspense fallback={<TabLoadingFallback />}>
            <Fade in={activeTab === "data"} timeout={300}>
              <Slide direction={slideDirection} in={activeTab === "data"} timeout={250}>
                <TabContent>
                  <RecipientVariableDataTab template={template} />
                </TabContent>
              </Slide>
            </Fade>
          </Suspense>
        </StyledTabPanel>
        <StyledTabPanel value="editor">
          <Fade in={activeTab === "editor"} timeout={300}>
            <Slide direction={slideDirection} in={activeTab === "editor"} timeout={250}>
              <TabContent>
                <EditorTab template={template} />
              </TabContent>
            </Slide>
          </Fade>
        </StyledTabPanel>
        <StyledTabPanel value="preview" sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <Fade in={activeTab === "preview"} timeout={300}>
            <Slide direction={slideDirection} in={activeTab === "preview"} timeout={250}>
              <TabContent>
                <Preview templateId={template.id} />
              </TabContent>
            </Slide>
          </Fade>
        </StyledTabPanel>
      </TabContext>
    );
  };

  return (
    <Box
      id="template-management"
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Always render tabs */}
      <ManagementTabList onChange={handleTabChange} activeTab={activeTab} isLoading={loading} />

      {/* Conditionally render content under tabs */}
      {renderTabContent()}
    </Box>
  );
};

export default TemplateManagementPageContent;
