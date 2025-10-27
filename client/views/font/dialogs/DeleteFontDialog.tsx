import React, { useState, useMemo } from "react";
import * as MUI from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { useQuery } from "@apollo/client/react";
import { useFontOperations } from "../hooks/useFontOperations";
import { checkFontUsageQueryDocument } from "../hooks/font.documents";
import { useAppTranslation } from "@/client/locale";

interface DeleteFontDialogProps {
  open: boolean;
  onClose: () => void;
  fontId: number;
  fontName: string;
}

export const DeleteFontDialog: React.FC<DeleteFontDialogProps> = ({
  open,
  onClose,
  fontId,
  fontName,
}) => {
  const strings = useAppTranslation("fontManagementTranslations");
  const { deleteFont } = useFontOperations();
  const [isDeleting, setIsDeleting] = useState(false);

  // Query usage check - only when dialog is open
  const { data: usageData, loading: checkingUsage } = useQuery(
    checkFontUsageQueryDocument,
    {
      variables: { id: fontId },
      skip: !open,
    }
  );

  // Derive usage info from query
  const usageInfo = useMemo(() => {
    if (!usageData?.checkFontUsage) return null;
    const data = usageData.checkFontUsage;
    return {
      isInUse: data.isInUse,
      usageCount: data.usageCount,
      canDelete: data.canDelete,
      deleteBlockReason: data.deleteBlockReason ?? null,
      usedBy: data.usedBy.map(usage => ({
        elementId: usage.elementId,
        elementType: usage.elementType,
        templateId: usage.templateId ?? null,
        templateName: usage.templateName ?? null,
      })),
    };
  }, [usageData]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteFont(fontId);
    setIsDeleting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <MUI.Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MUI.DialogTitle>{strings.deleteFont}</MUI.DialogTitle>
      <MUI.DialogContent>
        <MUI.DialogContentText sx={{ mb: 2 }}>
          {strings.confirmDeleteMessage.replace("%{fontName}", fontName)}
        </MUI.DialogContentText>

        {checkingUsage ? (
          <MUI.Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 3,
            }}
          >
            <MUI.CircularProgress size={24} sx={{ mr: 2 }} />
            <MUI.Typography variant="body2" color="text.secondary">
              {strings.checkingUsage}
            </MUI.Typography>
          </MUI.Box>
        ) : usageInfo && !usageInfo.canDelete ? (
          <MUI.Alert severity="error" icon={<WarningIcon />}>
            <MUI.AlertTitle>{strings.cannotDeleteFont}</MUI.AlertTitle>
            <MUI.Typography variant="body2">
              {usageInfo.deleteBlockReason ||
                strings.fontUsedInElements.replace("%{count}", usageInfo.usageCount.toString())}
            </MUI.Typography>
          </MUI.Alert>
        ) : (
          <MUI.Alert severity="warning" icon={<WarningIcon />}>
            <MUI.Typography variant="body2">
              {strings.cannotUndone} {strings.deleteWarning}
            </MUI.Typography>
          </MUI.Alert>
        )}
      </MUI.DialogContent>
      <MUI.DialogActions>
        <MUI.Button variant="outlined" onClick={onClose} disabled={isDeleting}>
          {strings.cancel}
        </MUI.Button>
        <MUI.Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={
            isDeleting ||
            checkingUsage ||
            (usageInfo !== null && !usageInfo.canDelete)
          }
        >
          {isDeleting ? strings.deletingFont : strings.deleteFont}
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
};
