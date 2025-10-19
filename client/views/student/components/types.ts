import { Gender } from "@/client/graphql/generated/gql/graphql";

// Base props for all field components
export interface BaseFieldProps<T = unknown> {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getIsValid?: (value: any) => string | null | undefined;
}

// Text field specific props
export interface TextFieldProps extends BaseFieldProps<string> {
  type?: "text" | "email";
}

// Select/Gender field specific props
export interface GenderFieldProps
  extends BaseFieldProps<Gender | undefined | null> {
  options: Array<{ value: Gender; label: string }>;
}
