import React from "react";
import { Stack, Button, Typography } from "@mui/material";
import { useAppTranslation } from "@/client/locale";

export const VariableOptionsPanel: React.FC = () => {
  const { templateEditorTranslations: t } = useAppTranslation();

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">{t.addNodePanel.variableOptions.title}</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Button variant="outlined">{t.addNodePanel.variableOptions.text}</Button>
        <Button variant="outlined">{t.addNodePanel.variableOptions.date}</Button>
        <Button variant="outlined">{t.addNodePanel.variableOptions.number}</Button>
      </Stack>
    </Stack>
  );
};

export default VariableOptionsPanel;
