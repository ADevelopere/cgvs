<!-- f1cab6cf-2f36-4105-8521-ffdbc916f4be bbf1b6fa-ff12-4031-a313-1f5be41cd689 -->
# Text Element Form Components Implementation Plan

## Overview

Create stateless, type-safe form components for text elements. Match backend validation strategy using discriminated unions with `type` fields. Convert to GraphQL OneOf format only at submission time.

## Key Technical Details

### Backend Validation Pattern (from text.element.utils.ts)

```typescript
// Backend uses discriminated union with type field
switch (dataSource.type) {
  case TextDataSourceType.STATIC:
    validateStaticDataSource(dataSource.value);
    break;
  case TextDataSourceType.STUDENT_TEXT_FIELD:
    validateStudentTextField(dataSource.field);
    break;
  // ... etc - NO "field in object" checks
}
```

### Frontend State Pattern (Discriminated Union)

**Working State** (matches backend structure):

```typescript
type TextDataSourceState = 
  | { type: 'STATIC'; value: string }
  | { type: 'STUDENT_TEXT_FIELD'; field: StudentTextField }
  | { type: 'CERTIFICATE_TEXT_FIELD'; field: CertificateTextField }
  | { type: 'TEMPLATE_TEXT_VARIABLE'; variableId: number }
  | { type: 'TEMPLATE_SELECT_VARIABLE'; variableId: number };
```

**Conversion to GraphQL** (only at submission):

```typescript
// Convert discriminated union to GraphQL OneOf format
const toGraphQL = (state: TextDataSourceState): TextDataSourceInput => {
  switch (state.type) {
    case 'STATIC':
      return { static: { value: state.value } };
    case 'STUDENT_TEXT_FIELD':
      return { studentField: { field: state.field } };
    // ... etc
  }
};
```

### Type-Safe Update Pattern

```typescript
type UpdateStateFn<T> = <K extends keyof T>(key: K, value: T[K]) => void;
```

### Font Reference - Same Pattern

```typescript
type FontReferenceState = 
  | { type: 'GOOGLE'; identifier: string }
  | { type: 'SELF_HOSTED'; fontId: number };
```

---

## Implementation Steps

### 1. Translation Setup

**File**: `client/locale/components/CertificateElements.ts`

Same as previous plan - nested translation structure with `textElement`, `baseElement`, `textProps`, `common` sections.

**Files**:

- `client/locale/components/CertificateElements.ts`
- `client/locale/ar/certificateElements.ts`
- `client/locale/en/enCertificateElements.ts`

Export and register in translations.

---

### 2. Type Definitions

**File**: `client/views/template/manage/editor/form/element/text/types.ts`

```typescript
import type {
  TextElementCreateInput,
  TextElementUpdateInput,
  TextDataSourceInput as TextDataSourceInputGQL,
  TextDataSourceType,
  FontReferenceInput as FontReferenceInputGQL,
  FontSource,
  ElementAlignment,
  ElementOverflow,
  StudentTextField,
  CertificateTextField,
  TemplateTextVariable,
  TemplateSelectVariable,
  Font,
  TextPropsInput as TextPropsInputGQL,
} from '@/client/graphql/generated/gql/graphql';

// ============================================================================
// WORKING STATE TYPES (Discriminated Unions - match backend structure)
// ============================================================================

// Data source working state (with type discriminator)
export type TextDataSourceState = 
  | { type: 'STATIC'; value: string }
  | { type: 'STUDENT_TEXT_FIELD'; field: StudentTextField }
  | { type: 'CERTIFICATE_TEXT_FIELD'; field: CertificateTextField }
  | { type: 'TEMPLATE_TEXT_VARIABLE'; variableId: number }
  | { type: 'TEMPLATE_SELECT_VARIABLE'; variableId: number };

// Font reference working state (with type discriminator)
export type FontReferenceState = 
  | { type: 'GOOGLE'; identifier: string }
  | { type: 'SELF_HOSTED'; fontId: number };

// Text props working state
export type TextPropsState = {
  fontRef: FontReferenceState;
  fontSize: number;
  color: string;
  overflow: ElementOverflow;
};

// Base element working state
export type BaseElementState = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
};

// Complete text element working state
export type TextElementState = BaseElementState & {
  textProps: TextPropsState;
  dataSource: TextDataSourceState;
};

// ============================================================================
// TYPE-SAFE UPDATE FUNCTIONS
// ============================================================================

export type UpdateStateFn<T> = <K extends keyof T>(key: K, value: T[K]) => void;
export type ValidateFieldFn<T> = <K extends keyof T>(key: K, value: T[K]) => string | undefined;

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type BaseElementFormErrors = {
  templateId?: string;
  name?: string;
  description?: string;
  positionX?: string;
  positionY?: string;
  width?: string;
  height?: string;
  alignment?: string;
  renderOrder?: string;
};

export type TextPropsFormErrors = {
  color?: string;
  fontSize?: string;
  overflow?: string;
  fontRef?: string;
  fontIdentifier?: string;
  fontId?: string;
};

export type DataSourceFormErrors = {
  value?: string;        // for STATIC
  field?: string;        // for STUDENT_TEXT_FIELD / CERTIFICATE_TEXT_FIELD
  variableId?: string;   // for TEMPLATE_TEXT_VARIABLE / TEMPLATE_SELECT_VARIABLE
};

export type TextElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dataSource: DataSourceFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateBaseElementFn = UpdateStateFn<BaseElementState>;
export type UpdateTextPropsFn = UpdateStateFn<TextPropsState>;
export type UpdateDataSourceFn = (dataSource: TextDataSourceState) => void;
export type UpdateFontRefFn = (fontRef: FontReferenceState) => void;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

// Convert working state to GraphQL input
export const textDataSourceToGraphQL = (
  state: TextDataSourceState
): TextDataSourceInputGQL => {
  switch (state.type) {
    case 'STATIC':
      return { static: { value: state.value } };
    case 'STUDENT_TEXT_FIELD':
      return { studentField: { field: state.field } };
    case 'CERTIFICATE_TEXT_FIELD':
      return { certificateField: { field: state.field } };
    case 'TEMPLATE_TEXT_VARIABLE':
      return { templateTextVariable: { variableId: state.variableId } };
    case 'TEMPLATE_SELECT_VARIABLE':
      return { templateSelectVariable: { variableId: state.variableId } };
  }
};

export const fontReferenceToGraphQL = (
  state: FontReferenceState
): FontReferenceInputGQL => {
  switch (state.type) {
    case 'GOOGLE':
      return { google: { identifier: state.identifier } };
    case 'SELF_HOSTED':
      return { selfHosted: { fontId: state.fontId } };
  }
};

export const textPropsToGraphQL = (state: TextPropsState): TextPropsInputGQL => {
  return {
    ...state,
    fontRef: fontReferenceToGraphQL(state.fontRef),
  };
};

// ============================================================================
// RE-EXPORTS
// ============================================================================

export type { 
  TextDataSourceType,
  FontSource,
  ElementAlignment,
  ElementOverflow,
  StudentTextField,
  CertificateTextField,
  TemplateTextVariable,
  TemplateSelectVariable,
  Font,
};
```

---

### 3. Validator Functions

**File**: `client/views/template/manage/editor/form/element/text/validators.ts`

```typescript
import type {
  BaseElementState,
  TextPropsState,
  TextDataSourceState,
  FontReferenceState,
  DataSourceFormErrors,
  ValidateFieldFn,
} from './types';

// ============================================================================
// BASE ELEMENT VALIDATORS
// ============================================================================

export const validateBaseElementField: ValidateFieldFn<BaseElementState> = (key, value) => {
  switch (key) {
    case 'templateId':
      return value > 0 ? undefined : 'Template ID required';
    
    case 'name':
      if (!value || value.trim().length === 0) return 'Name is required';
      if (value.length < 2) return 'Name must be at least 2 characters';
      return undefined;
    
    case 'description':
      return !value || value.trim().length === 0 ? 'Description is required' : undefined;
    
    case 'positionX':
    case 'positionY':
      return value < 0 ? 'Position must be non-negative' : undefined;
    
    case 'width':
    case 'height':
      return value <= 0 ? 'Dimension must be positive' : undefined;
    
    case 'renderOrder':
      return value < 0 ? 'Render order must be non-negative' : undefined;
    
    case 'alignment':
      return !value ? 'Alignment is required' : undefined;
    
    default:
      return undefined;
  }
};

// ============================================================================
// TEXT PROPS VALIDATORS
// ============================================================================

export const validateTextPropsField: ValidateFieldFn<TextPropsState> = (key, value) => {
  switch (key) {
    case 'color':
      if (!value) return 'Color is required';
      if (!/^#[0-9A-Fa-f]{6}$/.test(value)) return 'Invalid color format';
      return undefined;
    
    case 'fontSize':
      if (value <= 0) return 'Font size must be positive';
      if (value > 1000) return 'Font size cannot exceed 1000';
      return undefined;
    
    case 'overflow':
      return !value ? 'Overflow is required' : undefined;
    
    case 'fontRef':
      return validateFontReference(value);
    
    default:
      return undefined;
  }
};

// Font reference validator (matches backend logic)
export const validateFontReference = (fontRef: FontReferenceState): string | undefined => {
  switch (fontRef.type) {
    case 'GOOGLE':
      if (!fontRef.identifier || fontRef.identifier.trim().length === 0) {
        return 'Google font identifier is required';
      }
      if (!/^[a-zA-Z0-9\s\-+]+$/.test(fontRef.identifier)) {
        return 'Invalid characters in font identifier';
      }
      return undefined;
    
    case 'SELF_HOSTED':
      if (!fontRef.fontId || fontRef.fontId <= 0) {
        return 'Font selection is required';
      }
      return undefined;
  }
};

// ============================================================================
// DATA SOURCE VALIDATORS (matches backend switch pattern)
// ============================================================================

export const validateDataSource = (
  dataSource: TextDataSourceState
): DataSourceFormErrors => {
  const errors: DataSourceFormErrors = {};

  switch (dataSource.type) {
    case 'STATIC':
      if (!dataSource.value || dataSource.value.trim().length === 0) {
        errors.value = 'Static value is required';
      }
      break;
    
    case 'STUDENT_TEXT_FIELD':
      if (!dataSource.field) {
        errors.field = 'Student field is required';
      }
      break;
    
    case 'CERTIFICATE_TEXT_FIELD':
      if (!dataSource.field) {
        errors.field = 'Certificate field is required';
      }
      break;
    
    case 'TEMPLATE_TEXT_VARIABLE':
    case 'TEMPLATE_SELECT_VARIABLE':
      if (!dataSource.variableId || dataSource.variableId <= 0) {
        errors.variableId = 'Variable selection is required';
      }
      break;
  }

  return errors;
};
```

---

### 4. Data Source Selector Component

**File**: `client/views/template/manage/editor/form/element/text/DataSourceSelector.tsx`

**Props**:

```typescript
import type { TextDataSourceType } from './types';

interface DataSourceSelectorProps {
  selectedType: TextDataSourceType;
  onTypeChange: (type: TextDataSourceType) => void;
  disabled?: boolean;
}
```

**UI**: MUI Select with 5 options from `TextDataSourceType` enum

---

### 5. Static Source Input Component

**File**: `client/views/template/manage/editor/form/element/text/StaticSourceInput.tsx`

**Props**:

```typescript
interface StaticSourceInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}
```

---

### 6. Student Field Selector Component

**File**: `client/views/template/manage/editor/form/element/text/StudentFieldSelector.tsx`

**Props**:

```typescript
import type { StudentTextField } from './types';

interface StudentFieldSelectorProps {
  value: StudentTextField;
  onChange: (field: StudentTextField) => void;
  error?: string;
  disabled?: boolean;
}
```

---

### 7. Certificate Field Selector Component

**File**: `client/views/template/manage/editor/form/element/text/CertificateFieldSelector.tsx`

**Props**:

```typescript
import type { CertificateTextField } from './types';

interface CertificateFieldSelectorProps {
  value: CertificateTextField;
  onChange: (field: CertificateTextField) => void;
  error?: string;
  disabled?: boolean;
}
```

---

### 8. Template Text Variable Selector Component

**File**: `client/views/template/manage/editor/form/element/text/TemplateTextVariableSelector.tsx`

**Props**:

```typescript
import type { TemplateTextVariable } from './types';

interface TemplateTextVariableSelectorProps {
  value: number | undefined;
  variables: TemplateTextVariable[];
  onChange: (variableId: number) => void;
  error?: string;
  disabled?: boolean;
}
```

---

### 9. Template Select Variable Selector Component

**File**: `client/views/template/manage/editor/form/element/text/TemplateSelectVariableSelector.tsx`

**Props**:

```typescript
import type { TemplateSelectVariable } from './types';

interface TemplateSelectVariableSelectorProps {
  value: number | undefined;
  variables: TemplateSelectVariable[];
  onChange: (variableId: number) => void;
  error?: string;
  disabled?: boolean;
}
```

---

### 10. Data Source Form Component (Orchestrator)

**File**: `client/views/template/manage/editor/form/element/text/DataSourceForm.tsx`

**Props**:

```typescript
import type {
  TextDataSourceState,
  TextDataSourceType,
  TemplateTextVariable,
  TemplateSelectVariable,
  DataSourceFormErrors,
  UpdateDataSourceFn,
} from './types';

interface DataSourceFormProps {
  dataSource: TextDataSourceState;
  textVariables: TemplateTextVariable[];
  selectVariables: TemplateSelectVariable[];
  onDataSourceChange: UpdateDataSourceFn;
  errors: DataSourceFormErrors;
  disabled?: boolean;
  showSelector: boolean;
}
```

**Logic**: Switch on `dataSource.type` to render appropriate input (matches backend pattern)

---

### 11. Font Reference Selector Component

**File**: `client/views/template/manage/editor/form/element/text/FontReferenceSelector.tsx`

**Props**:

```typescript
import type { FontReferenceState, FontSource, Font, UpdateFontRefFn } from './types';

interface FontReferenceSelectorProps {
  fontRef: FontReferenceState;
  locale: string;
  selfHostedFonts: Font[];
  onFontRefChange: UpdateFontRefFn;
  error?: string;
  disabled?: boolean;
}
```

**Logic**: Switch on `fontRef.type` to render Google or Self-Hosted input

---

### 12. Text Props Form Component (REUSABLE)

**File**: `client/views/template/manage/editor/form/element/text/TextPropsForm.tsx`

**Props**:

```typescript
import type {
  TextPropsState,
  TextPropsFormErrors,
  UpdateTextPropsFn,
  Font,
} from './types';

interface TextPropsFormProps {
  textProps: TextPropsState;
  locale: string;
  selfHostedFonts: Font[];
  onTextPropsChange: UpdateTextPropsFn;
  errors: TextPropsFormErrors;
  disabled?: boolean;
}
```

**Note**: REUSABLE across TEXT, DATE, NUMBER, COUNTRY, GENDER elements

---

### 13. Base Certificate Element Form Component (REUSABLE)

**File**: `client/views/template/manage/editor/form/element/text/BaseCertificateElementForm.tsx`

**Props**:

```typescript
import type {
  BaseElementState,
  BaseElementFormErrors,
  UpdateBaseElementFn,
} from './types';

interface BaseCertificateElementFormProps {
  baseProps: BaseElementState;
  onFieldChange: UpdateBaseElementFn;
  errors: BaseElementFormErrors;
  disabled?: boolean;
}
```

**Note**: REUSABLE across ALL element types

---

### 14. Action Buttons Component

**File**: `client/views/template/manage/editor/form/element/text/ActionButtons.tsx`

Same as previous plan.

---

### 15. Text Element Create Form

**File**: `client/views/template/manage/editor/form/element/text/TextElementCreateForm.tsx`

**Props**:

```typescript
import type {
  TextElementState,
  TextElementFormErrors,
  UpdateBaseElementFn,
  UpdateTextPropsFn,
  UpdateDataSourceFn,
  TemplateTextVariable,
  TemplateSelectVariable,
  Font,
} from './types';

interface TextElementCreateFormProps {
  state: TextElementState;
  errors: TextElementFormErrors;
  updateBaseElement: UpdateBaseElementFn;
  updateTextProps: UpdateTextPropsFn;
  updateDataSource: UpdateDataSourceFn;
  templateId: number;
  locale: string;
  textVariables: TemplateTextVariable[];
  selectVariables: TemplateSelectVariable[];
  selfHostedFonts: Font[];
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
```

**Parent Implementation Example**:

```typescript
const TextElementCreateContainer = () => {
  // Working state (discriminated union)
  const [state, setState] = useState<TextElementState>({
    // base
    templateId: templateId,
    name: '',
    description: '',
    positionX: 0,
    positionY: 0,
    width: 100,
    height: 50,
    alignment: 'CENTER',
    renderOrder: 0,
    // textProps
    textProps: {
      fontRef: { type: 'GOOGLE', identifier: 'Roboto' },
      fontSize: 16,
      color: '#000000',
      overflow: 'WRAP',
    },
    // dataSource
    dataSource: { type: 'STATIC', value: '' },
  });

  const [errors, setErrors] = useState<TextElementFormErrors>({...});

  const updateBaseElement: UpdateBaseElementFn = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
    const error = validateBaseElementField(key, value);
    setErrors(prev => ({
      ...prev,
      base: { ...prev.base, [key]: error }
    }));
  };

  const updateTextProps: UpdateTextPropsFn = (key, value) => {
    setState(prev => ({
      ...prev,
      textProps: { ...prev.textProps, [key]: value }
    }));
    const error = validateTextPropsField(key, value);
    setErrors(prev => ({
      ...prev,
      textProps: { ...prev.textProps, [key]: error }
    }));
  };

  const updateDataSource: UpdateDataSourceFn = (dataSource) => {
    setState(prev => ({ ...prev, dataSource }));
    const dataSourceErrors = validateDataSource(dataSource);
    setErrors(prev => ({
      ...prev,
      dataSource: dataSourceErrors
    }));
  };

  const handleSubmit = async () => {
    // Convert to GraphQL format at submission
    const input: TextElementCreateInput = {
      ...state,
      textProps: textPropsToGraphQL(state.textProps),
      dataSource: textDataSourceToGraphQL(state.dataSource),
    };
    // Call mutation with input
  };

  return <TextElementCreateForm state={state} ... />;
};
```

---

### 16. Text Element Update Form

**File**: `client/views/template/manage/editor/form/element/text/TextElementUpdateForm.tsx`

Same structure as Create, but `showSelector={false}` in DataSourceForm.

---

### 17. Index Export

**File**: `client/views/template/manage/editor/form/element/text/index.ts`

Export all components, types, validators, and conversion utilities.

---

## Files to Create (20 files total)

1. `client/locale/components/CertificateElements.ts`
2. `client/locale/ar/certificateElements.ts`
3. `client/locale/en/enCertificateElements.ts`
4. `client/views/template/manage/editor/form/element/text/types.ts`
5. `client/views/template/manage/editor/form/element/text/validators.ts`
6. `client/views/template/manage/editor/form/element/text/DataSourceSelector.tsx`
7. `client/views/template/manage/editor/form/element/text/StaticSourceInput.tsx`
8. `client/views/template/manage/editor/form/element/text/StudentFieldSelector.tsx`
9. `client/views/template/manage/editor/form/element/text/CertificateFieldSelector.tsx`
10. `client/views/template/manage/editor/form/element/text/TemplateTextVariableSelector.tsx`
11. `client/views/template/manage/editor/form/element/text/TemplateSelectVariableSelector.tsx`
12. `client/views/template/manage/editor/form/element/text/DataSourceForm.tsx`
13. `client/views/template/manage/editor/form/element/text/FontReferenceSelector.tsx`
14. `client/views/template/manage/editor/form/element/text/TextPropsForm.tsx` (REUSABLE)
15. `client/views/template/manage/editor/form/element/text/BaseCertificateElementForm.tsx` (REUSABLE)
16. `client/views/template/manage/editor/form/element/text/ActionButtons.tsx`
17. `client/views/template/manage/editor/form/element/text/TextElementCreateForm.tsx`
18. `client/views/template/manage/editor/form/element/text/TextElementUpdateForm.tsx`
19. `client/views/template/manage/editor/form/element/text/index.ts`

Plus: Update `client/locale/components/index.ts` and `client/locale/translations.ts`

---

## Key Implementation Notes

1. **Discriminated Union State**: Working state uses `type` field discriminator (matches backend structure)

2. **No "field in object" checks**: Use switch on `type` field like backend (e.g., `switch (dataSource.type) { ... }`)

3. **GraphQL Conversion**: Convert discriminated union to GraphQL OneOf format only at submission using conversion utilities

4. **Validation Pattern**: Mirrors backend - switch on type, validate specific fields for that type

5. **Type Safety**: Generic mapped type `UpdateStateFn<T>` - no `any`, no casting

6. **Reusable Components**: BaseCertificateElementForm (all elements), TextPropsForm (5 element types)

7. **Google Fonts API**: `https://www.googleapis.com/webfonts/v1/webfonts?key=API_KEY`

8. **Parent Responsibility**: Maintains working state, converts to GraphQL at submission, implements validators

9. **Compile-Time Safety**: TypeScript prevents type mismatches, switch statements ensure exhaustive handling