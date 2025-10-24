# Edit Renderers - Complete Implementation

**Directory: `client/components/Table/renderers/edit/`**

Reusable edit renderers for inline cell editing.

## TextEditRenderer.tsx

```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextField } from '@mui/material';

export interface TextEditRendererProps<TRowData> {
  row: TRowData;
  onSave: (value: unknown) => Promise<void>;
  onCancel: () => void;
  accessor: (row: TRowData) => string;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  placeholder?: string;
}

export const TextEditRenderer = <TRowData,>({
  row,
  onSave,
  onCancel,
  accessor,
  minLength,
  maxLength,
  pattern,
  required = false,
  placeholder,
}: TextEditRendererProps<TRowData>) => {
  const initialValue = accessor(row) || '';
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const validate = useCallback((val: string): string | null => {
    if (required && !val.trim()) {
      return 'This field is required';
    }
    if (minLength && val.length < minLength) {
      return `Minimum length is ${minLength} characters`;
    }
    if (maxLength && val.length > maxLength) {
      return `Maximum length is ${maxLength} characters`;
    }
    if (pattern && !pattern.test(val)) {
      return 'Invalid format';
    }
    return null;
  }, [required, minLength, maxLength, pattern]);

  const handleSave = useCallback(async () => {
    const validationError = validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSave(value);
    } catch (err) {
      setError('Failed to save');
    }
  }, [value, validate, onSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  }, [handleSave, onCancel]);

  return (
    <TextField
      inputRef={inputRef}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        setError(null);
      }}
      onKeyDown={handleKeyDown}
      onBlur={handleSave}
      error={!!error}
      helperText={error}
      placeholder={placeholder}
      fullWidth
      size="small"
      variant="outlined"
      slotProps={{
        input: {
          sx: { fontSize: '0.875rem' },
        },
      }}
    />
  );
};

TextEditRenderer.displayName = 'TextEditRenderer';
```

## NumberEditRenderer.tsx

```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextField } from '@mui/material';

export interface NumberEditRendererProps<TRowData> {
  row: TRowData;
  onSave: (value: unknown) => Promise<void>;
  onCancel: () => void;
  accessor: (row: TRowData) => number | null;
  minValue?: number;
  maxValue?: number;
  decimalPlaces?: number;
  required?: boolean;
  prefix?: string;
  suffix?: string;
}

export const NumberEditRenderer = <TRowData,>({
  row,
  onSave,
  onCancel,
  accessor,
  minValue,
  maxValue,
  decimalPlaces,
  required = false,
  prefix,
  suffix,
}: NumberEditRendererProps<TRowData>) => {
  const initialValue = accessor(row);
  const [value, setValue] = useState(initialValue?.toString() || '');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const validate = useCallback((val: string): string | null => {
    if (required && !val.trim()) {
      return 'This field is required';
    }

    if (val.trim()) {
      const num = parseFloat(val);
      if (isNaN(num)) {
        return 'Must be a valid number';
      }
      if (minValue !== undefined && num < minValue) {
        return `Minimum value is ${minValue}`;
      }
      if (maxValue !== undefined && num > maxValue) {
        return `Maximum value is ${maxValue}`;
      }
    }

    return null;
  }, [required, minValue, maxValue]);

  const handleSave = useCallback(async () => {
    const validationError = validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const numValue = value.trim() ? parseFloat(value) : null;
      await onSave(numValue);
    } catch (err) {
      setError('Failed to save');
    }
  }, [value, validate, onSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  }, [handleSave, onCancel]);

  return (
    <TextField
      inputRef={inputRef}
      type="number"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        setError(null);
      }}
      onKeyDown={handleKeyDown}
      onBlur={handleSave}
      error={!!error}
      helperText={error}
      fullWidth
      size="small"
      variant="outlined"
      slotProps={{
        htmlInput: {
          step: decimalPlaces ? Math.pow(10, -decimalPlaces) : 1,
        },
        input: {
          startAdornment: prefix,
          endAdornment: suffix,
          sx: { fontSize: '0.875rem' },
        },
      }}
    />
  );
};

NumberEditRenderer.displayName = 'NumberEditRenderer';
```

## DateEditRenderer.tsx

```typescript
import React, { useState, useCallback } from 'react';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO, isValid, formatISO } from 'date-fns';

export interface DateEditRendererProps<TRowData> {
  row: TRowData;
  onSave: (value: unknown) => Promise<void>;
  onCancel: () => void;
  accessor: (row: TRowData) => string | Date | null;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
}

export const DateEditRenderer = <TRowData,>({
  row,
  onSave,
  onCancel,
  accessor,
  minDate,
  maxDate,
  required = false,
}: DateEditRendererProps<TRowData>) => {
  const initialValue = accessor(row);
  const initialDate = initialValue
    ? typeof initialValue === 'string'
      ? parseISO(initialValue)
      : initialValue
    : null;

  const [value, setValue] = useState<Date | null>(initialDate);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((date: Date | null): string | null => {
    if (required && !date) {
      return 'This field is required';
    }
    if (date && !isValid(date)) {
      return 'Invalid date';
    }
    if (date && minDate && date < minDate) {
      return `Date must be after ${minDate.toLocaleDateString()}`;
    }
    if (date && maxDate && date > maxDate) {
      return `Date must be before ${maxDate.toLocaleDateString()}`;
    }
    return null;
  }, [required, minDate, maxDate]);

  const handleSave = useCallback(async () => {
    const validationError = validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const isoValue = value ? formatISO(value, { representation: 'date' }) : null;
      await onSave(isoValue);
    } catch (err) {
      setError('Failed to save');
    }
  }, [value, validate, onSave]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          setError(null);
        }}
        onClose={handleSave}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            error: !!error,
            helperText: error,
            onKeyDown: (e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
              }
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

DateEditRenderer.displayName = 'DateEditRenderer';
```

## SelectEditRenderer.tsx

```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';

export interface SelectOption {
  label: string;
  value: any;
}

export interface SelectEditRendererProps<TRowData> {
  row: TRowData;
  onSave: (value: unknown) => Promise<void>;
  onCancel: () => void;
  accessor: (row: TRowData) => any;
  options: SelectOption[];
  required?: boolean;
}

export const SelectEditRenderer = <TRowData,>({
  row,
  onSave,
  onCancel,
  accessor,
  options,
  required = false,
}: SelectEditRendererProps<TRowData>) => {
  const initialValue = accessor(row) || '';
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      handleSave();
    }
  }, [open]);

  const validate = useCallback((val: any): string | null => {
    if (required && !val) {
      return 'This field is required';
    }
    return null;
  }, [required]);

  const handleSave = useCallback(async () => {
    const validationError = validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSave(value);
    } catch (err) {
      setError('Failed to save');
    }
  }, [value, validate, onSave]);

  return (
    <TextField
      select
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        setError(null);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      }}
      error={!!error}
      helperText={error}
      fullWidth
      size="small"
      variant="outlined"
      SelectProps={{
        open,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

SelectEditRenderer.displayName = 'SelectEditRenderer';
```

## CountryEditRenderer.tsx

```typescript
import React, { useState, useCallback } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import Image from 'next/image';
import { useAppTranslation } from '@/client/locale';
import countries from '@/client/lib/country';
import type { CountryCode } from '@/client/graphql/generated/gql/graphql';

export interface CountryEditRendererProps<TRowData> {
  row: TRowData;
  onSave: (value: unknown) => Promise<void>;
  onCancel: () => void;
  accessor: (row: TRowData) => CountryCode | null;
  required?: boolean;
}

export const CountryEditRenderer = <TRowData,>({\
  row,\
  onSave,\
  onCancel,\
  accessor,\
  required = false,\
}: CountryEditRendererProps<TRowData>) => {\
  const countryStrings = useAppTranslation('countryTranslations');\
  const initialValue = accessor(row);\
  const initialCountry = countries.find(c => c.code === initialValue) || null;\

  const [value, setValue] = useState(initialCountry);\
  const [error, setError] = useState<string | null>(null);\

  const validate = useCallback((country: typeof value): string | null => {\
    if (required && !country) {\
      return 'This field is required';\
    }\
    return null;\
  }, [required]);\

  const handleSave = useCallback(async () => {\
    const validationError = validate(value);\
    if (validationError) {\
      setError(validationError);\
      return;\
    }\

    try {\
      await onSave(value?.code || null);\
    } catch (err) {\
      setError('Failed to save');\
    }\
  }, [value, validate, onSave]);\

  return (\
    <Autocomplete\
      fullWidth\
      options={countries}\
      value={value}\
      onChange={(_, newValue) => {\
        setValue(newValue);\
        setError(null);\
      }}\
      onBlur={handleSave}\
      openOnFocus\
      autoHighlight\
      getOptionLabel={(option) => countryStrings[option.code]}\
      renderOption={(props, option) => {\
        const { key, ...optionProps } = props;\
        return (\
          <Box\
            key={option.code}\
            component="li"\
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}\
            {...optionProps}\
          >\
            <Image\
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}\
              alt={option.code}\
              width={20}\
              height={15}\
              style={{ objectFit: 'cover' }}\
              loading="lazy"\
            />\
            {countryStrings[option.code]}\
          </Box>\
        );\
      }}\
      renderInput={(params) => (\
        <TextField\
          {...params}\
          error={!!error}\
          helperText={error}\
          size="small"\
          onKeyDown={(e) => {\
            if (e.key === 'Escape') {\
              e.preventDefault();\
              onCancel();\
            }\
          }}\
        />\
      )}\
    />\
  );\
};\

CountryEditRenderer.displayName = 'CountryEditRenderer';
```

## PhoneEditRenderer.tsx

```typescript
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MuiTelInput } from 'mui-tel-input';

export interface PhoneEditRendererProps<TRowData> {
  row: TRowData;
  onSave: (value: unknown) => Promise<void>;
  onCancel: () => void;
  accessor: (row: TRowData) => string | null;
  required?: boolean;
}

export const PhoneEditRenderer = <TRowData,>({
  row,
  onSave,
  onCancel,
  accessor,
  required = false,
}: PhoneEditRendererProps<TRowData>) => {
  const initialValue = accessor(row) || '';
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validate = useCallback((val: string): string | null => {
    if (required && !val.trim()) {
      return 'This field is required';
    }
    // Add phone number validation if needed
    return null;
  }, [required]);

  const handleSave = useCallback(async () => {
    const validationError = validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSave(value);
    } catch (err) {
      setError('Failed to save');
    }
  }, [value, validate, onSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  }, [handleSave, onCancel]);

  return (
    <MuiTelInput
      inputRef={inputRef}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        setError(null);
      }}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      error={!!error}
      helperText={error}
      fullWidth
      size="small"
      variant="outlined"
    />
  );
};

PhoneEditRenderer.displayName = 'PhoneEditRenderer';
```

## index.ts

```typescript
export * from "./TextEditRenderer";
export * from "./NumberEditRenderer";
export * from "./DateEditRenderer";
export * from "./SelectEditRenderer";
export * from "./CountryEditRenderer";
export * from "./PhoneEditRenderer";
```

## Usage Example

```typescript
import { TextEditRenderer, NumberEditRenderer } from '@/client/components/Table/renderers/edit';

const columns: AnyColumn<Student>[] = [
  {
    id: 'name',
    type: 'editable',
    headerRenderer: ({ column }) => <BaseHeaderRenderer label="Name" />,
    viewRenderer: ({ row }) => <TextViewRenderer value={row.name} />,
    editRenderer: ({ row, onSave, onCancel }) => (
      <TextEditRenderer
        row={row}
        onSave={onSave}
        onCancel={onCancel}
        accessor={(r) => r.name}
        required
        minLength={2}
        maxLength={100}
      />
    ),
    onUpdate: async (rowId, value) => {
      await updateStudent(rowId, { name: value });
    },
  },
];
```
