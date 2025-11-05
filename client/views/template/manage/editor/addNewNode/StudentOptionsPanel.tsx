import React, { useMemo, useState, useCallback } from "react";
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
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { CreateTextElementWrapper } from "./wrappers/CreateTextElementWrapper";

export type StudentOptionsPanelProps = {
  compact: boolean;
  style: React.CSSProperties;
  templateId: number;
};

export type StudentOptionItem = {
  label: string;
  icon: React.ReactNode;
  // optional: if provided, clicking this option will open the text element
  // creation flow with this student field pre-selected
  studentField?: GQL.StudentTextField;
};

export const StudentOptionsPanel: React.FC<StudentOptionsPanelProps> = ({ compact, style, templateId }) => {
  const { templateEditorTranslations: {addNodePanel: t} } = useAppTranslation();

  const [openTextDialog, setOpenTextDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<StudentOptionItem | undefined>(undefined);

  const handleOpenForField = useCallback((option: StudentOptionItem) => {
    setSelectedOption(option);
    setOpenTextDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenTextDialog(false);
    setSelectedOption(undefined);
  }, []);

  const options: StudentOptionItem[] = useMemo(
    () => [
      {
        label: t.studentOptions.name,
        icon: <PersonIcon />,
        studentField: GQL.StudentTextField.StudentName,
      },
      {
        label: t.studentOptions.email,
        icon: <EmailIcon />,
        studentField: GQL.StudentTextField.StudentEmail,
      },
      { label: t.studentOptions.dateOfBirth, icon: <CakeIcon /> },
      { label: t.studentOptions.age, icon: <CalendarTodayIcon /> },
      { label: t.studentOptions.gender, icon: <WcIcon /> },
      { label: t.studentOptions.nationality, icon: <FlagIcon /> },
      { label: t.studentOptions.country, icon: <PublicIcon /> },
    ],
    [t]
  );

  return (
    <Stack spacing={2} style={style}>
      {compact && <Typography variant="subtitle1">{t.studentOptions.title}</Typography>}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {options.map(opt => (
          <Button
            key={opt.label}
            variant="outlined"
            startIcon={opt.icon}
            onClick={() => handleOpenForField(opt)}
            // only name/email (text fields) are supported for now
            disabled={!opt.studentField}
          >
            {opt.label}
          </Button>
        ))}
      </Stack>
      {/* Text element creation dialog for text-backed student fields (name/email) */}
      {openTextDialog && selectedOption && (
        <CreateTextElementWrapper
          templateId={templateId}
          initialStudentField={selectedOption.studentField}
          initialElementName={selectedOption.label}
          open={openTextDialog}
          onClose={handleCloseDialog}
        />
      )}
    </Stack>
  );
};

export default StudentOptionsPanel;
