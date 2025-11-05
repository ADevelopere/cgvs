import React, { useMemo, useState } from "react";
import { Box, Button, Dialog, DialogContent, Grid, Stack, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VariablesIcon from "@mui/icons-material/Functions";
import ImageIcon from "@mui/icons-material/Image";
import { useAppTranslation } from "@/client/locale";
import { StudentOptionsPanel } from "./StudentOptionsPanel";
import { CertificateOptionsPanel } from "./CertificateOptionsPanel";
import { VariableOptionsPanel } from "./VariableOptionsPanel";

type AddNodePanelProps = {
  compact: boolean;
};

type FirstColumnItemKey = "student" | "certificate" | "variable" | "image";

export const AddNodePanel: React.FC<AddNodePanelProps> = ({ compact }) => {
  const { templateEditorTranslations: t } = useAppTranslation();
  const [selectedItem, setSelectedItem] = useState<FirstColumnItemKey | null>("student");
  const [dialogFor, setDialogFor] = useState<FirstColumnItemKey | null>(null);

  const items = useMemo(
    () => [
      { key: "student" as const, icon: <PeopleIcon />, label: t.addNodePanel.items.student },
      { key: "certificate" as const, icon: <AssignmentIcon />, label: t.addNodePanel.items.certificate },
      { key: "variable" as const, icon: <VariablesIcon />, label: t.addNodePanel.items.variable },
      { key: "image" as const, icon: <ImageIcon />, label: t.addNodePanel.items.image },
    ],
    [t]
  );

  const handleItemClick = (key: FirstColumnItemKey) => {
    if (key === "image") {
      return; // no-op for now
    }

    if (compact) {
      setDialogFor(key);
    } else {
      setSelectedItem(key);
    }
  };

  const renderOptions = (key: FirstColumnItemKey | null) => {
    switch (key) {
      case "student":
        return <StudentOptionsPanel />;
      case "certificate":
        return <CertificateOptionsPanel />;
      case "variable":
        return <VariableOptionsPanel />;
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: compact ? 12 : 4 }}>
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={2}>
          {items.map(item => (
            <Button
              key={item.key}
              onClick={() => handleItemClick(item.key)}
              variant={selectedItem === item.key && !compact ? "contained" : "outlined"}
              startIcon={item.icon}
              sx={{ minWidth: compact ? 56 : 160, justifyContent: compact ? "center" : "flex-start" }}
            >
              {!compact && (
                <Typography variant="button" component="span">
                  {item.label}
                </Typography>
              )}
            </Button>
          ))}
        </Stack>
      </Grid>

      {!compact && (
        <Grid size={{ xs: 12, md: 8 }}>
          <Box>{renderOptions(selectedItem)}</Box>
        </Grid>
      )}

      <Dialog open={dialogFor !== null} onClose={() => setDialogFor(null)} fullWidth maxWidth="sm">
        <DialogContent>{dialogFor && <Box>{renderOptions(dialogFor)}</Box>}</DialogContent>
      </Dialog>
    </Grid>
  );
};

export default AddNodePanel;