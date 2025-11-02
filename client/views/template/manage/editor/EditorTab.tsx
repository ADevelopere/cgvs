"use client";

import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import ReactFlowEditor from "./ReactFlowEditor";
import EditorPaneViewController from "@/client/components/editorPane/EditorPaneViewController";
import { Template } from "@/client/graphql/generated/gql/graphql";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useQuery } from "@apollo/client/react";
import { templateConfigByTemplateIdQueryDocument } from "./glqDocuments";
import { TemplateConfigCreateForm } from "./form/config/TemplateConfigCreateForm";
import { MiscellaneousPanel } from "./miscellaneousPanel/MiscellaneousPanel";

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
    data: configData,
    loading: configApolloLoading,
    error: configError,
  } = useQuery(templateConfigByTemplateIdQueryDocument, {
    variables: { templateId: template.id! },
    skip: !template.id,
  });

  const [configLoading, setConfigLoading] = React.useState(true);

  const config: GQL.TemplateConfig | null | undefined = React.useMemo(() => {
    const config = configData?.templateConfigByTemplateId;
    setConfigLoading(configApolloLoading);
    return config;
  }, [configApolloLoading, configData?.templateConfigByTemplateId]);

  if (configLoading) {
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
            Add Node Panel
          </Typography>
        ),
        content: <AddNodePane />,
        buttonTooltip: "Toggle Add Node Panel",
        buttonDisabled: false,
        showCollapseButtonInHeader: true,
      }}
      middlePane={<ReactFlowEditor template={template} />}
      thirdPane={{
        title: (
          <Typography
            variant="h6"
            sx={{
              px: 2,
            }}
          >
            Miscellaneous Panel
          </Typography>
        ),
        content: <MiscellaneousPanel config={config} />,
        buttonTooltip: "Toggle Miscellaneous Panel",
        buttonDisabled: false,
        showCollapseButtonInHeader: true,
      }}
      storageKey="templateManagementEditor"
    />
  );
}
