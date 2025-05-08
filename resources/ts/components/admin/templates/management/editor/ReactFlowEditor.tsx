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
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { useCallback, useEffect, useState } from "react";
import "./other/EditorTab.module.css";
import { Box } from "@mui/material";
import DownloadImage from "./download/DownloadImage";
import DownloadPdf from "./download/DownloadPdf";
import { useAppTheme } from "@/contexts/ThemeContext";
import { getHelperLines } from "./other/utils";
import HelperLines from "./other/HelperLines";
import { initialNodes, nodeTypes } from "./other/constants";

// Logger utility
const logger = {
    enabled: process.env.NODE_ENV === "development" && false,
    log: (...args: any[]) => {
        if (logger.enabled) {
            console.log(...args);
        }
    },
    error: (...args: any[]) => {
        if (logger.enabled) {
            console.error(...args);
        }
    },
};

const panOnDrag = [1, 2];

// A4 landscape dimensions in pixels (297mm × 210mm at 96 DPI)
const A4_WIDTH = 1123; // 297mm * 96px/25.4mm
const A4_HEIGHT = 794; // 210mm * 96px/25.4mm

function Flow() {
    const [nodes, setNodes] = useNodesState(initialNodes);
    const { theme } = useAppTheme();
    const { x, y, zoom } = useViewport();

    const [helperLineHorizontal, setHelperLineHorizontal] = useState<
        number | undefined
    >(undefined);
    const [helperLineVertical, setHelperLineVertical] = useState<
        number | undefined
    >(undefined);

    useEffect(() => {
        logger.log("Viewport changed:", { x, y, zoom });
    }, [x, y, zoom]);

    const { template } = useTemplateManagement();
    const [dimensions, setDimensions] = useState({
        width: A4_WIDTH,
        height: A4_HEIGHT,
    });

    useEffect(() => {
        if (template?.image_url) {
            const img = new Image();
            img.src = template.image_url;
            img.onload = () => {
                setDimensions({
                    width: img.width,
                    height: img.height,
                });
            };
        }
    }, [template?.image_url]);

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

            changes.forEach((change) => {
                if (
                    change.type === "position" &&
                    change.dragging &&
                    change.position
                ) {
                    const nodeId = change.id;
                    const node = nodes.find((n) => n.id === nodeId);

                    const maxX =
                        dimensions.width - (node?.measured?.width ?? 0);
                    const maxY =
                        dimensions.height - (node?.measured?.height ?? 0);

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
        [dimensions.width, dimensions.height],
    );

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            // @ts-ignore
            setNodes((nodes) => customApplyNodeChanges(changes, nodes));
        },
        [setNodes, customApplyNodeChanges],
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
                    nodes: [{id: 'node-1'}],
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
                <DownloadImage />
                <DownloadPdf />
            </ReactFlow>
        </Box>
    );
}

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

function ReactFlowEditor() {
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
                <Flow />
            </ReactFlowProvider>
        </Box>
    );
}

export default ReactFlowEditor;
