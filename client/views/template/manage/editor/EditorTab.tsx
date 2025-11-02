"use client";

import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
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

function AddNodePane() {
  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        px: 1,
      }}
      id="add-node-panel"
    >
      {/* Add Node Panel Content */}
    </Box>
  );
}

export default function EditorTab({ template }: { template: Template }) {
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
    fetchPolicy: "cache-first",
  });

  const config: GQL.TemplateConfig | null | undefined = React.useMemo(() => {
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
    const elems = elementsData?.elementsByTemplateId || [];
    setElementsLoading(elementsApolloLoading);
    return elems;
  }, [elementsApolloLoading, elementsData?.elementsByTemplateId]);

  if (configLoading || elementsLoading) {
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

  if (!configLoading && !config) {
    return <TemplateConfigCreateForm template={template} />;
  }

  if (configError || !config) {
    return <div>Error loading template config: {configError?.message}</div>;
  }

  if (elementsError) {
    return <div>Error loading elements: {elementsError.message}</div>;
  }

  return (
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
      middlePane={<CertificateReactFlowEditor template={template} elements={elements} />}
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
        content: <MiscellaneousPanel config={config} elements={elements} />,
        buttonTooltip: "Toggle Miscellaneous Panel",
        buttonDisabled: false,
        showCollapseButtonInHeader: true,
      }}
      storageKey="templateManagementEditor"
    />
  );
}
