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
  templateId: number;
};

type FirstColumnItemKey = "student" | "certificate" | "variable" | "image";

export const AddNodePanel: React.FC<AddNodePanelProps> = ({ compact, templateId }) => {
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
        return <StudentOptionsPanel compact={compact} style={{ maxWidth: 300 }} templateId={templateId} />;
      case "certificate":
        return <CertificateOptionsPanel compact={compact} style={{ maxWidth: 300 }} templateId={templateId} />;
      case "variable":
        return <VariableOptionsPanel compact={compact} style={{ maxWidth: 300 }} templateId={templateId} />;
      default:
        return null;
    }
  };
  const itemWidth = compact ? 40 : 60;

  return (
    <Stack direction="column" sx={{ width: "100%" }}>
      {items.map(item => {
        const IconCmp = item.Icon;
        const showInlineOptions = !compact && item.key !== "image";
        return (
          <Box key={item.key} sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <ButtonBase
                onClick={event => handleItemClick(event, item.key)}
                sx={{
                  width: itemWidth,
                  flexShrink: 0,
                  py: 0,
                  borderInlineEnd: !compact ? "1px solid" : "none",
                  borderColor: "divider",
                  minHeight: 64,
                  minWidth: itemWidth,
                }}
              >
                <Stack
                  direction="column"
                  alignItems="center"
                  spacing={0.5}
                  sx={{ width: "100%" }}
                  justifyContent={"center"}
                >
                  <IconCmp sx={{ fontSize: 32 }} />
                  <Typography variant="caption" component="span">
                    {item.label}
                  </Typography>
                </Stack>
              </ButtonBase>

              {compact ? null : (
                <Box sx={{ flexGrow: 1, p: 1, maxHeight: 300, overflowY: "auto" }}>
                  {showInlineOptions ? renderOptions(item.key) : null}
                </Box>
              )}
            </Box>

            <Divider />
          </Box>
        );
      })}

      <Popover
        open={dialogFor !== null}
        onClose={() => setDialogFor(null)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "center", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          sx={{
            p: 2,
            maxWidth: 300,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          {dialogFor && <Box>{renderOptions(dialogFor)}</Box>}
        </Box>
      </Popover>
    </Stack>
  );
};

export default AddNodePanel;
