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
      firstPaneTitle={
        <Typography
          variant="h6"
          sx={{
            px: 2,
          }}
        >
          Add Node Panel
        </Typography>
      }
      thirdPaneTitle={
        <Typography
          variant="h6"
          sx={{ 
            px: 2,
          }}
        >
          Miscellaneous Panel
        </Typography>
      }
      showFirstPaneCollapseButtonInHeader={true}
      showThirdPaneCollapseButtonInHeader={true}
      firstPaneButtonTooltip="Toggle Add Node Panel"
      thirdPaneButtonTooltip="Toggle Miscellaneous Panel"
      firstPaneButtonDisabled={false}
      thirdPaneButtonDisabled={false}
      firstPane={<AddNodePane />}
      middlePane={<ReactFlowEditor template={template} />}
      thirdPane={<MiscellaneousPane />}
      storageKey="templateManagementEditor"
    />
  );
}
