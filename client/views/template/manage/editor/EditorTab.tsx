"use client";

import { Box, Typography } from "@mui/material";
import ReactFlowEditor from "./ReactFlowEditor";
import EditorPaneViewController from "@/client/components/editorPane/EditorPaneViewController";
import { Template } from "@/client/graphql/generated/gql/graphql";

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

function MiscellaneousPane() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        px: 1,
      }}
      id="miscellaneous-panel"
    >
      {/* Miscellaneous Panel Content */}
    </Box>
  );
}

export default function EditorTab({ template }: { template: Template }) {
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
        content: <MiscellaneousPane />,
        buttonTooltip: "Toggle Miscellaneous Panel",
        buttonDisabled: false,
        showCollapseButtonInHeader: true,
      }}
      storageKey="templateManagementEditor"
    />
  );
}
