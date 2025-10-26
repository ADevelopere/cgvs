"use client";

import { Box } from "@mui/material";
import ReactFlowEditor from "./ReactFlowEditor";
import EditorPaneViewController from "@/client/components/editorPane/EditorPaneViewController";
import { Template } from "@/client/graphql/generated/gql/graphql";

function LeftPane() {
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
      {/* Add Node Panel */}
      <h2>Add Node Panel</h2>
    </Box>
  );
}

function RightPane() {
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
      {/* Miscellaneous Panel */}
      <h2>Miscellaneous Panel</h2>
    </Box>
  );
}

export default function EditorTab({ template }: { template: Template }) {
  return (
    <EditorPaneViewController
      title="Editor"
      firstPaneButtonTooltip="Toggle Add Node Panel"
      thirdPaneButtonTooltip="Toggle Miscellaneous Panel"
      firstPaneButtonDisabled={false}
      thirdPaneButtonDisabled={false}
      firstPane={<LeftPane />}
      middlePane={<ReactFlowEditor template={template} />}
      thirdPane={<RightPane />}
      storageKey="templateManagementEditor"
    />
  );
}
