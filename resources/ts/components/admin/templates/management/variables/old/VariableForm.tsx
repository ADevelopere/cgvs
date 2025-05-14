import { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller } from "react-hook-form";
import { TemplateVariable } from "@/contexts/template/template.types";

interface VariableFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TemplateVariable) => void;
    variable?: TemplateVariable | null;
}

const variableTypes = [
    { value: "text", label: "Text" },
    { value: "date", label: "Date" },
    { value: "number", label: "Number" },
    { value: "gender", label: "Gender" },
];

export default function VariableForm({
    open,
    onClose,
    onSubmit,
    variable = null,
}: VariableFormProps) {
    const { control, handleSubmit, reset, watch } = useForm<TemplateVariable>({
        defaultValues: {
            name: "",
            type: "text",
            description: "",
            preview_value: "",
            required: false,
        },
    });

    useEffect(() => {
        if (variable) {
            reset(variable);
        }
    }, [variable, reset]);

    const handleFormSubmit = (data: TemplateVariable) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {variable ? "Edit Variable" : "Add New Variable"}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label="Variable Name"
                                    error={!!error}
                                    helperText={
                                        error ? "This field is required" : ""
                                    }
                                    fullWidth
                                    disabled={variable?.is_key}
                                />
                            )}
                        />

                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select {...field} label="Type" disabled={variable?.is_key}>
                                        {variableTypes.map((type) => (
                                            <MenuItem
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    multiline
                                    rows={2}
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="required"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...field}
                                            checked={field.value || false}
                                        />
                                    }
                                    label="Required"
                                    disabled={variable?.is_key}
                                />
                            )}
                        />

                        <Controller
                            name="preview_value"
                            control={control}
                            render={({ field }) => {
                                const type = watch("type");

                                switch (type) {
                                    case "date":
                                        return (
                                            <LocalizationProvider
                                                dateAdapter={AdapterDateFns}
                                            >
                                                <DatePicker
                                                    label="Preview Value"
                                                    value={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
                                                              )
                                                            : null
                                                    }
                                                    onChange={(newValue) => {
                                                        field.onChange(
                                                            newValue
                                                                ? newValue.toISOString()
                                                                : ""
                                                        );
                                                    }}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        );
                                    case "number":
                                        return (
                                            <TextField
                                                {...field}
                                                label="Preview Value"
                                                type="number"
                                                fullWidth
                                            />
                                        );
                                    case "gender":
                                        return (
                                            <FormControl fullWidth>
                                                <InputLabel>
                                                    Preview Value
                                                </InputLabel>
                                                <Select
                                                    {...field}
                                                    label="Preview Value"
                                                >
                                                    <MenuItem value="male">
                                                        Male
                                                    </MenuItem>
                                                    <MenuItem value="female">
                                                        Female
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        );
                                    default: // text
                                        return (
                                            <TextField
                                                {...field}
                                                label="Preview Value"
                                                type="text"
                                                fullWidth
                                            />
                                        );
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {variable ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
