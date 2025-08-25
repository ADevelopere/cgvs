// Base props for all field components
export interface BaseFieldProps<T = unknown> {
    label: string;
    value: T;
    error?: string | null;
    helperText?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    width?: string | number;
    onValueChange: (value: T) => void;
    onBlur?: () => void;
}

// Text field specific props
export interface TextFieldProps extends BaseFieldProps<string> {
    type?: "text" | "email";
}

// Select/Gender field specific props
export interface GenderFieldProps extends BaseFieldProps<string | undefined> {
    options: Array<{ value: string; label: string }>;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}