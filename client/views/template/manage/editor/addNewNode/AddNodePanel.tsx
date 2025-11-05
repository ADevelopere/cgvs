import React, { useMemo, useState } from "react";
import { Box, ButtonBase, Divider, Popover, Stack, Typography } from "@mui/material";
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
  const [dialogFor, setDialogFor] = useState<FirstColumnItemKey | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const items = useMemo(
    () => [
      { key: "student" as const, Icon: PeopleIcon, label: t.addNodePanel.items.student },
      { key: "certificate" as const, Icon: AssignmentIcon, label: t.addNodePanel.items.certificate },
      { key: "variable" as const, Icon: VariablesIcon, label: t.addNodePanel.items.variable },
      { key: "image" as const, Icon: ImageIcon, label: t.addNodePanel.items.image },
    ],
    [t]
  );

  const handleItemClick = (event: React.MouseEvent<HTMLElement>, key: FirstColumnItemKey) => {
    if (key === "image") {
      return; // no-op for now
    }

    if (compact) {
      setAnchorEl(event.currentTarget);
      setDialogFor(key);
    }
  };

  const renderOptions = (key: FirstColumnItemKey | null) => {
    switch (key) {
      case "student":
        return <StudentOptionsPanel compact={compact} style={{ maxWidth: 300 }} />;
      case "certificate":
        return <CertificateOptionsPanel compact={compact} style={{ maxWidth: 300 }} />;
      case "variable":
        return <VariableOptionsPanel compact={compact} style={{ maxWidth: 300 }} />;
      default:
        return null;
    }
  };

  return (
    <Stack direction="column" sx={{ width: "100%" }}>
      {items.map(item => {
        const IconCmp = item.Icon;
        const showInlineOptions = !compact && item.key !== "image";
        const itemWidth = compact ? 40 : 60;
        return (
          <Box key={item.key} sx={{ width: "100%" }} id={item.key}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                width: "100%",
              }}
            >
              <ButtonBase
                onClick={event => handleItemClick(event.currentTarget, item.key)}
                sx={{
                  width: itemWidth, 
                  flexShrink: 0,
                  py: 0,
                  px: 1,
                  borderInlineEnd: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack direction="column" alignItems="center" spacing={0.5} sx={{ width: "100%" }}>
                  <IconCmp sx={{ fontSize: 32 }} />
                  {!compact && (
                    <Typography variant="caption" component="span">
                      {item.label}
                    </Typography>
                  )}
                </Stack>
              </ButtonBase>

              <Box sx={{ flexGrow: 1, minHeight: 40, px: 2, maxWidth: 300 }}>
                {showInlineOptions ? renderOptions(item.key) : null}
              </Box>
            </Box>

            <Divider />
          </Box>
        );
      })}

      <Popover
        open={dialogFor !== null}
        onClose={() => setDialogFor(null)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box>{dialogFor && <Box>{renderOptions(dialogFor)}</Box>}</Box>
      </Popover>
    </Stack>
  );
};

export default AddNodePanel;
