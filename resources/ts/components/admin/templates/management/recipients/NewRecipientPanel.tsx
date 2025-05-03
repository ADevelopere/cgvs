import { useState, useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
    InputAdornment,
    styled,
    alpha,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import KeyIcon from "@mui/icons-material/Key";
import { useTemplateVariables } from "@/contexts/template/TemplateVariablesContext";
import { useTemplateRecipients } from "@/contexts/template/TemplateRecipientsContext";
import { validateVariableValue } from "@/utils/template/validation";
import { TemplateVariable } from "@/contexts/template/template.types";
import { useAppTheme } from "@/contexts/ThemeContext";

// Styled components for enhanced visuals
const StyledPaper = styled(Paper)(() => {
    const { theme } = useAppTheme();

    return {
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        backdropFilter: "blur(8px)",
        transition: theme.transitions.create(
            ["box-shadow", "background-color"],
            {
                duration: theme.transitions.duration.standard,
            },
        ),
        "&:hover": {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
        },
        height: "100%",
        display: "flex",
        flexDirection: "column",
    };
});

const StyledTextField = styled(TextField)(() => {
    const { theme } = useAppTheme();
    return {
        "& .MuiOutlinedInput-root": {
            transition: theme.transitions.create([
                "border-color",
                "box-shadow",
            ]),
            "&.Mui-focused": {
                boxShadow: `${alpha(theme.palette.primary.main, 0.15)} 0 0 0 2px`,
            },
        },
    };
});

export default function NewRecipientPanel() {
    const { theme } = useAppTheme();

    const { variables } = useTemplateVariables();
    const { recipients, createRecipient } = useTemplateRecipients();

    // Create existingValues map for key variables
    const existingValuesMap = useMemo(() => {
        const map = new Map<string, Set<string>>();
        variables.forEach((variable) => {
            if (variable.is_key) {
                const values = new Set<string>();
                recipients.forEach((recipient) => {
                    values.add(recipient.data[variable.name]?.toString() || "");
                });
                map.set(variable.name, values);
            }
        });
        return map;
    }, [variables, recipients]);

    // Form state
    const [formData, setFormData] = useState<Record<string, string | number>>(
        {},
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validate a single field
    const validateField = (variable: TemplateVariable, value: any) => {
        const existingValues = variable.is_key
            ? existingValuesMap.get(variable.name)
            : undefined;
        return validateVariableValue(variable, value, existingValues);
    };

    // Check if form is valid
    const isFormValid = useMemo(() => {
        return variables.every((variable) => {
            const value = formData[variable.name];
            const validationResult = validateField(variable, value);
            return validationResult.isValid;
        });
    }, [formData, variables]);

    // Handle field change
    const handleChange = (variable: TemplateVariable, value: any) => {
        const validationResult = validateField(variable, value);

        // Convert the value to the correct type based on the variable type
        let processedValue: string | number;
        switch (variable.type) {
            case "number":
                processedValue = value === "" ? "" : Number(value);
                break;
            case "date":
                processedValue = value ? new Date(value).toISOString() : "";
                break;
            case "gender":
                processedValue = value || "";
                break;
            default: // text
                processedValue = String(value);
        }

        setFormData((prev) => ({
            ...prev,
            [variable.name]: processedValue,
        }));

        setErrors((prev) => ({
            ...prev,
            [variable.name]: validationResult.error || "",
        }));
    };

    // Handle form submit
    const handleSubmit = async () => {
        try {
            // Final validation
            const validationErrors: Record<string, string> = {};
            let isValid = true;

            variables.forEach((variable) => {
                const value = formData[variable.name];
                const validationResult = validateField(variable, value);
                if (!validationResult.isValid) {
                    validationErrors[variable.name] =
                        validationResult.error || "";
                    isValid = false;
                }
            });

            if (!isValid) {
                setErrors(validationErrors);
                return;
            }

            await createRecipient(formData);

            // Reset form after successful submission
            setFormData({});
            setErrors({});
        } catch (error) {
            console.error("Error saving recipient:", error);
        }
    };

    // Render input field based on variable type
    const renderInput = (variable: TemplateVariable) => {
        const value = formData[variable.name] || "";
        const error = errors[variable.name];
        const hasError = !!error;

        const commonProps = {
            error: hasError,
            helperText: error,
            fullWidth: true,
            size: "small" as const,
            required: variable.required || variable.is_key,
            sx: { mb: 2 },
        };

        switch (variable.type) {
            case "date":
                return (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={variable.name}
                            value={value ? new Date(value) : null}
                            onChange={(newValue) => {
                                handleChange(
                                    variable,
                                    newValue?.toISOString() || "",
                                );
                            }}
                            slotProps={{
                                textField: {
                                    ...commonProps,
                                    InputProps: variable.is_key
                                        ? {
                                              startAdornment: (
                                                  <InputAdornment position="start">
                                                      <KeyIcon
                                                          color={
                                                              hasError
                                                                  ? "error"
                                                                  : "primary"
                                                          }
                                                      />
                                                  </InputAdornment>
                                              ),
                                          }
                                        : undefined,
                                },
                            }}
                        />
                    </LocalizationProvider>
                );
            case "number":
                return (
                    <StyledTextField
                        {...commonProps}
                        type="number"
                        label={variable.name}
                        value={value}
                        onChange={(e) => handleChange(variable, e.target.value)}
                        InputProps={
                            variable.is_key
                                ? {
                                      startAdornment: (
                                          <InputAdornment position="start">
                                              <KeyIcon
                                                  color={
                                                      hasError
                                                          ? "error"
                                                          : "primary"
                                                  }
                                              />
                                          </InputAdornment>
                                      ),
                                  }
                                : undefined
                        }
                    />
                );
            case "gender":
                return (
                    <StyledTextField
                        {...commonProps}
                        select
                        label={variable.name}
                        value={value}
                        onChange={(e) => handleChange(variable, e.target.value)}
                        slotProps={{
                            select: {
                                native: true,
                            },
                            input: variable.is_key
                                ? {
                                      startAdornment: (
                                          <InputAdornment position="start">
                                              <KeyIcon
                                                  color={
                                                      hasError
                                                          ? "error"
                                                          : "primary"
                                                  }
                                              />
                                          </InputAdornment>
                                      ),
                                  }
                                : undefined,
                        }}
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </StyledTextField>
                );
            default: // text
                return (
                    <StyledTextField
                        {...commonProps}
                        type="text"
                        label={variable.name}
                        value={value}
                        onChange={(e) => handleChange(variable, e.target.value)}
                        slotProps={{
                            input: variable.is_key
                                ? {
                                      startAdornment: (
                                          <InputAdornment position="start">
                                              <KeyIcon
                                                  color={
                                                      hasError
                                                          ? "error"
                                                          : "primary"
                                                  }
                                              />
                                          </InputAdornment>
                                      ),
                                  }
                                : undefined,
                        }}
                    />
                );
        }
    };

    // Group variables into required and optional
    const { requiredVariables, optionalVariables } = useMemo(() => {
        const required: TemplateVariable[] = [];
        const optional: TemplateVariable[] = [];

        variables.forEach((variable) => {
            if (variable.required || variable.is_key) {
                required.push(variable);
            } else {
                optional.push(variable);
            }
        });

        return {
            requiredVariables: required,
            optionalVariables: optional,
        };
    }, [variables]);

    return (
        <StyledPaper elevation={0}>
            <Typography variant="h6" gutterBottom>
                Add New Recipient
            </Typography>

            {/* Required Fields Section */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="subtitle2"
                    color="primary"
                    gutterBottom
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    Required Information
                </Typography>
                {requiredVariables.map((variable) => (
                    <Box key={variable.name}>{renderInput(variable)}</Box>
                ))}
            </Box>

            {/* Optional Fields Section */}
            {optionalVariables.length > 0 && (
                <>
                    <Divider sx={{ my: 3 }} />
                    <Box>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ mb: 2 }}
                        >
                            Optional Information
                        </Typography>
                        {optionalVariables.map((variable) => (
                            <Box key={variable.name}>
                                {renderInput(variable)}
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            {/* Actions */}
            <Box sx={{ mt: "auto", pt: 3 }}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    fullWidth
                    sx={{
                        py: 1.5,
                        backgroundColor: theme.palette.primary.main,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                        },
                        "&.Mui-disabled": {
                            backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.4,
                            ),
                            color: "white",
                        },
                    }}
                >
                    Add Recipient
                </Button>
            </Box>
        </StyledPaper>
    );
}
