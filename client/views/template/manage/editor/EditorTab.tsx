"use client";

import React from "react";
import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import CertificateReactFlowEditor from "./ReactFlowEditor";
import EditorPaneViewController from "@/client/components/editorPane/EditorPaneViewController";
import { Template } from "@/client/graphql/generated/gql/graphql";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { ApolloClient } from "@apollo/client";
import {
  elementsByTemplateIdQueryDocument,
  templateConfigByTemplateIdQueryDocument,
} from "./glqDocuments";
import { TemplateConfigCreateForm } from "./form/config/TemplateConfigCreateForm";
import { MiscellaneousPanel } from "./miscellaneousPanel/MiscellaneousPanel";
import { useAppTranslation } from "@/client/locale";
import { useQuery, useApolloClient } from "@apollo/client/react";
import { NodesStoreProvider } from "./NodesStateProvider";
import { CertificateElementProvider } from "./CertificateElementContext";
import AddNodePanel from "./addNewNode/AddNodePanel";

export type EditorTabProps = {
  template: Template;
};

const FloatingLoadingIndicator: React.FC<{ loading: boolean }> = ({
  loading,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        right: 16,
        zIndex: 1000,
        backgroundColor:loading?  "background.paper" : "transparent",
        padding: loading? "8px 12px" : 0,
        borderRadius: loading? "4px" : 0,
        boxShadow: loading? 3 : 0,
        display: loading? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? <CircularProgress size={24} /> : null}
    </Box>
  );
};

/**
 * Evicts the cache for template-related queries to refresh data.
 */
const refresh = (apolloClient: ApolloClient, templateId: number): void => {
  apolloClient.cache.evict({
    id: "ROOT_QUERY",
    fieldName: "templateConfigByTemplateId",
    args: { templateId },
  });
  apolloClient.cache.evict({
    id: "ROOT_QUERY",
    fieldName: "elementsByTemplateId",
    args: { templateId },
  });
  apolloClient.cache.evict({
    id: "ROOT_QUERY",
    fieldName: "templateVariablesByTemplateId",
    args: { templateId },
  });
  apolloClient.cache.gc();
};

export const EditorTab: React.FC<EditorTabProps> = ({ template }) => {
  const {
    templateEditorTranslations: { templateEditorPane: strings },
  } = useAppTranslation();
  const [configLoading, setConfigLoading] = React.useState(true);
  const [elementsLoading, setElementsLoading] = React.useState(true);

  // ========== Template Config ==========
  const {
    data: configData,
    loading: configApolloLoading,
    error: configError,
  } = useQuery(templateConfigByTemplateIdQueryDocument, {
    variables: { templateId: template.id },
    fetchPolicy: "cache-and-network",
  });

  const templateConfig: GQL.TemplateConfig | null | undefined =
    React.useMemo(() => {
      const config = configData?.templateConfigByTemplateId;
      setConfigLoading(configApolloLoading);
      return config;
    }, [configApolloLoading, configData?.templateConfigByTemplateId]);

  // =========== Elements =============

  const {
    data: elementsData,
    loading: elementsApolloLoading,
    error: elementsError,
  } = useQuery(elementsByTemplateIdQueryDocument, {
    variables: { templateId: template.id },
    fetchPolicy: "cache-first",
  });

  const elements: GQL.CertificateElementUnion[] = React.useMemo(() => {
    const elementsList = elementsData?.elementsByTemplateId || [];
    setElementsLoading(elementsApolloLoading);
    return elementsList;
  }, [elementsApolloLoading, elementsData?.elementsByTemplateId]);

  // template variables

  const apolloClient = useApolloClient();
  // function to evict cache for all quries with same query vars used above
  const refreshData = React.useCallback(() => {
    refresh(apolloClient, template.id);
  }, [apolloClient, template.id]);

  if (!configLoading && !templateConfig) {
    return <TemplateConfigCreateForm template={template} />;
  }

  if ((configError || !templateConfig) && !configLoading) {
    return <div>Error loading template config: {configError?.message}</div>;
  }

  if (elementsError) {
    return <div>Error loading elements: {elementsError.message}</div>;
  }

  if (!templateConfig) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress size={24} />
      </div>
    );
  }

  return (
    <>
      <NodesStoreProvider templateId={template.id}>
        <CertificateElementProvider templateId={template.id}>
          <EditorPaneViewController
            firstPane={{
              title: (
                <Typography
                  variant="h6"
                  sx={{
                    px: 2,
                  }}
                >
                  {strings.addNodePane}
                </Typography>
              ),
              content: ({collapsed}) => (<AddNodePanel compact={collapsed} />),
              buttonTooltip: "Toggle Add Node Panel",
              buttonDisabled: false,
              showCollapseButtonInHeader: true,
              minRatio: 0.15,
            }}
            middlePane={<CertificateReactFlowEditor />}
            thirdPane={{
              title: (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      px: 2,
                    }}
                  >
                    {strings.miscellaneousPane}
                  </Typography>
                  <IconButton
                    onClick={refreshData}
                    size="small"
                    sx={{ ml: 1 }}
                    title="Refresh Data"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
              ),
              content: <MiscellaneousPanel elements={elements} templateConfig={templateConfig} />,
              buttonTooltip: "Toggle Miscellaneous Panel",
              buttonDisabled: false,
              showCollapseButtonInHeader: true,
              minRatio: 0.15,
            }}
            storageKey="templateManagementEditor"
          />
          <FloatingLoadingIndicator
            loading={configLoading || elementsLoading}
          />
        </CertificateElementProvider>
      </NodesStoreProvider>
    </>
  );
};
