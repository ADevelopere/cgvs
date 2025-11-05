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
import { CreateGenderElementWrapper } from "./wrappers/CreateGenderElementWrapper";

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

type StudentGenderFieldinput = {
  type: GQL.ElementType.Gender;
};

type Input = StudentTextFieldinput | StudentDateFieldinput | StudentGenderFieldinput;

type DialogType = GQL.ElementType;

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

  const [selectedOption, setSelectedOption] = useState<StudentOptionItem | undefined>(undefined);
  const [dialogType, setDialogType] = useState<DialogType | undefined>(undefined);

  const handleOpenForField = useCallback((option: StudentOptionItem) => {
    setSelectedOption(option);
    setDialogType(option.input?.type);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogType(undefined);
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
      {
        label: t.studentOptions.gender,
        icon: <WcIcon />,
        input: {
          type: GQL.ElementType.Gender,
        },
      },
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
      {dialogType === GQL.ElementType.Text && selectedOption?.input?.type === GQL.ElementType.Text && (
        <CreateTextElementWrapper
          templateId={templateId}
          initialStudentField={selectedOption.input.textField}
          initialElementName={selectedOption.label}
          open={dialogType === GQL.ElementType.Text}
          onClose={handleCloseDialog}
        />
      )}

      {/* Date element creation dialog for date-backed student fields (DOB/age) */}
      {dialogType === GQL.ElementType.Date && selectedOption?.input?.type === GQL.ElementType.Date && (
        <CreateDateElementWrapper
          templateId={templateId}
          initialStudentField={selectedOption.input.dateField}
          initialTransformation={selectedOption.input.transformation}
          initialElementName={selectedOption.label}
          open={dialogType === GQL.ElementType.Date}
          onClose={handleCloseDialog}
        />
      )}
      {/* Gender element creation dialog for gender-backed student fields */}
      {dialogType === GQL.ElementType.Gender && selectedOption?.input?.type === GQL.ElementType.Gender && (
        <CreateGenderElementWrapper
          templateId={templateId}
          initialElementName={selectedOption.label}
          open={dialogType === GQL.ElementType.Gender}
          onClose={handleCloseDialog}
        />
      )}
    </Stack>
  );
};

export default StudentOptionsPanel;
