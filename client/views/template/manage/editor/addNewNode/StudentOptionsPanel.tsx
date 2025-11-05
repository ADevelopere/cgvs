import React from "react";
import { Stack, Button, Typography } from "@mui/material";
import { useAppTranslation } from "@/client/locale";

export const StudentOptionsPanel: React.FC = () => {
  const { templateEditorTranslations: t } = useAppTranslation();

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">{t.addNodePanel.studentOptions.title}</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Button variant="outlined">{t.addNodePanel.studentOptions.name}</Button>
        <Button variant="outlined">{t.addNodePanel.studentOptions.email}</Button>
        <Button variant="outlined">{t.addNodePanel.studentOptions.dateOfBirth}</Button>
        <Button variant="outlined">{t.addNodePanel.studentOptions.age}</Button>
        <Button variant="outlined">{t.addNodePanel.studentOptions.gender}</Button>
        <Button variant="outlined">{t.addNodePanel.studentOptions.nationality}</Button>
        <Button variant="outlined">{t.addNodePanel.studentOptions.country}</Button>
      </Stack>
    </Stack>
  );
};

export default StudentOptionsPanel;
