"use client";

import { FC, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import NumberTemplateVariableForm from "./forms/TemplateNumberVariableForm";
import DateTemplateVariableForm from "./forms/TemplateDateVariableForm";
import TextTemplateVariableForm from "./forms/TemplateTextVariableForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SelectTemplateVariableForm from "./forms/TemplateSelectVariableForm";
import { useAppTranslation } from "@/client/locale";
import {
  TemplateVariableType,
  TemplateVariable,
} from "@/client/graphql/generated/gql/graphql";

interface TemplateVariableModalProps {
  open: boolean;
  onClose: () => void;
  editingVariableId?: number | null;
  type: TemplateVariableType;
  templateId: number;
  variables: TemplateVariable[];
  onSave?: (data: any) => Promise<void>;
}

const TemplateVariableModal: FC<TemplateVariableModalProps> = ({
  open,
  onClose,
  editingVariableId,
  type,
  templateId,
  variables,
  onSave,
}) => {
  const strings = useAppTranslation("templateVariableTranslations");

  // Close modal when template variables are updated (indicating successful operation)
  useEffect(() => {
    if (!open) return;

    // You might want to add logic here to close modal after successful operations
    // This could be based on listening to template.variables changes or notifications
  }, [open]);

  const typeToLabelMap: Record<TemplateVariableType, string> = useMemo(
    () => ({
      TEXT: strings.textTypeLabel,
      NUMBER: strings.numberTypeLabel,
      DATE: strings.dateTypeLabel,
      SELECT: strings.selectTypeLabel,
    }),
    [
      strings.dateTypeLabel,
      strings.numberTypeLabel,
      strings.selectTypeLabel,
      strings.textTypeLabel,
    ],
  );

  const modalTitle = useMemo(
    () =>
      `${editingVariableId ? strings.editVariable : strings.createVariable} ${
        typeToLabelMap[type]
      }`,
    [
      editingVariableId,
      strings.createVariable,
      strings.editVariable,
      type,
      typeToLabelMap,
    ],
  );

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
              editingVariableID={editingVariableId}
              onDispose={onClose}
              templateId={templateId}
              variables={variables}
            />
          )}
          {type === "NUMBER" && (
            <NumberTemplateVariableForm
              editingVariableID={editingVariableId}
              onDispose={onClose}
              templateId={templateId}
              variables={variables}
            />
          )}
          {type === "SELECT" && (
            <SelectTemplateVariableForm
              editingVariableID={editingVariableId}
              onDispose={onClose}
              templateId={templateId}
              variables={variables}
            />
          )}
          {type === "DATE" && (
            <DateTemplateVariableForm
              editingVariableID={editingVariableId}
              onDispose={onClose}
              templateId={templateId}
              variables={variables}
            />
          )}
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateVariableModal;
