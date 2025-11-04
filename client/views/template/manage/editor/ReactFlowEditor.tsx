"use client";

import {
  ReactFlow,
  Controls,
  Background,
  Node,
  NodeChange,
  applyNodeChanges,
  OnNodesChange,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useState } from "react";
import "./other/EditorTab.module.css";
import { Box } from "@mui/material";
import DownloadImage from "./download/DownloadImage";
import { getHelperLines } from "./other/utils";
import HelperLines from "./other/HelperLines";
import { nodeTypes } from "./other/constants";
import { useAppTheme } from "@/client/contexts";
import { getTemplateImageUrl } from "../../utils/template.utils";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TextElementNodeData } from "./nodeRenderer/TextElementNode";
import { useEditorStore } from "./useEditorStore";
import { useNodeData } from "./NodeDataProvider";
import { FlowEditorProps } from "./types";

const panOnDrag = [1, 2];

const Flow: React.FC<FlowEditorProps> = ({ template, elements, container }) => {
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [elementNodes, setElementNodes] = useState<Node[]>([]);
  const [containerNode, setContainerNode] = useState<Node>({
    id: "container-node",
    type: "container",
    data: {},
    position: { x: 0, y: 0 },
    width: container.width,
    height: container.height,
    draggable: false,
    selectable: false,
    style: {
      width: container.width,
      height: container.height,
      border: "2px solid #000000",
      boxSizing: "border-box",
      backgroundColor: "transparent",
    },
  });
  const { theme } = useAppTheme();
  // const { x, y, zoom } = useViewport();
  const { setCurrentElementId } = useEditorStore();
  const { updateElementPosition, updateElementSize } = useNodeData();

  // Update container node when container data changes
  React.useEffect(() => {
    if (container) {
      const containerNode: Node = {
        id: "container-node",
        type: "container",
        data: {},
        position: { x: 0, y: 0 },
        draggable: false,
        selectable: false,
        style: {
          width: container.width,
          height: container.height,
          border: "2px solid #000000",
          boxSizing: "border-box",
          backgroundColor: "transparent",
        },
      };
      setContainerNode(containerNode);
      setNodes([containerNode, ...elementNodes]);
    }
  }, [container, setNodes]);

  // Update element nodes when elements change
  React.useEffect(() => {
    const nodes: Node[] = elements
      .map(element => {
        if (element.type === GQL.ElementType.Text) {
          const data: TextElementNodeData = {
            elementId: element.id,
          };
          const node: Node<TextElementNodeData> = {
            id: element.id.toString(),
            type: "text",
            position: {
              x: element.positionX,
              y: element.positionY,
            },
            width: element.width,
            height: element.height,
            data: data,
            connectable: false,
            resizing: true,
          };
          return node;
        }
      })
      .filter(node => node !== undefined);
    setElementNodes(nodes);
    setNodes([containerNode, ...nodes]);
  }, [elements, setNodes]);

  const [helperLineHorizontal, setHelperLineHorizontal] = useState<
    number | undefined
  >(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<
    number | undefined
  >(undefined);

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

      for (const change of changes) {
        if (change.type === "position" && change.dragging && change.position) {
          const nodeId = change.id;
          const node = nodes.find(n => n.id === nodeId);

          const maxX = container.width - (node?.measured?.width ?? 0);
          const maxY = container.height - (node?.measured?.height ?? 0);

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

        if (change.type === "position" && !change.dragging && change.position) {
          const elementId = Number.parseInt(change.id, 10);
          if (!Number.isNaN(elementId)) {
            const x = change.position.x;
            const y = change.position.y;
            setTimeout(() => {
              updateElementPosition(elementId, x, y);
            }, 0);
          }
        }

        if (change.type === "dimensions" && !change.resizing && change.dimensions) {
          const elementId = Number.parseInt(change.id, 10);
          if (!Number.isNaN(elementId)) {
            const width = change.dimensions.width;
            const height = change.dimensions.height;
            setTimeout(() => {
              updateElementSize(elementId, width, height);
            }, 0);
          }
        }

        if (change.type === "select" && change.selected) {
          const idNum = Number.parseInt(change.id, 10);
          // Defer state update to avoid updating during render
          setTimeout(() => setCurrentElementId(idNum), 0);
        }
      }

      return applyNodeChanges(changes, nodes);
    },
    [container.width, container.height, setCurrentElementId, updateElementPosition, updateElementSize]
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
  const { elementsNodeData, containerData } = useNodeData();

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
        <Flow
          template={template}
          elements={elementsNodeData}
          container={containerData}
        />
    </Box>
  );
};

export default CertificateReactFlowEditor;
