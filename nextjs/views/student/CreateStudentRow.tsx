"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
    useTheme,
    CircularProgress,
    Snackbar,
    useMediaQuery,
} from "@mui/material";
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
import {
    _ActionsContainer,
    _CreateButton,
    _FieldsContainer,
    _FieldWrapper,
    _StyledAlert,
    _StyledPaper,
    _TitleContainer,
    _TitleIcon,
    _TitleTypography,
} from "./components/CreateStudentRow.styles";

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
    });

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDirty, setIsDirty] = useState(false);

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

    const handleGenderChange = useCallback((value: Gender | undefined) => {
        setNewStudent((prev) => ({
            ...prev,
            gender: value,
        }));
        setIsDirty(true);
    }, []);

    const handleNationalityChange = useCallback((value: CountryCode) => {
        setNewStudent((prev) => ({
            ...prev,
            nationality: value,
        }));
        setIsDirty(true);
    }, []);

    const handlePhoneNumberChange = useCallback((value: string) => {
        setNewStudent((prev) => ({
            ...prev,
            phoneNumber: value,
        }));
        setIsDirty(true);
    }, []);

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
            <_StyledPaper
                elevation={2}
                isMobile={isMobile}
                onKeyDown={handleKeyDown}
            >
                <_TitleContainer isMobile={isMobile}>
                    <_TitleIcon />
                    <_TitleTypography variant="h6" isMobile={isMobile}>
                        {strings.create}
                    </_TitleTypography>
                </_TitleContainer>
                <_FieldsContainer isMobile={isMobile}>
                    {editableColumns.map((col) => (
                        <_FieldWrapper
                            key={col.id}
                            isMobile={isMobile}
                            fieldWidth={getFieldWidth(col.type || "text")}
                        >
                            {col.type === "text" && col.id === "name" && (
                                <TextFieldComponent
                                    label={strings.name}
                                    helperText={
                                        newStudent.name.trim() === "" && isDirty
                                            ? "الاسم مطلوب"
                                            : ""
                                    }
                                    placeholder="أدخل اسم الطالب"
                                    required={true}
                                    width="100%"
                                    onValueChange={handleNameChange}
                                    getIsValid={col.getIsValid}
                                />
                            )}
                            {col.type === "text" && col.id === "email" && (
                                <TextFieldComponent
                                    label={strings.email}
                                    placeholder="example@domain.com"
                                    type="email"
                                    width="100%"
                                    onValueChange={handleEmailChange}
                                    getIsValid={col.getIsValid}
                                />
                            )}
                            {col.type === "date" && (
                                <DateFieldComponent
                                    label={strings.dateOfBirth}
                                    width="100%"
                                    onValueChange={handleDateOfBirthChange}
                                    getIsValid={col.getIsValid}
                                />
                            )}
                            {col.type === "select" && col.id === "gender" && (
                                <GenderFieldComponent
                                    label={strings.gender}
                                    placeholder="اختر الجنس"
                                    options={col.options || []}
                                    width="100%"
                                    onValueChange={(value) =>
                                        handleGenderChange(value)
                                    }
                                    getIsValid={col.getIsValid}
                                />
                            )}
                            {col.type === "country" && (
                                <CountryFieldComponent
                                    label={strings.nationality}
                                    placeholder="اختر الجنسية"
                                    width="100%"
                                    onValueChange={(value) =>
                                        handleNationalityChange(value)
                                    }
                                    getIsValid={col.getIsValid}
                                />
                            )}
                            {col.type === "phone" && (
                                <PhoneFieldComponent
                                    label={strings.phoneNumber}
                                    width="100%"
                                    onValueChange={(value) =>
                                        handlePhoneNumberChange(value)
                                    }
                                    getIsValid={col.getIsValid}
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
                    تم إنشاء الطالب بنجاح!
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
                    {errorMessage}
                </_StyledAlert>
            </Snackbar>
        </>
    );
};

export default CreateStudentRow;
