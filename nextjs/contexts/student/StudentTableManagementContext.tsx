import { EditableColumn } from "@/types/table.type";
import { STUDENT_TABLE_COLUMNS } from "@/components/admin/student/column";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useStudentManagement } from "./StudentManagementContext";
import {
    StudentGender,
    CountryCode,
    UpdateStudentInput,
} from "@/graphql/generated/types";
import validator from "validator";
import {
    isValidCountryCode,
    isValidPhoneNumber,
} from "@/utils/student/validators";
import useAppTranslation from "@/locale/useAppTranslation";

interface StudentTableManagementContextType {
    columns: EditableColumn[];
}

const StudentTableManagementContext = createContext<
    StudentTableManagementContextType | undefined
>(undefined);

export const useStudentTableManagement = () => {
    const context = useContext(StudentTableManagementContext);
    if (!context) {
        throw new Error(
            "useStudentTableManagement must be used within a StudentTableManagementProvider",
        );
    }
    return context;
};

export const StudentTableManagementProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { updateStudent } = useStudentManagement();
    const strings = useAppTranslation("studentTranslations");
    // Validator functions
    const validateFullName = useCallback(
        (value: string): string | null | undefined => {
            if (!value) return strings?.nameRequired ?? "Name is required";
            const words = value.trim().split(/\s+/);
            if (words.length < 3)
                return (
                    strings?.fullNameMinWords ??
                    "Full name must contain at least three words"
                );
            if (!words.every((word) => word.length >= 3)) {
                return (
                    strings?.nameMinLength ??
                    "Each name part must be at least 3 characters long"
                );
            }
            // Unicode regex for letters from any language plus allowed special characters
            const nameRegex = /^[\p{L}\p{M}'-]+$/u;
            if (!words.every((word) => nameRegex.test(word))) {
                return (
                    strings?.nameInvalidChars ??
                    "Name can only contain letters, hyphens and apostrophes"
                );
            }
            return null;
        },
        [strings],
    );

    const validateEmail = useCallback(
        (value: string | null | undefined): string | null => {
            // Handle null/undefined/empty values
            if (!value) {
                return null; // Allow empty values as per current requirements
            }

            // Trim the value to handle whitespace
            const trimmedValue = value.trim();

            // Check if empty after trim
            if (!trimmedValue) {
                return null; // Allow empty values as per current requirements
            }

            // Validate email format
            return validator.isEmail(trimmedValue)
                ? null
                : (strings?.emailInvalid ?? "Invalid email format");
        },
        [strings],
    );

    const validateGender = useCallback(
        (value: string): string | null => {
            // @ts-ignore keep it for now
            // if (!value) return strings?.genderRequired ?? "Gender is required";
            return ["MALE", "FEMALE"].includes(value.toLocaleUpperCase())
                ? null
                : (strings?.genderInvalid ?? "Invalid gender value");
        },
        [strings],
    );

    const validateNationality = useCallback(
        (value: string): string | null | undefined => {
            // @ts-ignore keep it for now
            // if (!value) return strings?.nationalityRequired ?? "Nationality is required";
            return isValidCountryCode(value)
                ? null
                : (strings?.nationalityInvalid ?? "Invalid country code");
        },
        [strings],
    );

    const validateDateOfBirth = useCallback(
        (value: string): string | null | undefined => {
            // @ts-ignore keep it for now
            // if (!value) return strings?.dateOfBirthRequired ?? "Date of birth is required";
            if (!validator.isDate(value))
                return strings?.dateOfBirthInvalid ?? "Invalid date format";
            const date = new Date(value);
            const now = new Date();
            return date <= now
                ? null
                : (strings?.dateOfBirthFuture ??
                      "Date cannot be in the future");
        },
        [strings],
    );

    const validatePhoneNumber = useCallback(
        (value: string): string | null | undefined => {
            // @ts-ignore keep it for now
            // if (!value) return strings?.phoneNumberRequired ?? "Phone number is required";
            return isValidPhoneNumber(value)
                ? null
                : (strings?.phoneNumberInvalid ??
                      "Invalid phone number format");
        },
        [strings],
    );

    const handleUpdateCell = useCallback(
        async (
            rowId: string | number,
            columnId: string,
            value: any,
        ): Promise<void> => {
            console.log("Updating cell", { rowId, columnId, value });
            const input: UpdateStudentInput = {
                id: String(rowId),
                [columnId]: value,
            };

            // Type conversion based on column
            switch (columnId) {
                case "date_of_birth":
                    input.date_of_birth = value
                        ? new Date(value).toISOString().split("T")[0]
                        : null;
                    break;
                case "gender":
                    input.gender = value as StudentGender;
                    break;
                case "nationality":
                    input.nationality = value as CountryCode;
                    break;
            }

            await updateStudent({ input });
        },
        [updateStudent],
    );

    const columns = useMemo(
        () =>
            STUDENT_TABLE_COLUMNS.map((column): EditableColumn => {
                if (!column.editable) return column;

                const enhancedColumn: EditableColumn = {
                    ...column,
                    onUpdate: (rowId: string | number, value: any) =>
                        handleUpdateCell(
                            rowId,
                            column.accessor as string,
                            value,
                        ),
                    getIsValid: () => null, // Default validator
                };

                // Add specific validators based on column type
                switch (column.accessor) {
                    case "name":
                        enhancedColumn.getIsValid = validateFullName;
                        break;
                    case "email":
                        enhancedColumn.getIsValid = validateEmail;
                        break;
                    case "gender":
                        enhancedColumn.getIsValid = validateGender;
                        break;
                    case "nationality":
                        enhancedColumn.getIsValid = validateNationality;
                        break;
                    case "date_of_birth":
                        enhancedColumn.getIsValid = validateDateOfBirth;
                        break;
                    case "phone_number":
                        enhancedColumn.getIsValid = validatePhoneNumber;
                        break;
                }

                return enhancedColumn;
            }),
        [
            handleUpdateCell,
            validateFullName,
            validateEmail,
            validateGender,
            validateNationality,
            validateDateOfBirth,
            validatePhoneNumber,
        ],
    );

    const value = useMemo(
        () => ({
            columns,
        }),
        [columns],
    );

    return (
        <StudentTableManagementContext.Provider value={value}>
            {children}
        </StudentTableManagementContext.Provider>
    );
};
