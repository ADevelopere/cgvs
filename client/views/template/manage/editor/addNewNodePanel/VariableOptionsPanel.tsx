import React, { useMemo, useState, useCallback } from "react";
import { Stack, Button, Typography } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import * as Icons from "@mui/icons-material";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { CreateTextElementWrapper } from "./wrappers/CreateTextElementWrapper";
import { CreateDateElementWrapper } from "./wrappers/CreateDateElementWrapper";
import { CreateNumberElementWrapper } from "./wrappers/CreateNumberElementWrapper";
import { useCertificateElementStates } from "../context/CertificateElementContext";

export type VariableOptionsPanelProps = {
  compact: boolean;
  style: React.CSSProperties;
  templateId: number;
};

type DialogType = GQL.ElementType;

export type VariableOptionItem = {
  label: string;
  icon: React.ReactNode;
  varType: GQL.TemplateVariableType;
  certElementType: GQL.ElementType;
  variableId?: number | null;
};

export const VariableOptionsPanel: React.FC<VariableOptionsPanelProps> = ({ compact, style, templateId }) => {
  const { templateEditorTranslations: t } = useAppTranslation();
  const { textVariables, dateVariables, numberVariables, selectVariables } = useCertificateElementStates();

  const [selectedOption, setSelectedOption] = useState<VariableOptionItem | undefined>(undefined);
  const [dialogType, setDialogType] = useState<DialogType | undefined>(undefined);

  const handleOpenForField = useCallback((option: VariableOptionItem) => {
    setSelectedOption(option);
    setDialogType(option.certElementType);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogType(undefined);
    setSelectedOption(undefined);
  }, []);

  const options: VariableOptionItem[] = useMemo(
    () => [
      {
        label: t.addNodePanel.variableOptions.text,
        icon: <Icons.TextFields />,
        varType: GQL.TemplateVariableType.Text,
        certElementType: GQL.ElementType.Text,
        variableId: textVariables.length > 0 ? textVariables[0].id : undefined,
      },
      {
        label: t.addNodePanel.variableOptions.date,
        icon: <Icons.CalendarToday />,
        varType: GQL.TemplateVariableType.Date,
        certElementType: GQL.ElementType.Date,
        variableId: dateVariables.length > 0 ? dateVariables[0].id : undefined,
      },
      {
        label: t.addNodePanel.variableOptions.number,
        icon: <Icons.Calculate />,
        varType: GQL.TemplateVariableType.Number,
        certElementType: GQL.ElementType.Number,
        variableId: numberVariables.length > 0 ? numberVariables[0].id : undefined,
      },
      {
        label: t.addNodePanel.variableOptions.select,
        icon: <Icons.ListAlt />,
        varType: GQL.TemplateVariableType.Select,
        certElementType: GQL.ElementType.Text,
        variableId: selectVariables.length > 0 ? selectVariables[0].id : undefined,
      },
    ],
    [t, textVariables, dateVariables, numberVariables, selectVariables, selectedOption, dialogType]
  );

  return (
    <Stack spacing={2} style={style}>
      {compact && <Typography variant="subtitle1">{t.addNodePanel.variableOptions.title}</Typography>}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {options.map(opt => (
          <Button
            key={opt.label}
            variant="outlined"
            startIcon={opt.icon}
            onClick={() => handleOpenForField(opt)}
            disabled={!opt.variableId}
          >
            {opt.label}
          </Button>
        ))}
      </Stack>

      {/* Text element creation dialog for text/select variables */}
      {dialogType === GQL.ElementType.Text &&
        selectedOption?.certElementType === GQL.ElementType.Text &&
        selectedOption.variableId && (
          <CreateTextElementWrapper
            templateId={templateId}
            initialTemplateTextVariable={
              selectedOption.varType === GQL.TemplateVariableType.Text
                ? { variableId: selectedOption.variableId }
                : undefined
            }
            initialTemplateSelectVariable={
              selectedOption.varType === GQL.TemplateVariableType.Select
                ? { variableId: selectedOption.variableId }
                : undefined
            }
            initialElementName={selectedOption.label}
            open={dialogType === GQL.ElementType.Text}
            onClose={handleCloseDialog}
          />
        )}

      {/* Date element creation dialog for date variables */}
      {dialogType === GQL.ElementType.Date &&
        selectedOption?.certElementType === GQL.ElementType.Date &&
        selectedOption.variableId && (
          <CreateDateElementWrapper
            templateId={templateId}
            initialTemplateDateVariable={{ variableId: selectedOption.variableId }}
            initialElementName={selectedOption.label}
            open={dialogType === GQL.ElementType.Date}
            onClose={handleCloseDialog}
          />
        )}

      {/* Number element creation dialog for number variables */}
      {dialogType === GQL.ElementType.Number &&
        selectedOption?.certElementType === GQL.ElementType.Number &&
        selectedOption.variableId && (
          <CreateNumberElementWrapper
            templateId={templateId}
            initialNumberVariable={{ variableId: selectedOption.variableId }}
            initialElementName={selectedOption.label}
            open={dialogType === GQL.ElementType.Number}
            onClose={handleCloseDialog}
          />
        )}
    </Stack>
  );
};

export default VariableOptionsPanel;
