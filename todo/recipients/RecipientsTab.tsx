"use client";

import { Grid, Paper, Stack, Box, IconButton, Tooltip } from "@mui/material";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import ImportExport from "./ImportExport";
import RecipientList from "./RecipientList";
import RecipientsHeader from "./RecipientsHeader";
import NewRecipientPanel from "./NewRecipientPanel";
import { useRecipientPanelVisibility } from "./useRecipientPanelVisibility";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function RecipientsTab() {
    const { template } = useTemplateManagement();
    const { isVisible, togglePanel } = useRecipientPanelVisibility();

    if (!template) {
        return null;
    }

    return (
        <Stack spacing={3} sx={{ p: 2 }}>
            <Grid container spacing={3}>
                {/* Main Content - Responsive width */}
                <Grid size={{ xs: 12, md: isVisible ? 8 : 11 }}>
                    <Paper sx={{ p: 2 }}>
                        <RecipientsHeader />
                        <RecipientList templateId={template.id} />
                    </Paper>

                    <Box sx={{ mt: 3 }}>
                        <ImportExport templateId={template.id} />
                    </Box>
                </Grid>

                {/* Toggle Button */}
                <Box
                    sx={{
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Tooltip title={isVisible ? "Hide panel" : "Show panel"}>
                        <IconButton onClick={togglePanel} size="small">
                            {isVisible ? (
                                <ChevronRightIcon />
                            ) : (
                                <ChevronLeftIcon />
                            )}
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Creation Panel - Hidden on mobile, toggleable on desktop */}
                <Grid
                    size={{ xs: 12, md: 3 }}
                    sx={{
                        display: isVisible ? "block" : "none",
                        transition: "all 0.3s ease-in-out",
                    }}
                >
                    <NewRecipientPanel />
                </Grid>
            </Grid>
        </Stack>
    );
}
