"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Skeleton,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import { useQuery } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { templateQueryDocument } from "../hooks/template.documents";
import { useDashboardLayout } from "@/client/views/dashboard/layout/DashboardLayoutContext";
import { useAppTranslation } from "@/client/locale";
import { TabContext, TabPanel } from "@mui/lab";
import {
  TemplateManagementTabType,
  useTemplateUIStore,
} from "./useTemplateManagementStore";
import BasicInfoTab from "./BasicInfoTab";
import RecipientsManagementTab from "./recipient/RecipientsManagementTab";
import TemplateVariableManagement from "./variables/TemplateVariableManagement";
import RecipientGroupTab from "./recipientGroup/RecipientGroupTab";
import { ManagementTabList } from "./ManagementTabList";

// Internal components
interface ManagementHeaderInternalProps {
  templateName?: string;
  isLoading: boolean;
  isError: boolean;
  onBack: () => void;
}

const ManagementHeaderInternal: React.FC<ManagementHeaderInternalProps> = ({
  templateName,
  isLoading,
  isError,
  onBack,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const strings = useAppTranslation("templateCategoryTranslations");

  const getTitleText = () => {
    if (isError) return strings.templateNotFoundTitle;
    if (isLoading) return strings.loadingTemplate;
    return "إدارة القالب:";
  };

  const getSubtitleText = () => {
    if (isError || isLoading) return "";
    return templateName || "";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { sm: "column", md: "row" },
        gap: 1,
        alignItems: "center",
        justifyContent: { sm: "center", md: "flex-start" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: { sm: "center", md: "flex-start" },
          flexGrow: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={onBack}
          sx={{
            color: "primary.main",
            "&:hover": {
              backgroundColor: "action.hover",
            },
            marginInlineStart: 2,
            marginBlock: 1,
          }}
        >
          <ArrowBackIcon
            sx={{
              transform: theme.direction === "rtl" ? "scaleX(-1)" : "none",
            }}
          />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            color: "secondary.main",
            "&:hover": {
              backgroundColor: "action.hover",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
            padding: 0,
            margin: 0,
          }}
        >
          <PrecisionManufacturingIcon />
        </IconButton>

        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h1"
          sx={{
            fontSize: {
              xs: "0.6rem",
              sm: "0.8rem",
              md: "1rem",
            },
            fontWeight: 600,
            color: "secondary.main",
          }}
        >
          {getTitleText()}
        </Typography>
        {getSubtitleText() && (
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="h1"
            sx={{
              fontSize: {
                xs: "0.6rem",
                sm: "0.8rem",
                md: "1rem",
              },
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            {getSubtitleText()}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const TemplateContentSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={100} />
    </Box>
  );
};

interface TemplateNotFoundErrorProps {
  onBack: () => void;
}

const TemplateNotFoundError: React.FC<TemplateNotFoundErrorProps> = ({
  onBack,
}) => {
  const strings = useAppTranslation("templateCategoryTranslations");

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
          {strings.templateNotFoundTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {strings.templateNotFoundMessage}
        </Typography>
        <Button
          variant="contained"
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
        >
          {strings.backToTemplates}
        </Button>
      </Paper>
    </Box>
  );
};

/**
 * Main template management page component
 * Handles template fetching, loading states, error states, and renders header/tabs before data loading
 */
export const TemplateManagementPage: React.FC = () => {
  const pathParams = useParams<{ id: string }>();
  const id = pathParams?.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setDashboardSlot } = useDashboardLayout();
  const { activeTab, setActiveTab } = useTemplateUIStore();

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
    [updating, apolloLoading],
  );
  const templateNotFound = React.useMemo(
    () => !template && !loading && !error,
    [template, loading, error],
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
    newValue: TemplateManagementTabType,
  ) => {
    setActiveTab(newValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newValue);
    router.push(`?${params.toString()}`);
  };

  // Set dashboard title slot
  useEffect(() => {
    setDashboardSlot(
      "titleRenderer",
      <ManagementHeaderInternal
        templateName={template?.name || undefined}
        isLoading={loading}
        isError={Boolean(error || templateNotFound)}
        onBack={handleBack}
      />,
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
          <BasicInfoTab template={template} />
        </TabPanel>
        <TabPanel value="variables">
          <TemplateVariableManagement template={template} />
        </TabPanel>
        <TabPanel value="recipients">
          <RecipientGroupTab template={template} />
        </TabPanel>
        <TabPanel value="recipientsManagement">
          <RecipientsManagementTab />
        </TabPanel>
        <TabPanel value="preview">
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
