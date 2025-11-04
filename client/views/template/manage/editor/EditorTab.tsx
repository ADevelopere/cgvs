"use client";

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import CertificateReactFlowEditor from "./ReactFlowEditor";
import EditorPaneViewController from "@/client/components/editorPane/EditorPaneViewController";
import { Template } from "@/client/graphql/generated/gql/graphql";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useQuery } from "@apollo/client/react";
import {
  elementsByTemplateIdQueryDocument,
  templateConfigByTemplateIdQueryDocument,
} from "./glqDocuments";
import { TemplateConfigCreateForm } from "./form/config/TemplateConfigCreateForm";
import { MiscellaneousPanel } from "./miscellaneousPanel/MiscellaneousPanel";
import { useAppTranslation } from "@/client/locale";
import logger from "@/client/lib/logger";
import { CertificateElementProvider } from "@/client/views/template/manage/editor/CertificateElementContext";
import { templateVariablesByTemplateIdQueryDocument } from "../variables/hooks/templateVariable.documents";

function AddNodePane() {
  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        px: 1,
      }}
      id="add-node-panel"
    >
      {/* Add Node Panel Content */}
    </Box>
  );
}

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
        top: 16,
        right: 16,
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "8px 12px",
        borderRadius: "4px",
        boxShadow: 3,
      }}
    >
      {loading ? <CircularProgress size={24} /> : null}
    </Box>
  );
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

  React.useEffect(() => {
    logger.info("EditorTab: Loaded elements", {
      elements: elementsData?.elementsByTemplateId,
    });
  }, [elementsData?.elementsByTemplateId]);

  const elements: GQL.CertificateElementUnion[] = React.useMemo(() => {
    const elementsList = elementsData?.elementsByTemplateId || [];
    setElementsLoading(elementsApolloLoading);
    return elementsList;
  }, [elementsApolloLoading, elementsData?.elementsByTemplateId]);

  // template variables

  const { data: variablesData } = useQuery(
    templateVariablesByTemplateIdQueryDocument,
    {
      variables: { templateId: template.id },
      skip: !template.id,
      fetchPolicy: "cache-first",
    }
  );

  const variables: GQL.TemplateVariable[] = React.useMemo(
    () => variablesData?.templateVariablesByTemplateId || [],
    [variablesData]
  );

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
      <CertificateElementProvider
        templateId={template.id}
        elements={elements}
        templateConfig={templateConfig}
        variables={variables}
      >
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
            content: <AddNodePane />,
            buttonTooltip: "Toggle Add Node Panel",
            buttonDisabled: false,
            showCollapseButtonInHeader: true,
          }}
          middlePane={
            <CertificateReactFlowEditor
              template={template}
              elements={elements}
            />
          }
          thirdPane={{
            title: (
              <Typography
                variant="h6"
                sx={{
                  px: 2,
                }}
              >
                {strings.miscellaneousPane}
              </Typography>
            ),
            content: <MiscellaneousPanel elements={elements} />,
            buttonTooltip: "Toggle Miscellaneous Panel",
            buttonDisabled: false,
            showCollapseButtonInHeader: true,
          }}
          storageKey="templateManagementEditor"
        />
      </CertificateElementProvider>
      <FloatingLoadingIndicator loading={configLoading || elementsLoading} />
    </>
  );
};
