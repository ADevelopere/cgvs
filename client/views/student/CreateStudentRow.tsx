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
import { useStudentManagement } from "@/client/contexts/student/StudentManagementContext";
import { useStudentFilter } from "@/client/contexts/student/StudentFilterContext";
import { TextFilterOperation } from "@/types/filters";
import { useStudentTableManagement } from "@/client/contexts/student/StudentTableManagementContext";
import { useAppTranslation } from "@/client/locale";
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
} from "./components/CreateStudentRow.styles";
import { HammerIcon } from "lucide-react";
import { StudentCreateInput } from "@/client/graphql/generated/gql/graphql";

const MemoizedTextField = React.memo(TextFieldComponent);
const MemoizedDateField = React.memo(DateFieldComponent);
const MemoizedGenderField = React.memo(GenderFieldComponent);
const MemoizedCountryField = React.memo(CountryFieldComponent);
const MemoizedPhoneField = React.memo(PhoneFieldComponent);

const initialStudentState: StudentCreateInput = {
    name: "",
};

const CreateStudentRow = () => {
    const { createStudent } = useStudentManagement();
    const { setSearchFilter } = useStudentFilter();
    const { columns } = useStudentTableManagement();
    const strings = useAppTranslation("studentTranslations");
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
        return Object.values(fieldValidity).every((err) => err === null);
    }, [fieldValidity]);

    // Get field width based on type and screen size
    const getFieldWidth = useCallback(
        (colType: string) => {
            if (isMobile) return "100%";

            switch (colType) {
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
        [isMobile, isTablet],
    );

    const lastFilteredValue = useRef<string | undefined>(undefined);
    const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

    const handleNameChange = useCallback(
        (value: string | undefined, errorMessage: string | null) => {
            setNewStudent((prev) => ({ ...prev, name: value ?? "" }));
            setIsDirty(true);
            setFieldValidity((prev) => ({ ...prev, name: errorMessage }));

            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            debounceTimer.current = setTimeout(() => {
                if (value === lastFilteredValue.current) {
                    return;
                }
                lastFilteredValue.current = value;

                if (!value || value.trim() === "") {
                    setSearchFilter(null);
                } else {
                    setSearchFilter({
                        columnId: "name",
                        operation: TextFilterOperation.startsWith,
                        value: value,
                    });
                }
            }, 1500);
        },
        [setSearchFilter],
    );

    // Cleanup the debounce timer on unmount
    useEffect(
        () => () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        },
        [],
    );

    const handleChange = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (value: any, columnId: string, errorMessage: string | null) => {
            setNewStudent((prev) => ({ ...prev, [columnId]: value }));
            setIsDirty(true);
            setFieldValidity((prev) => ({ ...prev, [columnId]: errorMessage }));
        },
        [],
    );

    // Create a memoized map of handlers for all fields except 'name'
    const fieldChangeHandlers = useMemo(() => {
        const handlers: Record<
            string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (value: any, errorMessage: string | null) => void
        > = {};
        columns
            .filter((c) => c.editable && c.id !== "name")
            .forEach((col) => {
                handlers[col.id] = (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value: any,
                    errorMessage: string | null,
                ) => {
                    handleChange(value, col.id, errorMessage);
                };
            });
        return handlers;
    }, [columns, handleChange]);

    const handleCreate = useCallback(async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        setShowError(false);
        setErrorMessage("");

        try {
            await createStudent({
                input: newStudent,
            });

            // Reset form on success
            setNewStudent(initialStudentState);
            setFieldValidity({});
            setIsDirty(false);
            setShowSuccess(true);
            setSearchFilter(null);
            lastFilteredValue.current = undefined;
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
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
    }, [setSearchFilter, createStudent, isFormValid, newStudent]);

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
                <_FieldsContainer isMobile={isMobile}>
                    {editableColumns.map((col) => (
                        <_FieldWrapper
                            key={col.id}
                            isMobile={isMobile}
                            fieldWidth={getFieldWidth(col.type || "text")}
                        >
                            {col.type === "text" && col.id === "name" && (
                                <MemoizedTextField
                                    value={newStudent.name}
                                    errorMessage={fieldValidity["name"]}
                                    label={strings.name}
                                    helperText={
                                        newStudent?.name?.trim() === "" &&
                                        isDirty
                                            ? strings.nameRequired
                                            : ""
                                    }
                                    placeholder={strings.namePlaceholder}
                                    required={true}
                                    width="100%"
                                    onValueChange={handleNameChange}
                                    getIsValid={col.getIsValid}
                                />
                            )}
                            {col.type === "text" && col.id === "email" && (
                                <MemoizedTextField
                                    value={newStudent.email}
                                    errorMessage={fieldValidity["email"] ?? ""}
                                    label={strings.email}
                                    placeholder={strings.emailPlaceholder}
                                    type="email"
                                    width="100%"
                                    onValueChange={(value, errorMessage) =>
                                        fieldChangeHandlers[col.id]?.(
                                            value,
                                            errorMessage,
                                        )
                                    }
                                    getIsValid={col.getIsValid}
                                />
                            )}
                            {col.type === "date" && (
                                <MemoizedDateField
                                    value={newStudent.dateOfBirth}
                                    errorMessage={fieldValidity[col.id] ?? ""}
                                    label={strings.dateOfBirth}
                                    width="100%"
                                    onValueChange={fieldChangeHandlers[col.id]}
                                    getIsValid={col.getIsValid}
                                />
                            )}
                            {col.type === "select" && col.id === "gender" && (
                                <MemoizedGenderField
                                    value={newStudent.gender}
                                    errorMessage={fieldValidity["gender"] ?? ""}
                                    label={strings.gender}
                                    placeholder={strings.genderPlaceholder}
                                    options={col.options || []}
                                    width="100%"
                                    onValueChange={fieldChangeHandlers[col.id]}
                                    getIsValid={col.getIsValid}
                                />
                            )}
                            {col.type === "country" && (
                                <MemoizedCountryField
                                    value={newStudent.nationality ?? undefined}
                                    errorMessage={fieldValidity[col.id] ?? ""}
                                    label={strings.nationality}
                                    placeholder={strings.nationalityPlaceholder}
                                    width="100%"
                                    onValueChange={fieldChangeHandlers[col.id]}
                                    getIsValid={col.getIsValid}
                                />
                            )}
                            {col.type === "phone" && (
                                <MemoizedPhoneField
                                    value={newStudent.phoneNumber}
                                    errorMessage={fieldValidity[col.id] ?? ""}
                                    label={strings.phoneNumber}
                                    width="100%"
                                    onValueChange={fieldChangeHandlers[col.id]}
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
