"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import CertificateReactFlowEditor, {
  ContainerNodeData,
  ElementNodeData,
} from "./ReactFlowEditor";
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
import {
  CertificateElemenetProvider,
  useCertificateElementContext,
} from "@/client/views/template/manage/editor/CertificateElementContext";
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

  const tempalteConfig: GQL.TemplateConfig | null | undefined =
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
    const elems = elementsData?.elementsByTemplateId || [];
    setElementsLoading(elementsApolloLoading);
    return elems;
  }, [elementsApolloLoading, elementsData?.elementsByTemplateId]);

  const elementsNodeData: ElementNodeData[] = React.useMemo(() => {
    return elements.map(el => ({
      id: el.base.id,
      type: el.base.type,
      positionX: el.base.positionX,
      positionY: el.base.positionY,
      width: el.base.width,
      height: el.base.height,
    }));
  }, [elements]);

  // template variables

  const { data: variablesData } = useQuery(
    templateVariablesByTemplateIdQueryDocument,
    {
      variables: { templateId: template.id },
      skip: !template.id,
      fetchPolicy: "cache-first",
    }
  );

  const variables: GQL.TemplateVariable[] =React. useMemo(
    () => variablesData?.templateVariablesByTemplateId || [],
    [variablesData]
  );

  // if (configLoading || elementsLoading) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100%",
  //       }}
  //     >
  //       <CircularProgress size={24} />
  //     </div>
  //   );
  // }

  if (!configLoading && !tempalteConfig) {
    return <TemplateConfigCreateForm template={template} />;
  }

  if (configError || !tempalteConfig) {
    return <div>Error loading template config: {configError?.message}</div>;
  }

  if (elementsError) {
    return <div>Error loading elements: {elementsError.message}</div>;
  }

  return (
    <CertificateElemenetProvider
      templateId={template.id}
      elements={elements}
      tempalteConfig={tempalteConfig}
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
            elements={elementsNodeData}
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
    </CertificateElemenetProvider>
  );
};
