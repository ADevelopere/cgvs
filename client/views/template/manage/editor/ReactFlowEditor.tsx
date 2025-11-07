"use client";

import { ReactFlow, Controls, Background, OnNodesChange, ReactFlowProvider, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback } from "react";
import "./other/EditorTab.module.css";
import { Box, CircularProgress } from "@mui/material";
import DownloadImage from "./download/DownloadImage";
import HelperLines from "./other/HelperLines";
import { nodeTypes } from "./other/constants";
import { useAppTheme } from "@/client/contexts";
import { useApplyNodeChange } from "./hooks/useApplyNodeChange";
import { useNode } from "./NodesStateProvider";
import DownloadPdf from "./download/DownloadPdf";
import DownloadPdfExperimental from "./download/DownloadPdfExperimental";
import { useCertificateElementStates } from "./CertificateElementContext";
import { TemplateConfig } from "@/client/graphql/generated/gql/graphql";

const panOnDrag = [1, 2];

export type FlowEditorProps = {
  templateId: number;
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  config: TemplateConfig
};


const Flow: React.FC<FlowEditorProps> = ({ templateId, nodes, setNodes, config }) => {
  const { theme } = useAppTheme();
  const { helperLineHorizontal, helperLineVertical } = useNode();
  const { applyNodeChanges } = useApplyNodeChange();

  const onNodesChange: OnNodesChange = useCallback(
    changes => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
    },
    [nodes, setNodes, applyNodeChanges]
  );

  return (
    <Box
      sx={{
        height: "-webkit-fill-available",
        width: "-webkit-fill-available",
        // maxWidth: `${dimensions.width}px`,
        // maxHeight: `${dimensions.height}px`,
        background: theme.palette.background.default,
        px: 1,
      }}
      id="react-flow-editor"
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        panOnScroll
        panOnDrag={panOnDrag}
        translateExtent={[[0, 0], [config.width, config.height]]}
        minZoom={-1000} // Minimum zoom level
        // maxZoom={2} // Maximum zoom level
        // translateExtent={[
        //     [0, 0], // Top-left corner boundary
        //     [dimensions.width, dimensions.height], // Bottom-right corner boundary
        // ]}
        // Enable zooming with scroll and pinch
        zoomOnScroll={true}
        zoomOnPinch={true}
        // Fit the view to the content initially
        fitView={true}
        fitViewOptions={{
          padding: 0, // Remove padding
          minZoom: -1000, // Ensure it doesn't zoom out too much when fitting
          maxZoom: 1000, // Ensure it doesn't zoom in too much when fitting
          nodes: [{ id: "container" }],
        }}
        // Add theme-aware styling
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
        // Match React Flow's color mode with MUI's theme
        colorMode={theme.palette.mode}
        //
        onNodesChange={onNodesChange}
        elevateNodesOnSelect={false}
      >
        <Background
          color={theme.palette.text.disabled}
          style={{
            backgroundColor: theme.palette.background.paper,
          }}
        />
        {/* <MiniMap /> */}
        <Controls
          className={"controlButton"}
          style={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
          }}
        />
        <HelperLines horizontal={helperLineHorizontal} vertical={helperLineVertical} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <DownloadImage templateId={templateId} />
          <DownloadPdf templateId={templateId} />
          <DownloadPdfExperimental  templateId={templateId} />
        </Box>
      </ReactFlow>
    </Box>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FlowDebug() {
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

const CertificateReactFlowEditor: React.FC = () => {
  const { nodesInitialized, setNodes, nodes } = useNode();
  const {templateId, config: {state: configState}} = useCertificateElementStates()

  if (!nodesInitialized) {
    return <CircularProgress />;
  }

  return (
    <ReactFlowProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          height: "-webkit-fill-available",
          width: "-webkit-fill-available",
        }}
      >
        <Flow templateId={templateId} nodes={nodes} setNodes={setNodes} config={configState} />
      </Box>
    </ReactFlowProvider>
  );
};

export default CertificateReactFlowEditor;
