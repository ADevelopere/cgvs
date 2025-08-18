import EditorPaneViewController from "@/components/editorPane/EditorPaneViewController";
import { Box } from "@mui/material";
import ReactFlowEditor from "./ReactFlowEditor";

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

export default function EditorTab() {
    return (
        <EditorPaneViewController
            title="Editor"
            firstPaneButtonTooltip="Toggle Add Node Panel"
            thirdPaneButtonTooltip="Toggle Miscellaneous Panel"
            firstPaneButtonDisabled={false}
            thirdPaneButtonDisabled={false}
            firstPane={<LeftPane />}
            middlePane={<ReactFlowEditor />}
            thirdPane={<RightPane />}
            storageKey="templateManagementEditor"
        />
    );
}
