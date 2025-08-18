"use client";

import { FC, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import NumberTemplateVariableForm from "./forms/NumberTemplateVariableForm";
import DateTemplateVariableForm from "./forms/DateTemplateVariableForm";
import TextTemplateVariableForm from "./forms/TextTemplateVariableForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
    TemplateVariableType,
} from "@/graphql/generated/types";
import SelectTemplateVariableForm from "./forms/SelectTemplateVariableForm";

interface TemplateVariableModalProps {
    open: boolean;
    onClose: () => void;
    editingVariableID?: number;
    type: TemplateVariableType;
}

const TemplateVariableModal: FC<TemplateVariableModalProps> = ({
    open,
    onClose,
    editingVariableID,
    type,
}) => {
    const { template } = useTemplateManagement();

    // Close modal when template variables are updated (indicating successful operation)
    useEffect(() => {
        if (!open) return;

        // You might want to add logic here to close modal after successful operations
        // This could be based on listening to template.variables changes or notifications
    }, [template?.variables, open]);

    const modalTitle = `${editingVariableID ? "Edit" : "Create"} ${
        type.charAt(0).toUpperCase() + type.slice(1)
    } Variable`;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        minHeight: "400px",
                    },
                },
            }}
        >
            <DialogTitle>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6">{modalTitle}</Typography>
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            color: "text.secondary",
                        }}
                    >
                        <X size={20} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {type === "TEXT" && (
                        <TextTemplateVariableForm
                            editingVariableID={editingVariableID}
                            onDispose={onClose}
                        />
                    )}
                    {type === "NUMBER" && <NumberTemplateVariableForm
                        editingVariableID={editingVariableID}
                        onDispose={onClose}
                    />}
                    {type === "SELECT" && <SelectTemplateVariableForm
                        editingVariableID={editingVariableID}
                        onDispose={onClose}
                    />}
                    {type === "DATE" && (
                        <DateTemplateVariableForm
                            editingVariableID={editingVariableID}
                            onDispose={onClose}
                        />
                    )}
                </LocalizationProvider>
            </DialogContent>
        </Dialog>
    );
};

export default TemplateVariableModal;
