import React, { useMemo } from "react";
import { Stack, Button, Typography } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import * as Icons from "@mui/icons-material";

export type VariableOptionsPanelProps = {
  compact: boolean;
  style: React.CSSProperties;
};
export type VariableOptionItem = {
  label: string;
  icon: React.ReactNode;
};
export const VariableOptionsPanel: React.FC<VariableOptionsPanelProps> = ({ compact, style }) => {
  const { templateEditorTranslations: t } = useAppTranslation();
  const options: VariableOptionItem[] = useMemo(
    () => [
      { label: t.addNodePanel.variableOptions.text, icon: <Icons.TextFields /> },
      { label: t.addNodePanel.variableOptions.date, icon: <Icons.CalendarToday /> },
      { label: t.addNodePanel.variableOptions.number, icon: <Icons.Calculate /> },
    ],
    [t]
  );

  return (
    <Stack spacing={2} style={style}>
      {compact && <Typography variant="subtitle1">{t.addNodePanel.variableOptions.title}</Typography>}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {options.map((opt) => (
          <Button key={opt.label} variant="outlined" startIcon={opt.icon}>
            {opt.label}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default VariableOptionsPanel;
