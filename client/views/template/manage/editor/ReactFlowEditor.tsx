"use client";

import {
  ReactFlow,
  Controls,
  Background,
  Node,
  ReactFlowProvider,
  useViewport,
  NodeChange,
  applyNodeChanges,
  OnNodesChange,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import "./other/EditorTab.module.css";
import { Box } from "@mui/material";
import DownloadImage from "./download/DownloadImage";
import { getHelperLines } from "./other/utils";
import HelperLines from "./other/HelperLines";
import {   nodeTypes } from "./other/constants";
import { useAppTheme } from "@/client/contexts";
import logger from "@/client/lib/logger";

import { getTemplateImageUrl } from "../../utils/template.utils";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TextElementNodeData } from "./nodeRendere/TextElementNode";
import React from "react";

const panOnDrag = [1, 2];

// A4 landscape dimensions in pixels (297mm × 210mm at 96 DPI)
const A4_WIDTH = 1123; // 297mm * 96px/25.4mm
const A4_HEIGHT = 794; // 210mm * 96px/25.4mm

export type CertificateReactFlowEditorProps = {
  template: GQL.Template;
  elements: GQL.CertificateElementUnion[];
};

const Flow: React.FC<CertificateReactFlowEditorProps> = ({
  template,
  elements,
}) => {
  const [nodes, setNodes] = useNodesState<Node>([]);
  const { theme } = useAppTheme();
  const { x, y, zoom } = useViewport();

  React.useEffect(() => {
    const nodes: Node[] = elements.map(element => {
      if (element.base.type === GQL.ElementType.Text) {
        const data: TextElementNodeData = {
          elementId: element.base.id,
          elements: elements,
        };
        return {
          id: element.base.id.toString(),
          type: "text",
          position: {
            x: element.base.positionX,
            y: element.base.positionY,
          },
          width: element.base.width,
          height: element.base.height,
          data: data,
        };
      }
    }).filter((node) => node !== undefined);
    setNodes(nodes);
  }, [elements, setNodes]);

  const [helperLineHorizontal, setHelperLineHorizontal] = useState<
    number | undefined
  >(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    logger.log("Viewport changed:", { x, y, zoom });
  }, [x, y, zoom]);

  const [dimensions, setDimensions] = useState({
    width: A4_WIDTH,
    height: A4_HEIGHT,
  });

  useEffect(() => {
    if (template?.imageUrl) {
      const img = new Image();
      img.src = template.imageUrl;
      img.onload = () => {
        setDimensions({
          width: img.width,
          height: img.height,
        });
      };
    }
  }, [template?.imageUrl]);

  useEffect(() => {
    logger.log("Dimensions changed:", dimensions);
  }, [dimensions]);

  const customApplyNodeChanges = useCallback(
    (changes: NodeChange[], nodes: Node[]): Node[] => {
      // reset the helper lines (clear existing lines, if any)
      setHelperLineHorizontal(undefined);
      setHelperLineVertical(undefined);

      // this will be true if it's a single node being dragged inside,
      // we calculate the helper lines and snap position for the position where the node is being moved to

      const firstChange = changes[0];
      if (
        changes.length === 1 &&
        firstChange.type === "position" &&
        firstChange.dragging &&
        firstChange.position
      ) {
        const helperLines = getHelperLines(firstChange, nodes);

        // if we have a helper line, we snap the node to the helper line position
        // this is being done by manipulating the node position inside the change object
        firstChange.position.x =
          helperLines.snapPosition.x ?? firstChange.position.x;
        firstChange.position.y =
          helperLines.snapPosition.y ?? firstChange.position.y;

        // if helper lines are returned, we set them so that they can be displayed
        setHelperLineHorizontal(helperLines.horizontal);
        setHelperLineVertical(helperLines.vertical);
      }

      changes.forEach(change => {
        if (change.type === "position" && change.dragging && change.position) {
          const nodeId = change.id;
          const node = nodes.find(n => n.id === nodeId);

          const maxX = dimensions.width - (node?.measured?.width ?? 0);
          const maxY = dimensions.height - (node?.measured?.height ?? 0);

          if (change.position.x < 0) {
            change.position.x = 0;
          } else if (change.position.x > maxX) {
            change.position.x = maxX;
          }

          if (change.position.y < 0) {
            change.position.y = 0;
          } else if (change.position.y > maxY) {
            change.position.y = maxY;
          }
        }
      });

      return applyNodeChanges(changes, nodes);
    },
    [dimensions.width, dimensions.height]
  );

  const onNodesChange: OnNodesChange = useCallback(
    changes => {
      setNodes(nodes => customApplyNodeChanges(changes, nodes));
    },
    [setNodes, customApplyNodeChanges]
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
        <Controls
          className={"controlButton"}
          style={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
          }}
        />
        {/* <MiniMap /> */}
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

const CertificateReactFlowEditor: React.FC<CertificateReactFlowEditorProps> = ({
  template,
  elements,
}) => {
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
      <ReactFlowProvider>
        <Flow template={template} elements={elements} />
      </ReactFlowProvider>
    </Box>
  );
};

export default CertificateReactFlowEditor;
