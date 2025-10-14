"use client";

import React, { useMemo } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import { useRecipientGroupManagement } from "@/client/contexts/recipientGroup";
import { useTemplateManagement } from "@/client/views/template/TemplateManagementContext";
import { useAppTranslation } from "@/client/locale";
import { format } from "date-fns";

const GroupInfoDialog: React.FC = () => {
    const strings = useAppTranslation("recipientGroupTranslations");
    const { infoDialogOpen, closeInfoDialog, selectedGroupId } =
        useRecipientGroupManagement();
    const { template } = useTemplateManagement();

    const selectedGroup = useMemo(() => {
        if (!selectedGroupId || !template?.recipientGroups) return null;
        return template.recipientGroups.find((g) => g.id === selectedGroupId);
    }, [selectedGroupId, template]);

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "-";
        try {
            return format(new Date(date), "PPP");
        } catch {
            return "-";
        }
    };

    return (
        <Dialog open={infoDialogOpen} onClose={closeInfoDialog} maxWidth="sm" fullWidth>
            <DialogTitle>{strings.groupInfoTitle}</DialogTitle>
            <DialogContent>
                {selectedGroup && (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                {strings.name}
                            </Typography>
                            <Typography variant="body1">
                                {selectedGroup.name}
                            </Typography>
                        </Box>

                        {selectedGroup.description && (
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    {strings.description}
                                </Typography>
                                <Typography variant="body1">
                                    {selectedGroup.description}
                                </Typography>
                            </Box>
                        )}

                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                {strings.date}
                            </Typography>
                            <Typography variant="body1">
                                {formatDate(selectedGroup.date)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                {strings.studentCount}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                                <Chip
                                    label={selectedGroup.studentCount || 0}
                                    color="primary"
                                    size="small"
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                {strings.createdAt}
                            </Typography>
                            <Typography variant="body1">
                                {formatDate(selectedGroup.createdAt)}
                            </Typography>
                        </Box>

                        {selectedGroup.updatedAt && (
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    {strings.updatedAt}
                                </Typography>
                                <Typography variant="body1">
                                    {formatDate(selectedGroup.updatedAt)}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeInfoDialog}>{strings.close}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default GroupInfoDialog;

