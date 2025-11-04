"use client";

import {
  ReactFlow,
  Controls,
  Background,
  OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback } from "react";
import "./other/EditorTab.module.css";
import { Box } from "@mui/material";
import DownloadImage from "./download/DownloadImage";
import HelperLines from "./other/HelperLines";
import { nodeTypes } from "./other/constants";
import { useAppTheme } from "@/client/contexts";
import { getTemplateImageUrl } from "../../utils/template.utils";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useNodeData } from "./NodeDataProvider";
import { FlowEditorProps } from "./types";
import { useApplyNodeChange } from "./useApplyNodeChange";

const panOnDrag = [1, 2];


const Flow: React.FC<FlowEditorProps> = ({ template, nodes, setNodes }) => {
  const { theme } = useAppTheme();
  const { helperLineHorizontal, helperLineVertical } = useNodeData();
  const { applyNodeChanges } = useApplyNodeChange();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nodes) => applyNodeChanges(changes, nodes));
    },
    [setNodes, applyNodeChanges]
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
          nodes: [{ id: "node-1" }],
        }}
        // Add theme-aware styling
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
        // Match React Flow's color mode with MUI's theme
        colorMode={theme.palette.mode}
        //
        onNodesChange={onNodesChange}
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
        <HelperLines
          horizontal={helperLineHorizontal}
          vertical={helperLineVertical}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <DownloadImage imageUrl={getTemplateImageUrl(template, true)} />
          {/* <DownloadPdf /> */}
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

export type CertificateReactFlowEditorProps = {
  template: GQL.Template;
  elements: GQL.CertificateElementUnion[];
};

const CertificateReactFlowEditor: React.FC<CertificateReactFlowEditorProps> = ({
  template,
}) => {
  const { nodes, setNodes } = useNodeData();

  return (
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
      <Flow template={template} nodes={nodes} setNodes={setNodes} />
    </Box>
  );
};

export default CertificateReactFlowEditor;
