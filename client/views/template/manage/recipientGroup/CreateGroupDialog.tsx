"use client";

import React, { useState, useCallback } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRecipientGroupDialogs } from "./hooks/useRecipientGroupDialogs";
import { useRecipientGroupOperations } from "./hooks/useRecipientGroupOperations";
import { useAppTranslation } from "@/client/locale";

interface CreateGroupDialogProps {
    templateId: number;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({ templateId }) => {
    const strings = useAppTranslation("recipientGroupTranslations");
    const { createDialogOpen, closeCreateDialog } = useRecipientGroupDialogs();
    const { createGroup } = useRecipientGroupOperations();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date | null>(null);
    const [nameError, setNameError] = useState("");

    const handleClose = useCallback(() => {
        setName("");
        setDescription("");
        setDate(null);
        setNameError("");
        closeCreateDialog();
    }, [closeCreateDialog]);

    const handleSubmit = useCallback(async () => {
        if (!name.trim()) {
            setNameError(strings.nameRequired);
            return;
        }

        if (!templateId) {
            return;
        }

        await createGroup({
            templateId: templateId,
            name: name.trim(),
            description: description.trim() || null,
            date: date || null,
        });
    }, [name, description, date, templateId, createGroup, handleClose, strings]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={createDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{strings.createGroupTitle}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            label={strings.name}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (e.target.value.trim()) {
                                    setNameError("");
                                }
                            }}
                            error={!!nameError}
                            helperText={nameError}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label={strings.description}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <DatePicker
                            label={strings.date}
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                },
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        {strings.cancel}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                    >
                        {strings.createGroup}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default CreateGroupDialog;

