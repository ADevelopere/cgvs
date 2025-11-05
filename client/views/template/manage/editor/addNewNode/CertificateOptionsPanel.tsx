import React, { useMemo } from "react";
import { Stack, Button, Typography } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import * as Icons from "@mui/icons-material";

export type CertificateOptionsPanelProps = {
  compact: boolean;
  style: React.CSSProperties;
};
export type CertificateOptionItem = {
  label: string;
  icon: React.ReactNode;
};
export const CertificateOptionsPanel: React.FC<CertificateOptionsPanelProps> = ({ compact, style }) => {
  const { templateEditorTranslations: t } = useAppTranslation();

  const options: CertificateOptionItem[] = useMemo(
    () => [
      { label: t.addNodePanel.certificateOptions.verificationCode, icon: <Icons.VerifiedUser /> },
      { label: t.addNodePanel.certificateOptions.qrCode, icon: <Icons.QrCode /> },
    ],
    [t]
  );

  return (
    <Stack spacing={2} style={style}>
      {compact && <Typography variant="subtitle1">{t.addNodePanel.certificateOptions.title}</Typography>}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {options.map(opt => (
          <Button key={opt.label} variant="outlined" startIcon={opt.icon}>
            {opt.label}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default CertificateOptionsPanel;
