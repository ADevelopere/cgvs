import React, { useMemo } from "react";
import { Stack, Button, Typography } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  CalendarToday as CalendarTodayIcon,
  Wc as WcIcon,
  Flag as FlagIcon,
  Public as PublicIcon,
} from "@mui/icons-material";

export type StudentOptionsPanelProps = {
  compact: boolean;
  style: React.CSSProperties;
};

export type StudentOptionItem = {
  label: string;
  icon: React.ReactNode;
};

export const StudentOptionsPanel: React.FC<StudentOptionsPanelProps> = ({ compact, style }) => {
  const { templateEditorTranslations: t } = useAppTranslation();

  const options: StudentOptionItem[] = useMemo(
    () => [
      { label: t.addNodePanel.studentOptions.name, icon: <PersonIcon /> },
      { label: t.addNodePanel.studentOptions.email, icon: <EmailIcon /> },
      { label: t.addNodePanel.studentOptions.dateOfBirth, icon: <CakeIcon /> },
      { label: t.addNodePanel.studentOptions.age, icon: <CalendarTodayIcon /> },
      { label: t.addNodePanel.studentOptions.gender, icon: <WcIcon /> },
      { label: t.addNodePanel.studentOptions.nationality, icon: <FlagIcon /> },
      { label: t.addNodePanel.studentOptions.country, icon: <PublicIcon /> },
    ],
    [t]
  );

  return (
    <Stack spacing={2} style={style}>
      {compact && <Typography variant="subtitle1">{t.addNodePanel.studentOptions.title}</Typography>}
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

export default StudentOptionsPanel;
