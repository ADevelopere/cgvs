"use client";

import React, { useState, useMemo } from "react";
import {
    Button,
    TextField,
    Box,
    Autocomplete,
    MenuItem,
    useTheme,
    Paper,
    CircularProgress,
    Alert,
    Snackbar,
    useMediaQuery,
} from "@mui/material";
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
import { MuiTelInput, MuiTelInputCountry } from "mui-tel-input";
import countries, { CountryType } from "@/utils/country";
import Image from "next/image";

const preferredCountries: MuiTelInputCountry[] = [
    "SA",
    "PS",
    "YE",
    "SY",
    "EG",
    "KW",
    "QA",
    "OM",
    "BH",
    "LB",
    "JO",
    "IQ",
    "LY",
    "AE",
    "TN",
    "DZ",
    "MA",
    "SD",
    "MR",
    "SO",
    "ID",
    "KM",
    "DJ",
    "ER",
    "SS",
    "EH",
];

const CreateStudentRow = () => {
    const { createStudent } = useStudentManagement();
    const { applySingleFilter } = useStudentFilter();
    const { columns } = useStudentTableManagement();
    const strings = useAppTranslation("studentTranslations");
    const countryStrings = useAppTranslation("countryTranslations");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

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
        const nameColumn = columns.find(c => c.id === "name");
        const nameError = nameColumn?.getIsValid?.(newStudent.name);
        return !nameError && newStudent.name.trim() !== "";
    }, [newStudent.name, columns]);

    // Get field width based on type and screen size
    const getFieldWidth = (colType: string) => {
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
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
        setIsDirty(true);

        // Apply filtering when name input changes
        if (name === "name") {
            if (value.trim() === "") {
                // Clear filter when input is empty
                applySingleFilter(null);
            } else {
                // Apply contains filter for name
                applySingleFilter({
                    columnId: "name",
                    operation: TextFilterOperation.STARTS_WITH,
                    value: value,
                });
            }
        }
    };

    const handleCreate = async () => {
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
            setErrorMessage(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الطالب");
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.ctrlKey && isFormValid) {
            handleCreate();
        }
    };

    const editableColumns = columns.filter((c) => c.editable);

    return (
        <>
            <Paper
                elevation={2}
                sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "stretch" : "center",
                    p: { xs: 2, sm: 3 },
                    gap: { xs: 2, sm: 3 },
                    mx: 1,
                    my: 1,
                    borderRadius: 2,
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
                }}
                onKeyDown={handleKeyDown}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: isMobile ? "auto" : "140px",
                        flexShrink: 0,
                        mb: isMobile ? 1 : 0,
                    }}
                >
                    <AddIcon 
                        sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: "1.5rem",
                        }} 
                    />
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            fontSize: isMobile ? "1.1rem" : "1.25rem",
                        }}
                    >
                        {strings.create}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: { xs: 2, sm: 3 },
                        overflowX: isMobile ? "visible" : "auto",
                        flexGrow: 1,
                        p: 1,
                        borderRadius: 1,
                        position: "relative",
                        scrollBehavior: "smooth",
                        
                        // Custom scrollbar styling
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
                        
                        // Scroll shadows
                        "&::before, &::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            width: "20px",
                            pointerEvents: "none",
                            zIndex: 1,
                            display: isMobile ? "none" : "block",
                        },
                        "&::before": {
                            left: 0,
                            background: `linear-gradient(to right, ${theme.palette.background.paper}, transparent)`,
                        },
                        "&::after": {
                            right: 0,
                            background: `linear-gradient(to left, ${theme.palette.background.paper}, transparent)`,
                        },
                    }}
                >
                    {editableColumns.map((col) => (
                        <Box 
                            key={col.id} 
                            sx={{ 
                                width: getFieldWidth(col.type || "text"),
                                flexShrink: isMobile ? 1 : 0,
                                position: "relative",
                                transition: "all 0.3s ease",
                            }}
                        >
                        {col.type === "text" && col.id === "name" && (
                            <Box sx={{ position: "relative" }}>
                                <TextField
                                    label={
                                        <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            {strings.name}
                                            <Typography component="span" sx={{ color: theme.palette.error.main, fontWeight: "bold" }}>
                                                *
                                            </Typography>
                                        </Box>
                                    }
                                    name={col.id}
                                    value={newStudent.name}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    required
                                    error={col.getIsValid?.(newStudent.name) !== null}
                                    helperText={col.getIsValid?.(newStudent.name) || (newStudent.name.trim() === "" && isDirty ? "الاسم مطلوب" : "")}
                                    placeholder="أدخل اسم الطالب"
                                    aria-describedby={col.getIsValid?.(newStudent.name) ? `${col.id}-error` : undefined}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            transition: "all 0.3s ease",
                                            backgroundColor: theme.palette.background.paper,
                                            "&:hover": {
                                                backgroundColor: theme.palette.action.hover,
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.primary.main,
                                                    borderWidth: "2px",
                                                },
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: theme.palette.background.paper,
                                                transform: "scale(1.02)",
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.primary.main,
                                                    borderWidth: "2px",
                                                },
                                            },
                                            "&.Mui-error": {
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.error.main,
                                                },
                                            },
                                        },
                                        "& .MuiInputLabel-root": {
                                            "&.Mui-focused": {
                                                color: theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                />
                                {col.getIsValid?.(newStudent.name) && (
                                    <ErrorIcon
                                        sx={{
                                            position: "absolute",
                                            right: 8,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: theme.palette.error.main,
                                            fontSize: "1.2rem",
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                        {col.type === "text" && col.id === "email" && (
                            <Box sx={{ position: "relative" }}>
                                <TextField
                                    label={strings.email}
                                    name={col.id}
                                    value={newStudent.email || ""}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    type="email"
                                    error={col.getIsValid?.(newStudent.email) !== null}
                                    helperText={col.getIsValid?.(newStudent.email) || ""}
                                    placeholder="example@domain.com"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            transition: "all 0.3s ease",
                                            backgroundColor: theme.palette.background.paper,
                                            "&:hover": {
                                                backgroundColor: theme.palette.action.hover,
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.secondary.main,
                                                    borderWidth: "2px",
                                                },
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: theme.palette.background.paper,
                                                transform: "scale(1.02)",
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.secondary.main,
                                                    borderWidth: "2px",
                                                },
                                            },
                                        },
                                        "& .MuiInputLabel-root": {
                                            "&.Mui-focused": {
                                                color: theme.palette.secondary.main,
                                            },
                                        },
                                    }}
                                />
                                {col.getIsValid?.(newStudent.email) && (
                                    <ErrorIcon
                                        sx={{
                                            position: "absolute",
                                            right: 8,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: theme.palette.error.main,
                                            fontSize: "1.2rem",
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                        {col.type === "date" && (
                            <Box sx={{ position: "relative" }}>
                                <TextField
                                    label={strings.dateOfBirth}
                                    name={col.id}
                                    type="date"
                                    value={newStudent.dateOfBirth || ""}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={col.getIsValid?.(newStudent.dateOfBirth) !== null}
                                    helperText={col.getIsValid?.(newStudent.dateOfBirth) || ""}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            transition: "all 0.3s ease",
                                            backgroundColor: theme.palette.background.paper,
                                            "&:hover": {
                                                backgroundColor: theme.palette.action.hover,
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.info.main,
                                                    borderWidth: "2px",
                                                },
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: theme.palette.background.paper,
                                                transform: "scale(1.02)",
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.info.main,
                                                    borderWidth: "2px",
                                                },
                                            },
                                        },
                                        "& .MuiInputLabel-root": {
                                            "&.Mui-focused": {
                                                color: theme.palette.info.main,
                                            },
                                        },
                                    }}
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                    }}
                                />
                                {col.getIsValid?.(newStudent.dateOfBirth) && (
                                    <ErrorIcon
                                        sx={{
                                            position: "absolute",
                                            right: 8,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: theme.palette.error.main,
                                            fontSize: "1.2rem",
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                        {col.type === "select" && col.id === "gender" && (
                            <Box sx={{ position: "relative" }}>
                                <TextField
                                    select
                                    label={strings.gender}
                                    name={col.id}
                                    value={genderState.value ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const validationError =
                                            col.getIsValid?.(value) ?? null;
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
                                    }}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={genderState.error !== null}
                                    helperText={genderState.error || ""}
                                    placeholder="اختر الجنس"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            transition: "all 0.3s ease",
                                            backgroundColor: theme.palette.background.paper,
                                            "&:hover": {
                                                backgroundColor: theme.palette.action.hover,
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.warning.main,
                                                    borderWidth: "2px",
                                                },
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: theme.palette.background.paper,
                                                transform: "scale(1.02)",
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.warning.main,
                                                    borderWidth: "2px",
                                                },
                                            },
                                        },
                                        "& .MuiInputLabel-root": {
                                            "&.Mui-focused": {
                                                color: theme.palette.warning.main,
                                            },
                                        },
                                    }}
                                    slotProps={{
                                        select: {
                                            open: genderState.open,
                                            onClose: () =>
                                                setGenderState((prev) => ({
                                                    ...prev,
                                                    open: false,
                                                })),
                                        },
                                    }}
                                >
                                    {col.options?.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {genderState.error && (
                                    <ErrorIcon
                                        sx={{
                                            position: "absolute",
                                            right: 8,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: theme.palette.error.main,
                                            fontSize: "1.2rem",
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                        {col.type === "country" && (
                            <Box sx={{ position: "relative" }}>
                                <Autocomplete
                                    fullWidth
                                    options={countries}
                                    autoHighlight
                                    value={
                                        countries.find(
                                            (c) =>
                                                c.code ===
                                                nationalityState.value,
                                        ) || countries[0]
                                    }
                                    onChange={(_, newValue) => {
                                        if (newValue) {
                                            const validationError =
                                                col.getIsValid?.(
                                                    newValue.code,
                                                ) ?? null;
                                            setNationalityState({
                                                value: newValue.code,
                                                error: validationError,
                                            });
                                            setNewStudent((prev) => ({
                                                ...prev,
                                                nationality: newValue.code,
                                            }));
                                            setIsDirty(true);
                                        }
                                    }}
                                    getOptionLabel={(option) =>
                                        countryStrings[option.code] ||
                                        option.code
                                    }
                                    renderOption={(
                                        props: React.HTMLAttributes<HTMLLIElement> & {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            key: any;
                                        },
                                        option: CountryType,
                                    ) => {
                                        // key is extracted from props to prevent it from being passed to the DOM
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        const { key, ...optionProps } = props;
                                        return (
                                            <Box
                                                key={option.code}
                                                component="li"
                                                sx={{
                                                    "& > img": {
                                                        mr: 1,
                                                        flexShrink: 0,
                                                    },
                                                    transition: "background-color 0.2s ease",
                                                    "&:hover": {
                                                        backgroundColor: theme.palette.action.hover,
                                                    },
                                                }}
                                                {...optionProps}
                                            >
                                                <Image
                                                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                    alt=""
                                                    width={20}
                                                    height={15}
                                                    style={{
                                                        objectFit: "cover",
                                                    }}
                                                    loading="lazy"
                                                />
                                                {countryStrings[option.code] ||
                                                    option.code}
                                            </Box>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={strings.nationality}
                                            variant="outlined"
                                            size="small"
                                            error={
                                                nationalityState.error !== null
                                            }
                                            helperText={nationalityState.error || ""}
                                            placeholder="اختر الجنسية"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    transition: "all 0.3s ease",
                                                    backgroundColor: theme.palette.background.paper,
                                                    "&:hover": {
                                                        backgroundColor: theme.palette.action.hover,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.palette.success.main,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "&.Mui-focused": {
                                                        backgroundColor: theme.palette.background.paper,
                                                        transform: "scale(1.02)",
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.palette.success.main,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    "&.Mui-focused": {
                                                        color: theme.palette.success.main,
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                                {nationalityState.error && (
                                    <ErrorIcon
                                        sx={{
                                            position: "absolute",
                                            right: 8,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: theme.palette.error.main,
                                            fontSize: "1.2rem",
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                        {col.type === "phone" && (
                            <Box sx={{ position: "relative" }}>
                                <MuiTelInput
                                    label={strings.phoneNumber}
                                    value={phoneNumberState.value}
                                    onChange={(value: string) => {
                                        const validationError =
                                            col.getIsValid?.(value) ?? null;
                                        setPhoneNumberState({
                                            value: value,
                                            error: validationError,
                                        });
                                        setNewStudent((prev) => ({
                                            ...prev,
                                            phoneNumber: value,
                                        }));
                                        setIsDirty(true);
                                    }}
                                    langOfCountryName={"ar"}
                                    defaultCountry={"EG"}
                                    focusOnSelectCountry={true}
                                    excludedCountries={["IL"]}
                                    preferredCountries={preferredCountries}
                                    fullWidth
                                    error={phoneNumberState.error !== null}
                                    helperText={phoneNumberState.error || ""}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            margin: 0,
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            flexGrow: 1,
                                            transition: "all 0.3s ease",
                                            backgroundColor: theme.palette.background.paper,
                                            "&:hover": {
                                                backgroundColor: theme.palette.action.hover,
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.info.light,
                                                    borderWidth: "2px",
                                                },
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: theme.palette.background.paper,
                                                transform: "scale(1.02)",
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.palette.info.light,
                                                    borderWidth: "2px",
                                                },
                                            },
                                            "&.Mui-error": {
                                                backgroundColor: `${theme.palette.error.main}10`,
                                            },
                                        },
                                        "& .MuiInputBase-input": {
                                            paddingBlock: 1,
                                            paddingInline: 2,
                                            width: "100%",
                                        },
                                        "& .MuiInputLabel-root": {
                                            "&.Mui-focused": {
                                                color: theme.palette.info.light,
                                            },
                                        },
                                    }}
                                />
                                {phoneNumberState.error && (
                                    <ErrorIcon
                                        sx={{
                                            position: "absolute",
                                            right: 8,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: theme.palette.error.main,
                                            fontSize: "1.2rem",
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                        </Box>
                    ))}
                </Box>
                
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: 2,
                        alignItems: "center",
                        mt: isMobile ? 2 : 0,
                        ml: isMobile ? 0 : 2,
                        flexShrink: 0,
                    }}
                >
                    <Button
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
                        sx={{
                            minWidth: isMobile ? "100%" : 120,
                            height: 40,
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            background: isFormValid 
                                ? `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`
                                : theme.palette.action.disabledBackground,
                            border: `2px solid ${theme.palette.primary.main}`,
                            color: isFormValid ? theme.palette.primary.contrastText : theme.palette.text.disabled,
                            textTransform: "none",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                                background: isFormValid 
                                    ? `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`
                                    : theme.palette.action.disabledBackground,
                                transform: isFormValid ? "translateY(-2px) scale(1.05)" : "none",
                                boxShadow: isFormValid ? theme.shadows[8] : "none",
                            },
                            "&:active": {
                                transform: isFormValid ? "translateY(0) scale(1.02)" : "none",
                            },
                            "&.Mui-disabled": {
                                color: theme.palette.text.disabled,
                                background: theme.palette.action.disabledBackground,
                                border: `2px solid ${theme.palette.action.disabled}`,
                            },
                        }}
                        title={!isFormValid ? "يرجى ملء جميع الحقول المطلوبة" : "إنشاء طالب جديد (Ctrl+Enter)"}
                    >
                        {isLoading ? "جاري الإنشاء..." : strings.create}
                    </Button>
                </Box>
            </Paper>
            
            {/* Success/Error Snackbars */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={4000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setShowSuccess(false)}
                    severity="success"
                    variant="filled"
                    icon={<CheckCircleIcon />}
                    sx={{
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                            fontSize: "1.5rem",
                        },
                    }}
                >
                    تم إنشاء الطالب بنجاح!
                </Alert>
            </Snackbar>
            
            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setShowError(false)}
                    severity="error"
                    variant="filled"
                    icon={<ErrorIcon />}
                    sx={{
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                            fontSize: "1.5rem",
                        },
                    }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateStudentRow;
