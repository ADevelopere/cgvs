import React from "react";
import { Stack, Button, Typography } from "@mui/material";
import { useAppTranslation } from "@/client/locale";

export const CertificateOptionsPanel: React.FC = () => {
  const { templateEditorTranslations: t } = useAppTranslation();

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">{t.addNodePanel.certificateOptions.title}</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Button variant="outlined">{t.addNodePanel.certificateOptions.verificationCode}</Button>
        <Button variant="outlined">{t.addNodePanel.certificateOptions.qrCode}</Button>
      </Stack>
    </Stack>
  );
};

export default CertificateOptionsPanel;


