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
import { CreateDateElementWrapper } from "./wrappers/CreateDateElementWrapper";

export type StudentOptionsPanelProps = {
  compact: boolean;
  style: React.CSSProperties;
  templateId: number;
};

type StudentTextFieldinput = {
  type: GQL.ElementType.Text;
  textField: GQL.StudentTextField;
};

type StudentDateFieldinput = {
  type: GQL.ElementType.Date;
  dateField: GQL.StudentDateField;
  transformation?: GQL.DateTransformationType;
};

type Input = StudentTextFieldinput | StudentDateFieldinput;

export type StudentOptionItem = {
  label: string;
  icon: React.ReactNode;
  // optional: if provided, clicking this option will open the text element
  // creation flow with this student field pre-selected
  input?: Input;
};

export const StudentOptionsPanel: React.FC<StudentOptionsPanelProps> = ({ compact, style, templateId }) => {
  const {
    templateEditorTranslations: { addNodePanel: t },
  } = useAppTranslation();

  const [openTextDialog, setOpenTextDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<StudentOptionItem | undefined>(undefined);

  const [openDateDialog, setOpenDateDialog] = useState(false);

  const handleOpenForField = useCallback((option: StudentOptionItem) => {
    setSelectedOption(option);
    if (option.input?.type === GQL.ElementType.Text) {
      setOpenTextDialog(true);
    } else if (option.input?.type === GQL.ElementType.Date) {
      setOpenDateDialog(true);
    }
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenTextDialog(false);
    setOpenDateDialog(false);
    setSelectedOption(undefined);
  }, []);

  const options: StudentOptionItem[] = useMemo(
    () => [
      {
        label: t.studentOptions.name,
        icon: <PersonIcon />,
        input: {
          type: GQL.ElementType.Text,
          textField: GQL.StudentTextField.StudentName,
        },
      },
      {
        label: t.studentOptions.email,
        icon: <EmailIcon />,
        input: {
          type: GQL.ElementType.Text,
          textField: GQL.StudentTextField.StudentEmail,
        },
      },
      {
        label: t.studentOptions.dateOfBirth,
        icon: <CakeIcon />,
        input: {
          type: GQL.ElementType.Date,
          dateField: GQL.StudentDateField.DateOfBirth,
        },
      },
      {
        label: t.studentOptions.age,
        icon: <CalendarTodayIcon />,
        input: {
          type: GQL.ElementType.Date,
          dateField: GQL.StudentDateField.DateOfBirth,
          transformation: GQL.DateTransformationType.AgeCalculation,
        },
      },
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
            disabled={!opt.input}
          >
            {opt.label}
          </Button>
        ))}
      </Stack>
      {/* Text element creation dialog for text-backed student fields (name/email) */}
      {openTextDialog && selectedOption?.input?.type === GQL.ElementType.Text && (
        <CreateTextElementWrapper
          templateId={templateId}
          initialStudentField={selectedOption.input.textField}
          initialElementName={selectedOption.label}
          open={openTextDialog}
          onClose={handleCloseDialog}
        />
      )}

      {/* Date element creation dialog for date-backed student fields (DOB/age) */}
      {openDateDialog && selectedOption?.input?.type === GQL.ElementType.Date && (
        <CreateDateElementWrapper
          templateId={templateId}
          initialStudentField={selectedOption.input.dateField}
          initialTransformation={selectedOption.input.transformation}
          initialElementName={selectedOption.label}
          open={openDateDialog}
          onClose={handleCloseDialog}
        />
      )}
    </Stack>
  );
};

export default StudentOptionsPanel;
