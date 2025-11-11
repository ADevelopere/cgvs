import React, { useState, useMemo } from "react";
import * as MUI from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { useQuery } from "@apollo/client/react";
import { checkFontUsageQueryDocument } from "../hooks/font.documents";
import { useAppTranslation } from "@/client/locale";

interface DeleteVariantDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  variantId: number;
  variantName: string;
}

export const DeleteVariantDialog: React.FC<DeleteVariantDialogProps> = ({
  open,
  onClose,
  onConfirm,
  variantId,
  variantName,
}) => {
  const { fontManagementTranslations: t } = useAppTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: usageData, loading: checkingUsage } = useQuery(checkFontUsageQueryDocument, {
    variables: { id: variantId },
    skip: !open,
  });

  const usageInfo = useMemo(() => {
    if (!usageData?.checkFontVariantUsage) return null;
    return usageData.checkFontVariantUsage;
  }, [usageData]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MUI.Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MUI.DialogTitle>{t.deleteVariant}</MUI.DialogTitle>
      <MUI.DialogContent>
        <MUI.DialogContentText sx={{ mb: 2 }}>
          {t.confirmDeleteVariant} <strong>{variantName}</strong>?
        </MUI.DialogContentText>

        {checkingUsage ? (
          <MUI.Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 3 }}>
            <MUI.CircularProgress size={24} sx={{ mr: 2 }} />
            <MUI.Typography variant="body2" color="text.secondary">
              {t.checkingUsage}
            </MUI.Typography>
          </MUI.Box>
        ) : usageInfo && !usageInfo.canDelete ? (
          <MUI.Alert severity="error" icon={<WarningIcon />}>
            <MUI.AlertTitle>{t.cannotDeleteVariant}</MUI.AlertTitle>
            <MUI.Typography variant="body2">
              {usageInfo.deleteBlockReason ||
                t.variantUsedInElements.replace("%{count}", usageInfo.usageCount.toString())}
            </MUI.Typography>
          </MUI.Alert>
        ) : (
          <MUI.Alert severity="warning" icon={<WarningIcon />}>
            <MUI.Typography variant="body2">{t.cannotUndone}</MUI.Typography>
          </MUI.Alert>
        )}
      </MUI.DialogContent>
      <MUI.DialogActions>
        <MUI.Button onClick={onClose} disabled={isDeleting}>
          {t.cancel}
        </MUI.Button>
        <MUI.Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isDeleting || checkingUsage || (usageInfo !== null && !usageInfo.canDelete)}
        >
          {isDeleting ? t.deleting : t.delete}
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
};
