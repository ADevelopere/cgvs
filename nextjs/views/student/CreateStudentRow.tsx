"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
    Button,
    Box,
    useTheme,
    Paper,
    CircularProgress,
    Alert,
    Snackbar,
    useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {
    Add as AddIcon,
    Error as ErrorIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import { useStudentFilter } from "@/contexts/student/StudentFilterContext";
import { TextFilterOperation } from "@/types/filters";
import { useStudentTableManagement } from "@/contexts/student/StudentTableManagementContext";
import {
    CountryCode,
    CreateStudentInput,
    Gender,
} from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";
import {
    TextFieldComponent,
    DateFieldComponent,
    GenderFieldComponent,
    CountryFieldComponent,
    PhoneFieldComponent,
} from "./components";
import { EditableColumn } from "@/types/table.type";

// Styled Components
const StyledPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== "isMobile",
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "stretch" : "center",
    padding: theme.spacing(isMobile ? 2 : 3),
    gap: theme.spacing(isMobile ? 2 : 3),
    margin: theme.spacing(1),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[2],
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        boxShadow: theme.shadows[4],
        transform: "translateY(-1px)",
    },
    "&:focus-within": {
        borderColor: theme.palette.primary.main,
        boxShadow: `${theme.shadows[4]}, 0 0 0 2px ${theme.palette.primary.main}25`,
    },
}));

const TitleContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isMobile",
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    minWidth: isMobile ? "auto" : "140px",
    flexShrink: 0,
    marginBottom: isMobile ? theme.spacing(1) : 0,
}));

const TitleIcon = styled(AddIcon)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: "1.5rem",
}));

const TitleTypography = styled(Typography, {
    shouldForwardProp: (prop) => prop !== "isMobile",
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
    fontWeight: 600,
    color: theme.palette.primary.main,
    fontSize: isMobile ? "1.1rem" : "1.25rem",
}));

const FieldsContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isMobile",
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: theme.spacing(isMobile ? 2 : 3),
    overflowX: isMobile ? "visible" : "auto",
    flexGrow: 1,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    position: "relative",
    scrollBehavior: "smooth",
    "&::-webkit-scrollbar": {
        height: "10px",
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: theme.palette.action.selected,
        borderRadius: "5px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.primary.main,
        borderRadius: "5px",
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    ...(!isMobile && {
        "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "20px",
            pointerEvents: "none",
            zIndex: 1,
        },
        "&::before": {
            left: 0,
            background: `linear-gradient(to right, ${theme.palette.background.paper}, transparent)`,
        },
        "&::after": {
            right: 0,
            background: `linear-gradient(to left, ${theme.palette.background.paper}, transparent)`,
        },
    }),
}));

const FieldWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isMobile" && prop !== "fieldWidth",
})<{ isMobile: boolean; fieldWidth: string | number }>(
    ({ isMobile, fieldWidth }) => ({
        width: fieldWidth,
        flexShrink: isMobile ? 1 : 0,
        position: "relative",
        transition: "all 0.3s ease",
    }),
);

const ActionsContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isMobile",
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: theme.spacing(2),
    alignItems: "center",
    marginTop: isMobile ? theme.spacing(2) : 0,
    marginLeft: isMobile ? 0 : theme.spacing(2),
    flexShrink: 0,
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
    borderRadius: Number(theme.shape.borderRadius) * 2,
    "& .MuiAlert-icon": {
        fontSize: "1.5rem",
    },
}));

const CreateButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "isMobile" && prop !== "isFormValid",
})<{ isMobile: boolean; isFormValid: boolean }>(
    ({ theme, isMobile, isFormValid }) => ({
        minWidth: isMobile ? "100%" : 120,
        height: 40,
        borderRadius: Number(theme.shape.borderRadius) * 2,
        fontWeight: 600,
        fontSize: "0.95rem",
        textTransform: "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        ...(isFormValid
            ? {
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  border: `2px solid ${theme.palette.primary.main}`,
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                      transform: "translateY(-2px) scale(1.05)",
                      boxShadow: theme.shadows[8],
                  },
                  "&:active": {
                      transform: "translateY(0) scale(1.02)",
                  },
              }
            : {
                  color: theme.palette.text.disabled,
                  background: theme.palette.action.disabledBackground,
                  border: `2px solid ${theme.palette.action.disabled}`,
                  "&.Mui-disabled": {
                      color: theme.palette.text.disabled,
                      background: theme.palette.action.disabledBackground,
                      border: `2px solid ${theme.palette.action.disabled}`,
                  },
              }),
    }),
);

const CreateStudentRow = () => {
    const { createStudent } = useStudentManagement();
    const { applySingleFilter } = useStudentFilter();
    const { columns } = useStudentTableManagement();
    const strings = useAppTranslation("studentTranslations");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

    // Form state
    const [newStudent, setNewStudent] = useState<CreateStudentInput>({
        name: "",
        email: "",
        dateOfBirth: null,
        gender: undefined,
    });

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDirty, setIsDirty] = useState(false);

    const [phoneNumberState, setPhoneNumberState] = useState<{
        value: string;
        error: string | null | undefined;
    }>({
        value: "",
        error: null,
    });

    const [nationalityState, setNationalityState] = useState<{
        value: CountryCode;
        error: string | null | undefined;
    }>({
        value: "EG",
        error: null,
    });

    const [genderState, setGenderState] = useState<{
        value: string | undefined;
        open: boolean;
        error: string | null | undefined;
    }>({
        value: undefined,
        open: false,
        error: null,
    });

    // Form validation
    const isFormValid = useMemo(() => {
        const nameColumn = columns.find((c) => c.id === "name");
        const nameError = nameColumn?.getIsValid?.(newStudent.name);
        return !nameError && newStudent.name.trim() !== "";
    }, [newStudent.name, columns]);

    // Get field width based on type and screen size
    const getFieldWidth = useCallback(
        (colType: string) => {
            if (isMobile) return "100%";

            switch (colType) {
                case "phone":
                case "country":
                    return isTablet ? 250 : 280;
                case "date":
                    return isTablet ? 200 : 220;
                case "select":
                    return isTablet ? 180 : 200;
                default:
                    return isTablet ? 200 : 220;
            }
        },
        [isMobile, isTablet],
    );

    const handleNameChange = useCallback(
        (value: string) => {
            setNewStudent((prev) => ({ ...prev, name: value }));
            setIsDirty(true);

            // Apply filtering when name input changes
            if (value.trim() === "") {
                applySingleFilter(null);
            } else {
                applySingleFilter({
                    columnId: "name",
                    operation: TextFilterOperation.STARTS_WITH,
                    value: value,
                });
            }
        },
        [applySingleFilter],
    );

    const handleEmailChange = useCallback((value: string) => {
        setNewStudent((prev) => ({ ...prev, email: value }));
        setIsDirty(true);
    }, []);

    const handleDateOfBirthChange = useCallback((value: string | null) => {
        setNewStudent((prev) => ({ ...prev, dateOfBirth: value }));
        setIsDirty(true);
    }, []);

    const handleGenderChange = useCallback(
        (value: string | undefined, col: EditableColumn) => {
            const validationError = col.getIsValid?.(value) ?? null;
            setGenderState({
                value: value,
                open: false,
                error: validationError,
            });
            setNewStudent((prev) => ({
                ...prev,
                gender: value as Gender,
            }));
            setIsDirty(true);
        },
        [],
    );

    const handleNationalityChange = useCallback(
        (value: CountryCode, col: EditableColumn) => {
            const validationError = col.getIsValid?.(value) ?? null;
            setNationalityState({
                value: value,
                error: validationError,
            });
            setNewStudent((prev) => ({
                ...prev,
                nationality: value,
            }));
            setIsDirty(true);
        },
        [],
    );

    const handlePhoneNumberChange = useCallback(
        (value: string, col: EditableColumn) => {
            const validationError = col.getIsValid?.(value) ?? null;
            setPhoneNumberState({
                value: value,
                error: validationError,
            });
            setNewStudent((prev) => ({
                ...prev,
                phoneNumber: value,
            }));
            setIsDirty(true);
        },
        [],
    );

    const handleCreate = useCallback(async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        setShowError(false);

        try {
            await createStudent({
                input: newStudent,
            });

            // Reset form on success
            setNewStudent({
                name: "",
                email: "",
                dateOfBirth: null,
                gender: undefined,
            });
            setPhoneNumberState({ value: "", error: null });
            setNationalityState({ value: "EG", error: null });
            setGenderState({ value: undefined, open: false, error: null });
            setIsDirty(false);
            setShowSuccess(true);
            applySingleFilter(null);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "حدث خطأ أثناء إنشاء الطالب",
            );
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    }, [applySingleFilter, createStudent, isFormValid, newStudent]);

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && e.ctrlKey && isFormValid) {
                handleCreate().then((r) => r);
            }
        },
        [handleCreate, isFormValid],
    );

    const editableColumns = useMemo(
        () => columns.filter((c) => c.editable),
        [columns],
    );

    return (
        <>
            <StyledPaper
                elevation={2}
                isMobile={isMobile}
                onKeyDown={handleKeyDown}
            >
                <TitleContainer isMobile={isMobile}>
                    <TitleIcon />
                    <TitleTypography variant="h6" isMobile={isMobile}>
                        {strings.create}
                    </TitleTypography>
                </TitleContainer>
                <FieldsContainer isMobile={isMobile}>
                    {editableColumns.map((col) => (
                        <FieldWrapper
                            key={col.id}
                            isMobile={isMobile}
                            fieldWidth={getFieldWidth(col.type || "text")}
                        >
                            {col.type === "text" && col.id === "name" && (
                                <TextFieldComponent
                                    label={strings.name}
                                    value={newStudent.name}
                                    error={col.getIsValid?.(newStudent.name)}
                                    helperText={
                                        newStudent.name.trim() === "" && isDirty
                                            ? "الاسم مطلوب"
                                            : ""
                                    }
                                    placeholder="أدخل اسم الطالب"
                                    required={true}
                                    width="100%"
                                    onValueChange={handleNameChange}
                                />
                            )}
                            {col.type === "text" && col.id === "email" && (
                                <TextFieldComponent
                                    label={strings.email}
                                    value={newStudent.email || ""}
                                    error={col.getIsValid?.(newStudent.email)}
                                    placeholder="example@domain.com"
                                    type="email"
                                    width="100%"
                                    onValueChange={handleEmailChange}
                                />
                            )}
                            {col.type === "date" && (
                                <DateFieldComponent
                                    label={strings.dateOfBirth}
                                    value={newStudent.dateOfBirth}
                                    error={col.getIsValid?.(
                                        newStudent.dateOfBirth,
                                    )}
                                    width="100%"
                                    onValueChange={handleDateOfBirthChange}
                                />
                            )}
                            {col.type === "select" && col.id === "gender" && (
                                <GenderFieldComponent
                                    label={strings.gender}
                                    value={genderState.value}
                                    error={genderState.error}
                                    placeholder="اختر الجنس"
                                    options={col.options || []}
                                    open={genderState.open}
                                    width="100%"
                                    onValueChange={(value) =>
                                        handleGenderChange(value, col)
                                    }
                                    onOpenChange={(open) =>
                                        setGenderState((prev) => ({
                                            ...prev,
                                            open: open,
                                        }))
                                    }
                                />
                            )}
                            {col.type === "country" && (
                                <CountryFieldComponent
                                    label={strings.nationality}
                                    value={nationalityState.value}
                                    error={nationalityState.error}
                                    placeholder="اختر الجنسية"
                                    width="100%"
                                    onValueChange={(value) =>
                                        handleNationalityChange(value, col)
                                    }
                                />
                            )}
                            {col.type === "phone" && (
                                <PhoneFieldComponent
                                    label={strings.phoneNumber}
                                    value={phoneNumberState.value}
                                    error={phoneNumberState.error}
                                    width="100%"
                                    onValueChange={(value) =>
                                        handlePhoneNumberChange(value, col)
                                    }
                                />
                            )}
                        </FieldWrapper>
                    ))}
                </FieldsContainer>

                <ActionsContainer isMobile={isMobile}>
                    <CreateButton
                        variant="contained"
                        onClick={handleCreate}
                        disabled={!isFormValid || isLoading}
                        startIcon={
                            isLoading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <AddIcon />
                            )
                        }
                        isMobile={isMobile}
                        isFormValid={isFormValid}
                        title={
                            !isFormValid
                                ? "يرجى ملء جميع الحقول المطلوبة"
                                : "إنشاء طالب جديد (Ctrl+Enter)"
                        }
                    >
                        {isLoading ? "جاري الإنشاء..." : strings.create}
                    </CreateButton>
                </ActionsContainer>
            </StyledPaper>

            {/* Success/Error Snackbars */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={4000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <StyledAlert
                    onClose={() => setShowSuccess(false)}
                    severity="success"
                    variant="filled"
                    icon={<CheckCircleIcon />}
                >
                    تم إنشاء الطالب بنجاح!
                </StyledAlert>
            </Snackbar>

            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <StyledAlert
                    onClose={() => setShowError(false)}
                    severity="error"
                    variant="filled"
                    icon={<ErrorIcon />}
                >
                    {errorMessage}
                </StyledAlert>
            </Snackbar>
        </>
    );
};

export default CreateStudentRow;
