"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  useTheme,
  CircularProgress,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import {
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { TextFilterOperation } from "@/client/types/filters";
import { useAppTranslation } from "@/client/locale";
import { useStudentOperations } from "./hook/useStudentOperations";
import {
  TextFieldComponent,
  DateFieldComponent,
  GenderFieldComponent,
  CountryFieldComponent,
  PhoneFieldComponent,
} from "./components";
import {
  validateName,
  validateEmail,
  validateDateOfBirth,
  validateGender,
  validateNationality,
  validatePhoneNumber,
} from "./validators";
import {
  _ActionsContainer,
  _CreateButton,
  _FieldsContainer,
  _FieldWrapper,
  _StyledAlert,
  _StyledPaper,
} from "./components/CreateStudentRow.styles";
import { HammerIcon } from "lucide-react";
import {
  Gender,
  StudentCreateInput,
} from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";

const MemoizedTextField = React.memo(TextFieldComponent);
const MemoizedDateField = React.memo(DateFieldComponent);
const MemoizedGenderField = React.memo(GenderFieldComponent);
const MemoizedCountryField = React.memo(CountryFieldComponent);
const MemoizedPhoneField = React.memo(PhoneFieldComponent);

// Field configuration for CreateStudentRow form
interface CreateStudentFieldConfig {
  id: keyof StudentCreateInput;
  type: "text" | "date" | "select" | "country" | "phone";
  label: string; // translation key
  placeholder?: string; // translation key
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator?: (value: any) => string | null;
  textType?: "text" | "email"; // for TextField subtype
}

const CREATE_STUDENT_FIELDS: CreateStudentFieldConfig[] = [
  {
    id: "name",
    type: "text",
    label: "name",
    placeholder: "namePlaceholder",
    required: true,
    validator: validateName,
  },
  {
    id: "email",
    type: "text",
    textType: "email",
    label: "email",
    placeholder: "emailPlaceholder",
    validator: validateEmail,
  },
  {
    id: "dateOfBirth",
    type: "date",
    label: "dateOfBirth",
    validator: validateDateOfBirth,
  },
  {
    id: "gender",
    type: "select",
    label: "gender",
    placeholder: "genderPlaceholder",
    validator: validateGender,
  },
  {
    id: "nationality",
    type: "country",
    label: "nationality",
    placeholder: "nationalityPlaceholder",
    validator: validateNationality,
  },
  {
    id: "phoneNumber",
    type: "phone",
    label: "phoneNumber",
    validator: validatePhoneNumber,
  },
];

const initialStudentState: StudentCreateInput = {
  name: "",
};

const CreateStudentRow = () => {
  const { createStudent, setSearchFilter } = useStudentOperations();
  const strings = useAppTranslation("studentTranslations");
  const genderStrings = useAppTranslation("genderTranslations");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  // Form state
  const [newStudent, setNewStudent] =
    useState<StudentCreateInput>(initialStudentState);
  // fieldValidity: string (field) -> string | null (error message, null if valid)
  const [fieldValidity, setFieldValidity] = useState<
    Record<string, string | null>
  >({});

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Form validation: valid if all required fields in fieldValidity are true
  const isFormValid = useMemo(() => {
    // 'name' field must exist and have no error
    if (!("name" in fieldValidity) || fieldValidity["name"] !== null)
      return false;
    // All fields must be valid (errorMessage === null)
    return Object.values(fieldValidity).every(err => err === null);
  }, [fieldValidity]);

  // Get field width based on type and screen size
  const getFieldWidth = useCallback(
    (fieldType: string) => {
      if (isMobile) return "100%";

      switch (fieldType) {
        case "text":
          return isTablet ? 250 : 300;
        case "phone":
        case "country":
          return isTablet ? 190 : 240;
        case "date":
          return isTablet ? 180 : 200;
        case "select":
          return isTablet ? 120 : 160;
        default:
          return isTablet ? 200 : 220;
      }
    },
    [isMobile, isTablet]
  );

  // Build gender options from translations
  const genderOptions: {
    value: Gender;
    label: string;
  }[] = useMemo(
    () => [
      { label: genderStrings.male, value: "MALE" },
      { label: genderStrings.female, value: "FEMALE" },
    ],
    [genderStrings]
  );

  const lastFilteredValue = useRef<string | undefined>(undefined);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleNameChange = useCallback(
    (value: string | undefined, errorMessage: string | null) => {
      logger.info("🔍 CreateStudentRow: handleNameChange called", {
        value,
        errorMessage,
      });
      setNewStudent(prev => ({ ...prev, name: value ?? "" }));
      setIsDirty(true);
      setFieldValidity(prev => ({ ...prev, name: errorMessage }));

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (value === lastFilteredValue.current) {
          logger.info("🔍 CreateStudentRow: debounce skipped - same value", {
            value,
          });
          return;
        }
        lastFilteredValue.current = value;

        if (!value || value.trim() === "") {
          logger.info("🔍 CreateStudentRow: debounce - clearing name filter");
          setSearchFilter(null);
        } else {
          logger.info("🔍 CreateStudentRow: debounce - setting name filter", {
            value,
          });
          setSearchFilter({
            columnId: "name",
            operation: TextFilterOperation.startsWith,
            value: value,
          });
        }
      }, 1500);
    },
    [setSearchFilter]
  );

  // Cleanup the debounce timer on unmount
  useEffect(
    () => () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    },
    []
  );

  const handleChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: any, columnId: string, errorMessage: string | null) => {
      setNewStudent(prev => ({ ...prev, [columnId]: value }));
      setIsDirty(true);
      setFieldValidity(prev => ({ ...prev, [columnId]: errorMessage }));
    },
    []
  );

  // Create a memoized map of handlers for all fields except 'name'
  const fieldChangeHandlers = useMemo(() => {
    const handlers: Record<
      string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value: any, errorMessage: string | null) => void
    > = {};
    CREATE_STUDENT_FIELDS.filter(f => f.id !== "name").forEach(field => {
      handlers[field.id] = (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any,
        errorMessage: string | null
      ) => {
        handleChange(value, field.id, errorMessage);
      };
    });
    return handlers;
  }, [handleChange]);

  const handleCreate = useCallback(async () => {
    if (!isFormValid) return;

    logger.info(
      "🔍 CreateStudentRow: handleCreate called - clearing filters before mutation"
    );

    // Clear debounce timer BEFORE mutation to prevent race condition
    if (debounceTimer.current) {
      logger.info("🔍 CreateStudentRow: clearing debounce timer");
      clearTimeout(debounceTimer.current);
    }
    lastFilteredValue.current = undefined;
    logger.info("🔍 CreateStudentRow: calling setSearchFilter(null)");
    setSearchFilter(null);

    setIsLoading(true);
    setShowError(false);
    setErrorMessage("");

    try {
      logger.info("🔍 CreateStudentRow: calling createStudent mutation");
      await createStudent({
        input: newStudent,
      });

      logger.info("🔍 CreateStudentRow: createStudent mutation successful");
      // Reset form on success
      setNewStudent(initialStudentState);
      setFieldValidity({});
      setIsDirty(false);
      setShowSuccess(true);
    } catch (error) {
      logger.error("🔍 CreateStudentRow: createStudent mutation failed", error);
      setErrorMessage(
        error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الطالب"
      );
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  }, [setSearchFilter, createStudent, isFormValid, newStudent]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey && isFormValid) {
        handleCreate().then(r => r);
      }
    },
    [handleCreate, isFormValid]
  );

  return (
    <>
      <_StyledPaper elevation={2} isMobile={isMobile} onKeyDown={handleKeyDown}>
        <_FieldsContainer isMobile={isMobile}>
          {CREATE_STUDENT_FIELDS.map(field => (
            <_FieldWrapper
              key={field.id}
              isMobile={isMobile}
              fieldWidth={getFieldWidth(field.type)}
            >
              {field.type === "text" && field.id === "name" && (
                <MemoizedTextField
                  value={newStudent.name}
                  errorMessage={fieldValidity["name"]}
                  label={strings[field.label as keyof typeof strings]}
                  helperText={
                    newStudent?.name?.trim() === "" && isDirty
                      ? strings.nameRequired
                      : ""
                  }
                  placeholder={
                    field.placeholder
                      ? strings[field.placeholder as keyof typeof strings]
                      : undefined
                  }
                  required={field.required}
                  width="100%"
                  onValueChange={handleNameChange}
                  getIsValid={field.validator}
                />
              )}
              {field.type === "text" && field.id === "email" && (
                <MemoizedTextField
                  value={newStudent.email}
                  errorMessage={fieldValidity["email"] ?? ""}
                  label={strings[field.label as keyof typeof strings]}
                  placeholder={
                    field.placeholder
                      ? strings[field.placeholder as keyof typeof strings]
                      : undefined
                  }
                  type={field.textType || "text"}
                  width="100%"
                  onValueChange={(value, errorMessage) =>
                    fieldChangeHandlers[field.id]?.(value, errorMessage)
                  }
                  getIsValid={field.validator}
                />
              )}
              {field.type === "date" && (
                <MemoizedDateField
                  value={newStudent.dateOfBirth}
                  errorMessage={fieldValidity[field.id] ?? ""}
                  label={strings[field.label as keyof typeof strings]}
                  width="100%"
                  onValueChange={fieldChangeHandlers[field.id]}
                  getIsValid={field.validator}
                />
              )}
              {field.type === "select" && field.id === "gender" && (
                <MemoizedGenderField
                  value={newStudent.gender}
                  errorMessage={fieldValidity["gender"] ?? ""}
                  label={strings[field.label as keyof typeof strings]}
                  placeholder={
                    field.placeholder
                      ? strings[field.placeholder as keyof typeof strings]
                      : undefined
                  }
                  options={genderOptions}
                  width="100%"
                  onValueChange={fieldChangeHandlers[field.id]}
                  getIsValid={field.validator}
                />
              )}
              {field.type === "country" && (
                <MemoizedCountryField
                  value={newStudent.nationality ?? undefined}
                  errorMessage={fieldValidity[field.id] ?? ""}
                  label={strings[field.label as keyof typeof strings]}
                  placeholder={
                    field.placeholder
                      ? strings[field.placeholder as keyof typeof strings]
                      : undefined
                  }
                  width="100%"
                  onValueChange={fieldChangeHandlers[field.id]}
                  getIsValid={field.validator}
                />
              )}
              {field.type === "phone" && (
                <MemoizedPhoneField
                  value={newStudent.phoneNumber}
                  errorMessage={fieldValidity[field.id] ?? ""}
                  label={strings[field.label as keyof typeof strings]}
                  width="100%"
                  onValueChange={fieldChangeHandlers[field.id]}
                  getIsValid={field.validator}
                />
              )}
            </_FieldWrapper>
          ))}
        </_FieldsContainer>

        <_ActionsContainer isMobile={isMobile}>
          <_CreateButton
            variant="contained"
            onClick={handleCreate}
            disabled={!isFormValid || isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <HammerIcon />
              )
            }
            isMobile={isMobile}
            isFormValid={isFormValid}
            title={
              !isFormValid
                ? strings.fillRequiredFields
                : strings.createStudentShortcut
            }
          >
            {isLoading ? strings.creating : strings.create}
          </_CreateButton>
        </_ActionsContainer>
      </_StyledPaper>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <_StyledAlert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
          icon={<CheckCircleIcon />}
        >
          {strings.studentCreatedSuccess}
        </_StyledAlert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <_StyledAlert
          onClose={() => setShowError(false)}
          severity="error"
          variant="filled"
          icon={<ErrorIcon />}
        >
          {errorMessage || strings.studentCreateError}
        </_StyledAlert>
      </Snackbar>
    </>
  );
};

export default CreateStudentRow;
