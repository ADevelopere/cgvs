"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Box, Fade, Slide } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { templateQueryDocument } from "../hooks/template.documents";
import { useDashboardLayout } from "@/client/views/dashboard/layout/DashboardLayoutContext";
import { TabContext, TabPanel } from "@mui/lab";
import {
  TemplateManagementTabType,
  useTemplateUIStore,
} from "./useTemplateManagementStore";
import BasicInfoTab from "./BasicInfoTab";
import RecipientsManagementTab from "./recipient/RecipientsManagementTab ";
import TemplateVariableManagement from "./variables/TemplateVariableManagement";
import RecipientGroupTab from "./recipientGroup/RecipientGroupTab";
import RecipientVariableDataTab from "./data/RecipientVariableDataTab";
import { ManagementTabList } from "./ManagementTabList";
import { TemplateManagementHeader } from "./components/TemplateManagementHeader";
import { TemplateNotFoundError } from "./components/TemplateNotFoundError";
import { TemplateContentSkeleton } from "./components/TemplateContentSkeleton";
import { useAppTheme } from "@/client/contexts";

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

export const TemplateManagementPage: React.FC = () => {
  const pathParams = useParams<{ id: string }>();
  const id = pathParams?.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setDashboardSlot } = useDashboardLayout();
  const { activeTab, setActiveTab } = useTemplateUIStore();
  const [prevTabIndex, setPrevTabIndex] = React.useState(
    TAB_ORDER.indexOf(activeTab)
  );

  const {isRtl} = useAppTheme();


  // Apollo query for template data
  const {
    data: templateQuery,
    loading: apolloLoading,
    error,
  } = useQuery(templateQueryDocument, {
    variables: { id: id ? parseInt(id, 10) : 0 },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const [template, setTemplate] = useState<Graphql.Template | null>(null);
  const [updating, setUpdating] = useState(true);
  const loading = React.useMemo(
    () => updating || apolloLoading,
    [updating, apolloLoading]
  );
  const templateNotFound = React.useMemo(
    () => !template && !loading && !error,
    [template, loading, error]
  );

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

  const handleTabChange = async (
    _: React.SyntheticEvent,
    newValue: TemplateManagementTabType
  ) => {
    setPrevTabIndex(TAB_ORDER.indexOf(activeTab));
    setActiveTab(newValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newValue);
    router.push(`?${params.toString()}`);
  };

  // Calculate slide direction based on tab indices and RTL mode
  const slideDirection = React.useMemo(() => {
    const currentTabIndex = TAB_ORDER.indexOf(activeTab);
    const baseDirection = currentTabIndex > prevTabIndex ? "left" : "right";
    // Reverse direction in RTL mode
    return isRtl
      ? baseDirection === "left"
        ? "right"
        : "left"
      : baseDirection;
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
  }, [
    setDashboardSlot,
    template?.name,
    loading,
    error,
    templateNotFound,
    handleBack,
  ]);

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
        <TabPanel value="basic">
          <Fade in={activeTab === "basic"} timeout={300}>
            <Slide
              direction={slideDirection}
              in={activeTab === "basic"}
              timeout={250}
            >
              <Box>
                <BasicInfoTab template={template} />
              </Box>
            </Slide>
          </Fade>
        </TabPanel>
        <TabPanel value="variables">
          <Fade in={activeTab === "variables"} timeout={300}>
            <Slide
              direction={slideDirection}
              in={activeTab === "variables"}
              timeout={250}
            >
              <Box>
                <TemplateVariableManagement template={template} />
              </Box>
            </Slide>
          </Fade>
        </TabPanel>
        <TabPanel value="recipients">
          <Fade in={activeTab === "recipients"} timeout={300}>
            <Slide
              direction={slideDirection}
              in={activeTab === "recipients"}
              timeout={250}
            >
              <Box>
                <RecipientGroupTab template={template} />
              </Box>
            </Slide>
          </Fade>
        </TabPanel>
        <TabPanel value="recipientsManagement">
          <Fade in={activeTab === "recipientsManagement"} timeout={300}>
            <Slide
              direction={slideDirection}
              in={activeTab === "recipientsManagement"}
              timeout={250}
            >
              <Box>
                <RecipientsManagementTab template={template} />
              </Box>
            </Slide>
          </Fade>
        </TabPanel>
        <TabPanel value="data">
          <Fade in={activeTab === "data"} timeout={300}>
            <Slide
              direction={slideDirection}
              in={activeTab === "data"}
              timeout={250}
            >
              <Box>
                <RecipientVariableDataTab template={template} />
              </Box>
            </Slide>
          </Fade>
        </TabPanel>
        <TabPanel value="preview">
          <Fade in={activeTab === "preview"} timeout={300}>
            <Slide
              direction={slideDirection}
              in={activeTab === "preview"}
              timeout={250}
            >
              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  height: "100%",
                  borderColor: "red",
                }}
              >
                <h1>PreviewTab</h1>
              </Box>
            </Slide>
          </Fade>
        </TabPanel>
      </TabContext>
    );
  };

  return (
    <Box id="template-management" sx={{ width: "100%" }}>
      {/* Always render tabs */}
      <ManagementTabList
        onChange={handleTabChange}
        activeTab={activeTab}
        isLoading={loading}
      />

      {/* Conditionally render content under tabs */}
      {renderTabContent()}
    </Box>
  );
};

export default TemplateManagementPage;
