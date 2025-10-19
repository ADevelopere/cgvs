"use client";

import { FC, useCallback, useMemo } from "react";
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
import {
  TemplateVariableCreateInputUnion,
  TemplateVariableUpdateInputUnion,
  useTemplateVariableOperations,
} from "./hooks/useTemplateVariableOperations";

interface TemplateVariableModalProps {
  open: boolean;
  onClose: () => void;
  editingVariableId?: number | null;
  type: TemplateVariableType;
  templateId: number;
  variables: TemplateVariable[];
}

const TemplateVariableModal: FC<TemplateVariableModalProps> = ({
  open,
  onClose,
  editingVariableId,
  type,
  templateId,
  variables,
}) => {
  const strings = useAppTranslation("templateVariableTranslations");
  const operations = useTemplateVariableOperations();

  // Create callbacks for forms
  const onCreate = useCallback(
    async (data: TemplateVariableCreateInputUnion) => {
      await operations.createVariable(type, data);
      onClose();
    },
    [operations, type, onClose]
  );

  const onUpdate = useCallback(
    async (data: TemplateVariableUpdateInputUnion) => {
      await operations.updateVariable(type, data);
      onClose();
    },
    [operations, type, onClose]
  );

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
    ]
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
    ]
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
              editingVariableID={editingVariableId || undefined}
              templateId={templateId}
              variables={variables}
              onCreate={onCreate}
              onUpdate={onUpdate}
            />
          )}
          {type === "NUMBER" && (
            <NumberTemplateVariableForm
              editingVariableID={editingVariableId || undefined}
              templateId={templateId}
              variables={variables}
              onCreate={onCreate}
              onUpdate={onUpdate}
            />
          )}
          {type === "SELECT" && (
            <SelectTemplateVariableForm
              editingVariableID={editingVariableId || undefined}
              templateId={templateId}
              variables={variables}
              onCreate={onCreate}
              onUpdate={onUpdate}
            />
          )}
          {type === "DATE" && (
            <DateTemplateVariableForm
              editingVariableID={editingVariableId || undefined}
              templateId={templateId}
              variables={variables}
              onCreate={onCreate}
              onUpdate={onUpdate}
            />
          )}
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateVariableModal;
