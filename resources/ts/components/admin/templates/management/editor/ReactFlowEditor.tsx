import {
    ReactFlow,
    Controls,
    Background,
    Node,
    ReactFlowProvider,
    useViewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import BackgroundImageNode from "./BackgroundImageNode";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { useEffect, useState } from "react";
import "./EditorTab.module.css";
import { Box } from "@mui/material";
import DownloadImage from "./DownloadImage";
import DownloadPdf from "./DownloadPdf";
import { useAppTheme } from "@/contexts/ThemeContext";

const nodes: Node[] = [
    {
        id: "node-1",
        type: "backgroundImage",
        position: { x: 0, y: 0 },
        data: {},
    },
    {
        id: "1", // required
        position: { x: 0, y: 0 }, // required
        data: { label: "Hello" }, // required
    },
        {
        id: "12", // required
        position: { x: 5, y: 5 }, // required
        data: { label: "Hello" }, // required
    },
];

const panOnDrag = [1, 2];

const nodeTypes = {
    backgroundImage: BackgroundImageNode,
};

// A4 landscape dimensions in pixels (297mm × 210mm at 96 DPI)
const A4_WIDTH = 1123; // 297mm * 96px/25.4mm
const A4_HEIGHT = 794; // 210mm * 96px/25.4mm

function Flow() {
    const { theme } = useAppTheme();

    const { x, y, zoom } = useViewport();
    useEffect(() => {
        console.log("Viewport changed:", { x, y, zoom });
    }, [x, y, zoom]);

    const { template } = useTemplateManagement();
    const [dimensions, setDimensions] = useState({
        width: A4_WIDTH,
        height: A4_HEIGHT,
    });

    useEffect(() => {
        if (template?.background_url) {
            const img = new Image();
            img.src = template.background_url;
            img.onload = () => {
                setDimensions({
                    width: img.width,
                    height: img.height,
                });
            };
        }
    }, [template?.background_url]);

    return (
        <div
            style={{
                height: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                background: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                panOnScroll
                panOnDrag={panOnDrag}
                minZoom={0.5} // Minimum zoom level
                maxZoom={2} // Maximum zoom level
                translateExtent={[
                    [0, 0], // Top-left corner boundary
                    [dimensions.width, dimensions.height], // Bottom-right corner boundary
                ]}
                // Enable zooming with scroll and pinch
                zoomOnScroll={true}
                zoomOnPinch={true}
                // Fit the view to the content initially
                fitView={true}
                fitViewOptions={{
                    padding: 0, // Remove padding
                    minZoom: 1, // Ensure it doesn't zoom out too much when fitting
                    maxZoom: 1, // Ensure it doesn't zoom in too much when fitting
                }}
                // Add theme-aware styling
                style={{
                    backgroundColor: theme.palette.background.paper,
                }}
                // Match React Flow's color mode with MUI's theme
                colorMode={theme.palette.mode}
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
                <DownloadImage />
                <DownloadPdf />
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
            }}
        >
            <ReactFlowProvider>
                <Flow />
            </ReactFlowProvider>
        </Box>
    );
}

export default ReactFlowEditor;
