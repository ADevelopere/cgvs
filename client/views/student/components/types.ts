import { Gender } from "@/client/graphql/generated/gql/graphql";

// Base props for all field components
export interface BaseFieldProps<T> {
  value: T | undefined;
  errorMessage: string | null;
  label: string;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  width?: string | number;
  onValueChange: (value: T | undefined, errorMessage: string | null) => void;
  onBlur?: () => void;
  getIsValid?: (value?: T) => string | null | undefined;
}

// Text field specific props
export interface TextFieldProps extends BaseFieldProps<string> {
  type?: "text" | "email";
}

// Date field specific props (value is string but validator uses Date)
export interface DateFieldProps
  extends Omit<BaseFieldProps<string>, "getIsValid"> {
  getIsValid?: (value: Date) => string | null | undefined;
}

// Select/Gender field specific props
export interface GenderFieldProps
  extends BaseFieldProps<Gender | undefined | null> {
  options: Array<{ value: Gender; label: string }>;
}
