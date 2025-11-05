import React, { useMemo, useState, useCallback } from "react";
import { Stack, Button, Typography } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import * as Icons from "@mui/icons-material";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { CreateTextElementWrapper } from "./wrappers/CreateTextElementWrapper";
import { CreateQRCodeElementWrapper } from "./wrappers/CreateQRCodeElementWrapper";

export type CertificateOptionsPanelProps = {
  compact: boolean;
  style: React.CSSProperties;
  templateId: number;
};

type CertificateTextFieldInput = {
  type: GQL.ElementType.Text;
  certificateField: GQL.CertificateTextField;
};

type QRCodeFieldInput = {
  type: GQL.ElementType.QrCode;
};

type Input = CertificateTextFieldInput | QRCodeFieldInput;

type DialogType = GQL.ElementType;

export type CertificateOptionItem = {
  label: string;
  icon: React.ReactNode;
  input?: Input;
};

export const CertificateOptionsPanel: React.FC<CertificateOptionsPanelProps> = ({ compact, style, templateId }) => {
  const { templateEditorTranslations: t } = useAppTranslation();

  const [selectedOption, setSelectedOption] = useState<CertificateOptionItem | undefined>(undefined);
  const [dialogType, setDialogType] = useState<DialogType | undefined>(undefined);

  const handleOpenForField = useCallback((option: CertificateOptionItem) => {
    setSelectedOption(option);
    setDialogType(option.input?.type);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogType(undefined);
    setSelectedOption(undefined);
  }, []);

  const options: CertificateOptionItem[] = useMemo(
    () => [
      {
        label: t.addNodePanel.certificateOptions.verificationCode,
        icon: <Icons.VerifiedUser />,
        input: {
          type: GQL.ElementType.Text,
          certificateField: GQL.CertificateTextField.VerificationCode,
        },
      },
      {
        label: t.addNodePanel.certificateOptions.qrCode,
        icon: <Icons.QrCode />,
        input: {
          type: GQL.ElementType.QrCode,
        },
      },
    ],
    [t]
  );

  return (
    <Stack spacing={2} style={style}>
      {compact && <Typography variant="subtitle1">{t.addNodePanel.certificateOptions.title}</Typography>}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {options.map(opt => (
          <Button
            key={opt.label}
            variant="outlined"
            startIcon={opt.icon}
            onClick={() => handleOpenForField(opt)}
            disabled={!opt.input}
          >
            {opt.label}
          </Button>
        ))}
      </Stack>

      {/* Text element creation dialog for verification code */}
      {dialogType === GQL.ElementType.Text && selectedOption?.input?.type === GQL.ElementType.Text && (
        <CreateTextElementWrapper
          templateId={templateId}
          initialCertificateField={selectedOption.input.certificateField}
          initialElementName={selectedOption.label}
          open={dialogType === GQL.ElementType.Text}
          onClose={handleCloseDialog}
        />
      )}

      {/* QR Code element creation dialog */}
      {dialogType === GQL.ElementType.QrCode && selectedOption?.input?.type === GQL.ElementType.QrCode && (
        <CreateQRCodeElementWrapper
          templateId={templateId}
          initialElementName={selectedOption.label}
          open={dialogType === GQL.ElementType.QrCode}
          onClose={handleCloseDialog}
        />
      )}
    </Stack>
  );
};

export default CertificateOptionsPanel;
