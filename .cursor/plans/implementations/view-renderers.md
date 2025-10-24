# View Renderers - Complete Implementation

**Directory: `client/components/Table/renderers/view/`**

Reusable view renderers for displaying cell values in view mode.

## TextViewRenderer.tsx

```typescript
import React from 'react';
import { styled } from '@mui/material/styles';
import { Tooltip } from '@mui/material';

const TextSpan = styled('span')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block',
});

export interface TextViewRendererProps {
  value: string | null | undefined;
  tooltip?: boolean;
  direction?: 'ltr' | 'rtl';
}

export const TextViewRenderer: React.FC<TextViewRendererProps> = ({ 
  value, 
  tooltip = true,
  direction = 'inherit' 
}) => {
  const displayValue = value ?? '';
  
  if (tooltip && displayValue) {
    return (
      <Tooltip title={displayValue} enterDelay={500}>
        <TextSpan style={{ direction }}>{displayValue}</TextSpan>
      </Tooltip>
    );
  }
  
  return <TextSpan style={{ direction }}>{displayValue}</TextSpan>;
};

TextViewRenderer.displayName = 'TextViewRenderer';
```

## NumberViewRenderer.tsx

```typescript
import React from 'react';
import { styled } from '@mui/material/styles';

const NumberSpan = styled('span')({
  display: 'block',
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
});

export interface NumberViewRendererProps {
  value: number | null | undefined;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
}

export const NumberViewRenderer: React.FC<NumberViewRendererProps> = ({
  value,
  decimalPlaces,
  prefix = '',
  suffix = '',
  locale = 'en-US',
}) => {
  if (value === null || value === undefined) {
    return <NumberSpan>-</NumberSpan>;
  }
  
  const formatted = typeof decimalPlaces === 'number'
    ? value.toLocaleString(locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
    : value.toLocaleString(locale);
  
  return (
    <NumberSpan>
      {prefix}{formatted}{suffix}
    </NumberSpan>
  );
};

NumberViewRenderer.displayName = 'NumberViewRenderer';
```

## DateViewRenderer.tsx

```typescript
import React from 'react';
import { styled } from '@mui/material/styles';
import { format, parseISO, isValid } from 'date-fns';

const DateSpan = styled('span')({
  display: 'block',
});

export interface DateViewRendererProps {
  value: string | Date | null | undefined;
  format?: string;
  emptyText?: string;
}

export const DateViewRenderer: React.FC<DateViewRendererProps> = ({
  value,
  format: dateFormat = 'MMM dd, yyyy',
  emptyText = '-',
}) => {
  if (!value) {
    return <DateSpan>{emptyText}</DateSpan>;
  }
  
  try {
    const date = typeof value === 'string' ? parseISO(value) : value;
    
    if (!isValid(date)) {
      return <DateSpan>{emptyText}</DateSpan>;
    }
    
    return <DateSpan>{format(date, dateFormat)}</DateSpan>;
  } catch (error) {
    console.error('Invalid date:', value, error);
    return <DateSpan>{emptyText}</DateSpan>;
  }
};

DateViewRenderer.displayName = 'DateViewRenderer';
```

## BooleanViewRenderer.tsx

```typescript
import React from 'react';
import { Checkbox } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

export interface BooleanViewRendererProps {
  value: boolean | null | undefined;
  variant?: 'checkbox' | 'icon' | 'text';
  trueLabel?: string;
  falseLabel?: string;
}

export const BooleanViewRenderer: React.FC<BooleanViewRendererProps> = ({
  value,
  variant = 'checkbox',
  trueLabel = 'Yes',
  falseLabel = 'No',
}) => {
  const boolValue = Boolean(value);
  
  if (variant === 'checkbox') {
    return (
      <Checkbox 
        checked={boolValue} 
        disabled 
        sx={{ padding: 0 }}
      />
    );
  }
  
  if (variant === 'icon') {
    return boolValue ? (
      <CheckCircle color="success" fontSize="small" />
    ) : (
      <Cancel color="disabled" fontSize="small" />
    );
  }
  
  return <span>{boolValue ? trueLabel : falseLabel}</span>;
};

BooleanViewRenderer.displayName = 'BooleanViewRenderer';
```

## SelectViewRenderer.tsx

```typescript
import React from 'react';
import { Chip } from '@mui/material';

export interface SelectOption {
  label: string;
  value: any;
  color?: string;
}

export interface SelectViewRendererProps {
  value: any;
  options: SelectOption[];
  variant?: 'text' | 'chip';
  emptyText?: string;
}

export const SelectViewRenderer: React.FC<SelectViewRendererProps> = ({
  value,
  options,
  variant = 'text',
  emptyText = '-',
}) => {
  const option = options.find(opt => opt.value === value);
  
  if (!option) {
    return <span>{emptyText}</span>;
  }
  
  if (variant === 'chip') {
    return (
      <Chip 
        label={option.label} 
        size="small"
        sx={{ 
          backgroundColor: option.color,
          maxWidth: '100%',
        }}
      />
    );
  }
  
  return <span>{option.label}</span>;
};

SelectViewRenderer.displayName = 'SelectViewRenderer';
```

## CountryViewRenderer.tsx

```typescript
import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import { useAppTranslation } from '@/client/locale';
import countries from '@/client/lib/country';
import type { CountryCode } from '@/client/graphql/generated/gql/graphql';

export interface CountryViewRendererProps {
  value: CountryCode | null | undefined;
}

export const CountryViewRenderer: React.FC<CountryViewRendererProps> = ({ value }) => {
  const countryStrings = useAppTranslation('countryTranslations');
  
  if (!value) {
    return <span>-</span>;
  }
  
  const country = countries.find(c => c.code === value);
  
  if (!country) {
    return <span>{value}</span>;
  }
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Image
        src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
        alt={country.code}
        width={20}
        height={15}
        style={{ objectFit: 'cover' }}
        loading="lazy"
      />
      {countryStrings[country.code]}
    </Box>
  );
};

CountryViewRenderer.displayName = 'CountryViewRenderer';
```

## PhoneViewRenderer.tsx

```typescript
import React from 'react';
import { styled } from '@mui/material/styles';

const PhoneSpan = styled('span')({
  direction: 'ltr',
  display: 'block',
});

export interface PhoneViewRendererProps {
  value: string | null | undefined;
}

export const PhoneViewRenderer: React.FC<PhoneViewRendererProps> = ({ value }) => {
  return <PhoneSpan>{value || '-'}</PhoneSpan>;
};

PhoneViewRenderer.displayName = 'PhoneViewRenderer';
```

## index.ts

```typescript
export * from './TextViewRenderer';
export * from './NumberViewRenderer';
export * from './DateViewRenderer';
export * from './BooleanViewRenderer';
export * from './SelectViewRenderer';
export * from './CountryViewRenderer';
export * from './PhoneViewRenderer';
```

## Usage Examples

```typescript
import {
  TextViewRenderer,
  NumberViewRenderer,
  DateViewRenderer,
  SelectViewRenderer,
  CountryViewRenderer,
} from '@/client/components/Table/renderers/view';

// In column definition
const columns: AnyColumn<Student>[] = [
  {
    id: 'name',
    type: 'viewonly',
    headerRenderer: ({ column }) => <BaseHeaderRenderer label="Name" />,
    viewRenderer: ({ row }) => <TextViewRenderer value={row.name} />,
  },
  {
    id: 'age',
    type: 'viewonly',
    headerRenderer: ({ column }) => <BaseHeaderRenderer label="Age" />,
    viewRenderer: ({ row }) => <NumberViewRenderer value={row.age} />,
  },
  {
    id: 'birthDate',
    type: 'viewonly',
    headerRenderer: ({ column }) => <BaseHeaderRenderer label="Birth Date" />,
    viewRenderer: ({ row }) => (
      <DateViewRenderer value={row.birthDate} format="MMM dd, yyyy" />
    ),
  },
];
```
