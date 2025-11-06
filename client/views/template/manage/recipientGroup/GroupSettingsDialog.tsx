"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRecipientGroupDialogs } from "./hooks/useRecipientGroupDialogs";
import { useRecipientGroupOperations } from "./hooks/useRecipientGroupOperations";
import { useAppTranslation } from "@/client/locale";
import { TemplateRecipientGroup } from "@/client/graphql/generated/gql/graphql";

interface GroupSettingsDialogProps {
  groups: TemplateRecipientGroup[];
}

const GroupSettingsDialog: React.FC<GroupSettingsDialogProps> = ({ groups }) => {
  const { recipientGroupTranslations: strings } = useAppTranslation();
  const { settingsDialogOpen, closeSettingsDialog, selectedGroupId } = useRecipientGroupDialogs();
  const { updateGroup } = useRecipientGroupOperations();

  const selectedGroup: TemplateRecipientGroup | null = useMemo(() => {
    if (!selectedGroupId) return null;
    return groups.find(g => g.id === selectedGroupId) || null;
  }, [selectedGroupId, groups]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (selectedGroup) {
      setName(selectedGroup.name || "");
      setDescription(selectedGroup.description || "");
      setDate(selectedGroup.date ? new Date(selectedGroup.date) : null);
    }
  }, [selectedGroup]);

  const handleClose = useCallback(() => {
    setNameError("");
    closeSettingsDialog();
  }, [closeSettingsDialog]);

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      setNameError(strings.nameRequired);
      return;
    }

    if (!selectedGroupId || !selectedGroup) {
      return;
    }

    // Check if any values have actually changed
    const trimmedName = name.trim();
    const trimmedDescription = description.trim() || null;
    const hasNameChanged = trimmedName !== selectedGroup.name;
    const hasDescriptionChanged = trimmedDescription !== (selectedGroup.description || null);
    const hasDateChanged = date?.getTime() !== (selectedGroup.date ? new Date(selectedGroup.date).getTime() : null);

    // If nothing changed, just close the dialog without making a request
    if (!hasNameChanged && !hasDescriptionChanged && !hasDateChanged) {
      handleClose();
      return;
    }

    await updateGroup({
      id: selectedGroupId,
      name: trimmedName,
      description: trimmedDescription,
      date: date || null,
    });
  }, [name, description, date, selectedGroupId, selectedGroup, updateGroup, handleClose, strings]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={settingsDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{strings.updateGroupTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              required
              fullWidth
              label={strings.name}
              value={name}
              onChange={e => {
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
              onChange={e => setDescription(e.target.value)}
            />
            <DatePicker
              label={strings.date}
              value={date}
              onChange={newValue => setDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{strings.cancel}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {strings.save}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default GroupSettingsDialog;
