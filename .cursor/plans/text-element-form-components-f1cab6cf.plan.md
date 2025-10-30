<!-- f1cab6cf-2f36-4105-8521-ffdbc916f4be 8e314b58-a992-4e8b-a65a-b9ee3f676893 -->
# Certificate Element Form Components - Master Plan

This master plan defines the requirements, architecture, and methodology for creating form components for all certificate element types. This document serves as a template and guide for creating element-specific implementation plans.

## Element Types Covered

This master plan applies to all 7 certificate element types:

1. TEXT - Text elements with data sources
2. DATE - Date elements with formatting
3. NUMBER - Number elements with formatting
4. COUNTRY - Country elements with locale
5. GENDER - Gender elements with locale
6. IMAGE - Image elements with sources
7. QRCODE - QR Code elements with data

## Core Architecture Requirements

### Stateless Component Pattern

All form components must:

- Receive ALL data via props (state, errors, update functions)
- NOT manage any data-related state internally
- MAY have UI-specific state only (dropdown open/closed, loading states, etc.)
- Be reusable for both create and update operations

### Directory Organization by Reusability

```
element/
├── base/                    # Reusable across ALL elements
│   ├── BaseCertificateElementForm.tsx
│   ├── BaseCertificateElementForm.stories.tsx
│   ├── types.ts
│   └── index.ts
├── component/               # Generic reusable components
│   ├── ActionButtons.tsx
│   └── ActionButtons.stories.tsx
├── textProps/              # Reusable across text-like elements
│   ├── TextPropsForm.tsx
│   ├── FontReferenceSelector.tsx
│   ├── *.stories.tsx
│   ├── types.ts
│   ├── textPropsValidator.ts
│   └── index.ts
├── variableSelector/       # Reusable template variable selectors
│   ├── TemplateTextVariableSelector.tsx
│   ├── TemplateSelectVariableSelector.tsx
│   ├── *.stories.tsx
│   └── index.ts
├── text/                   # Text element specific
├── date/                   # Date element specific (future)
├── types.ts               # Shared generic types (UpdateStateFn, FormErrors)
└── story.util.ts          # Shared Storybook mock data
```

### Component Hierarchy

Each element form is composed of:

- **Element-Specific Form** (main container)
  - **Data Source Form** (element-specific, if applicable)
  - **Element Props Form** (element-specific properties)
  - **Text Props Form** (REUSABLE - for TEXT, DATE, NUMBER, COUNTRY, GENDER)
  - **Image Props Form** (REUSABLE - for IMAGE, QRCODE)
  - **Base Element Form** (REUSABLE - for ALL elements)
  - **Action Buttons** (REUSABLE - for ALL elements)

## Type Safety Requirements

### Critical Rule: Use GraphQL Types Directly

**NEVER define custom types - use GraphQL generated types**

```typescript
// ✅ CORRECT: Use GraphQL Input types directly
import { TextDataSourceInput, TextPropsCreateInput } from "@/client/graphql/generated/gql/graphql";

type TextElementFormState = {
  base: CertificateElementBaseCreateInput;
  textProps: TextPropsCreateInput;
  dataSource: TextDataSourceInput;  // GraphQL OneOf type
};

// ❌ WRONG: Custom discriminated unions
type DataSource =
  | { type: "STATIC"; value: string }
  | { type: "VARIABLE"; variableId: number };
```

### Allowed Custom Types (ONLY)

1. **Composed State Types**: Combine multiple GraphQL types
```typescript
type TextElementFormState = {
  base: BaseCertificateElementFormState;
  textProps: TextPropsState;
  dataSource: TextDataSourceInput;
};
```

2. **Generic Error Types**: Use `FormErrors<T>` utility
```typescript
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

type TextPropsFormErrors = FormErrors<TextPropsCreateInput | TextPropsUpdateInput>;
```

3. **Generic Update Functions**: Type-safe field updaters
```typescript
export type UpdateStateFn<T> = <K extends keyof T>(key: K, value: T[K]) => void;
export type ValidateFieldFn<T> = <K extends keyof T>(key: K, value: T[K]) => string | undefined;
```


### Working with GraphQL OneOf Types

GraphQL OneOf input types (e.g., `TextDataSourceInput`, `FontReferenceInput`) use this pattern:

```typescript
// OneOf type - only ONE property is set, others are null/undefined
type TextDataSourceInput = {
  static?: { value: string } | null;
  studentField?: { field: StudentTextField } | null;
  certificateField?: { field: CertificateTextField } | null;
  templateTextVariable?: { variableId: number } | null;
  templateSelectVariable?: { variableId: number } | null;
};
```

Work with OneOf types by checking which property exists:

```typescript
// Determine current type
const selectedType = useMemo(() => {
  if (dataSource.static?.value) return "STATIC";
  if (dataSource.studentField?.field) return "STUDENT_TEXT_FIELD";
  // ...
}, [dataSource]);

// Validate OneOf types
if (dataSource.static) {
  if (!dataSource.static.value) errors.static = "Required";
} else if (dataSource.studentField) {
  if (!dataSource.studentField.field) errors.studentField = "Required";
}
```

### Type Guards Using __typename

For GraphQL Output types (query results), use `__typename`:

```typescript
export const isFontReferenceGoogle = (
  fontRef: FontReference
): fontRef is FontReferenceGoogle => {
  return fontRef.__typename === "FontReferenceGoogle";
};
```

### Conversion from Output to Input

When loading existing data (Output types) for editing, convert to Input types:

```typescript
export const fontReferenceToGraphQL = (
  state: FontReference  // Output type with __typename
): FontReferenceInput => {  // Input type with OneOf
  switch (state.__typename) {
    case "FontReferenceGoogle":
      return { google: { identifier: state.identifier ?? "" } };
    case "FontReferenceSelfHosted":
      return { selfHosted: { fontId: state.fontId ?? -1 } };
  }
};
```

### Strict Type Rules

- NO `any` types allowed anywhere
- NO type casting in component code (validators may use minimal casting)
- NO `"field" in object` checks - use `__typename` when available
- Use TypeScript's type system for compile-time safety

## Error Structure Pattern

### Generic FormErrors Type

Define once in `element/types.ts`:

```typescript
export type FormErrors<T> = {
  [K in keyof T]?: string;
};
```

### Modular Error Objects

Organize by component responsibility:

```typescript
// Base element errors (all elements)
type BaseElementFormErrors = FormErrors<
  CertificateElementBaseCreateInput | CertificateElementBaseUpdateInput
>;

// Text props errors (text-like elements)
type TextPropsFormErrors = FormErrors<
  TextPropsCreateInput | TextPropsUpdateInput
>;

// Element-specific errors
type TextElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dataSource: DataSourceFormErrors;
};
```

## Validation Strategy

### OneOf Validation Pattern

For GraphQL OneOf types, check each variant:

```typescript
export const validateTextDataSource = (
  dataSource: TextDataSourceInput
): DataSourceFormErrors => {
  const errors: DataSourceFormErrors = {};

  if (dataSource.static) {
    if (!dataSource.static.value) errors.static = "Static value is required";
  } else if (dataSource.studentField) {
    if (!dataSource.studentField.field) errors.studentField = "Student field is required";
  } else if (dataSource.certificateField) {
    if (!dataSource.certificateField.field) errors.certificateField = "Certificate field is required";
  } else if (dataSource.templateTextVariable) {
    if (!dataSource.templateTextVariable.variableId) errors.templateTextVariable = "Variable is required";
  } else if (dataSource.templateSelectVariable) {
    if (!dataSource.templateSelectVariable.variableId) errors.templateSelectVariable = "Variable is required";
  }

  return errors;
};
```

### Field-Level Validation

For regular fields, use `ValidateFieldFn`:

```typescript
export const validateTextPropsField: ValidateFieldFn<
  TextPropsCreateInput | TextPropsUpdateInput
> = (key, value) => {
  switch (key) {
    case "color":
      const colorValue = value as string;
      if (!colorValue) return "Color is required";
      if (!/^#[0-9A-Fa-f]{6}$/.test(colorValue)) return "Invalid color format";
      return undefined;
    // ...
  }
};
```

### Validator Naming Convention

- Element validators: `[element]Validators.ts` (e.g., `textValidators.ts`)
- Props validators: `[props]Validator.ts` (e.g., `textPropsValidator.ts`)

## Storybook Requirements

### Every Component Must Have Stories

All components require `.stories.tsx` files using this pattern:

```typescript
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { logger } from "@/client/lib/logger";
import { ComponentName } from "./ComponentName";

const meta: Meta<typeof ComponentName> = {
  title: "Template/Editor/Form/Element/[Category]/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    // ... props
  },
};
```

### Shared Mock Data

Create shared mock data in `element/story.util.ts`:

```typescript
export const mockSelfHostedFonts: Font[] = [/* ... */];
export const mockTextVariables: TemplateTextVariable[] = [/* ... */];
export const mockSelectVariables: TemplateSelectVariable[] = [/* ... */];
```

## Layout Requirements

### Three-Row Layout Structure

```
┌─────────────────────────────────────────┐
│ Row 1: Element-Specific Input          │
│        (Data Source, Image Source, etc) │
├─────────────────────────────────────────┤
│ Row 2: Properties (SCROLLABLE)         │
│ ┌──────────────┬──────────────────────┐ │
│ │ Element Props│ Base Element Props   │ │
│ │ (Text/Image) │                      │ │
│ └──────────────┴──────────────────────┘ │
├─────────────────────────────────────────┤
│ Row 3: Action Buttons (FIXED)          │
└─────────────────────────────────────────┘
```

### MUI Grid Usage

- Use MUI v6 Grid with `size` prop
- Example: `<Grid size={{ xs: 12, md: 6 }}>`
- NOT: `<Grid item xs={12} md={6}>` (deprecated)

### Scrolling Behavior

- Row 1: No scroll (always visible)
- Row 2: Scrollable with `overflow: "auto"`
- Row 3: Fixed at bottom (sticky)

## Translation System

### Six-Step Translation Pattern

1. Create type in `client/locale/components/CertificateElements.ts`
2. Export from `client/locale/components/index.ts`
3. Create AR translation in `client/locale/ar/certificateElements.ts`
4. Create EN translation in `client/locale/en/enCertificateElements.ts`
5. Export from `client/locale/ar/index.ts` and `client/locale/en/index.ts`
6. Register in `client/locale/translations.ts`

### Translation Structure

Organize by component sections:

```typescript
export type CertificateElementsTranslations = {
  [key: string]: string | object;
  
  textElement: TextElementTranslations;
  baseElement: BaseElementTranslations;
  textProps: TextPropsTranslations;
  common: CommonTranslations;
};
```

### Translation Usage

```typescript
const strings = useAppTranslation("certificateElementsTranslations");
// Access: strings.textElement.dataSourceLabel
// NO fallbacks: strings.title || "Default" ❌
```

## File Organization

### Element-Specific Directory

```
text/
├── types.ts                          # Composed state types, errors
├── textValidators.ts                 # Element-specific validators
├── TextDataSourceSelector.tsx        # Source type selector
├── TextDataSourceSelector.stories.tsx
├── TextDataSourceForm.tsx            # Source form orchestrator
├── TextDataSourceForm.stories.tsx
├── TextStaticSourceInput.tsx         # Variant-specific components
├── TextStaticSourceInput.stories.tsx
├── StudentTextFieldSelector.tsx
├── StudentTextFieldSelector.stories.tsx
├── CertificateTextFieldSelector.tsx
├── CertificateTextFieldSelector.stories.tsx
├── TextElementCreateForm.tsx         # Main forms
├── TextElementCreateForm.stories.tsx
├── TextElementUpdateForm.tsx
├── TextElementUpdateForm.stories.tsx
└── index.ts                          # Exports
```

### Naming Conventions

- Files: PascalCase.tsx
- Types: PascalCase
- Components: PascalCase function components
- Translation files: camelCase for AR, enCamelCase for EN
- Prefix element-specific components with element name (e.g., `TextDataSourceForm`)

## Reusable Components

### Shared Across All Elements

**Location**: `element/base/` and `element/component/`

- `BaseCertificateElementForm.tsx` - name, description, position, size, alignment, renderOrder
- `ActionButtons.tsx` - submit, cancel buttons with loading states

### Shared Across Text Elements (TEXT, DATE, NUMBER, COUNTRY, GENDER)

**Location**: `element/textProps/`

- `TextPropsForm.tsx` - font, color, fontSize, overflow
- `FontReferenceSelector.tsx` - Google Fonts + self-hosted fonts

### Shared Across Image Elements (IMAGE, QRCODE)

**Location**: `element/imageProps/` (future)

- `ImagePropsForm.tsx` - image-specific properties

### Shared Template Components

**Location**: `element/variableSelector/`

- `TemplateTextVariableSelector.tsx` - Autocomplete for text variables
- `TemplateSelectVariableSelector.tsx` - Autocomplete for select variables

## Data Flow Pattern

### Working State (Frontend)

Use GraphQL Input types directly:

```typescript
type TextElementFormCreateState = {
  base: CertificateElementBaseCreateInput;
  textProps: TextPropsCreateInput;
  dataSource: TextDataSourceInput;  // OneOf type
};
```

### Loading Existing Data (Output to Input)

Convert from Output types (query results) to Input types (form state):

```typescript
// Query returns Output type
const element: TextElement = { /* ... with __typename */ };

// Convert to Input type for form
const formState: TextElementFormUpdateState = {
  base: { /* ... */ },
  textProps: textPropsToGraphQL(element.textProps),
  dataSource: textDataSourceToGraphQL(element.textDataSource),
};
```

### Conversion Utilities

Create in element's `types.ts`:

```typescript
// Convert Output (with __typename) to Input (OneOf)
export const textDataSourceToGraphQL = (
  state: TextDataSource
): TextDataSourceInput => {
  switch (state.__typename) {
    case "TextDataSourceStatic":
      return { static: { value: state.value ?? "" } };
    case "TextDataSourceStudentField":
      return { studentField: { field: state.studentField! } };
    // ...
  }
};
```

## Project Standards

### Package Manager

- Use Bun: `~/.bun/bin/bun`
- Install: `~/.bun/bin/bun add package-name`
- Scripts: `~/.bun/bin/bun run script-name`

### Logging

- Client files: `import { logger } from "@/client/lib/logger"`
- Server files: `import logger from "@/server/lib/logger.ts"`
- NO `console.log()` statements anywhere

### Code Quality

- Run TypeScript: `~/.bun/bin/bun tsc`
- Run Linting: `~/.bun/bin/bun lint`
- Fix all errors before completing implementation

### UI Library

- Material-UI (MUI) v6
- Import from `@mui/material`
- Use theme-aware components

## Element-Specific Plan Creation Process

### Step 1: Information Gathering

For each element, gather:

1. Generated GraphQL types from `client/graphql/generated/gql/graphql.ts`
2. Backend mutation from `server/graphql/mutation/element.mutation.ts`
3. Repository logic from `server/db/repo/element/[element].element.repository.ts`
4. Backend output types from `server/types/element/output/[element].element.types.ts` (for understanding)

### Step 2: Component Identification

Identify:

- Data source selector (if element has data sources)
- Element-specific props form
- Which shared components to reuse (TextProps, ImageProps, BaseElement)

### Step 3: Type Definition

Create `types.ts` with:

- Composed state types (combining GraphQL types)
- Error types using `FormErrors<T>`
- Update function types
- Conversion utilities (Output to Input)

### Step 4: Validation Definition

Create validators with:

- OneOf validation for complex inputs
- Field-level validation for simple inputs
- Consistent naming: `[element]Validators.ts`

### Step 5: Component Implementation

Build in order:

1. Small components (selectors, inputs) with `.stories.tsx`
2. Composite components (data source form, props form) with `.stories.tsx`
3. Main forms (create, update) with `.stories.tsx`
4. Export file (`index.ts`)

### Step 6: Quality Assurance

- TypeScript compilation must pass
- Linting must pass
- All Storybook stories render
- All translations in place

## TEXT Element as Reference

The TEXT element implementation in `element/text/` serves as the reference. Key patterns:

### Type Pattern

```typescript
// types.ts - Composed states, no custom discriminated unions
export type TextElementFormCreateState = {
  base: CertificateElementBaseCreateInput;
  textProps: TextPropsCreateInput;
  dataSource: TextDataSourceInput;
};

export type TextElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dataSource: DataSourceFormErrors;
};
```

### Validation Pattern

```typescript
// textValidators.ts - OneOf validation
export const validateTextDataSource = (
  dataSource: TextDataSourceInput
): DataSourceFormErrors => {
  if (dataSource.static) { /* validate */ }
  else if (dataSource.studentField) { /* validate */ }
  // ...
};
```

### Conversion Pattern

```typescript
// Convert Output type to Input type
export const textDataSourceToGraphQL = (
  state: TextDataSource  // Output with __typename
): TextDataSourceInput => {  // Input OneOf
  switch (state.__typename) {
    case "TextDataSourceStatic":
      return { static: { value: state.value ?? "" } };
    // ...
  }
};
```

## Success Criteria

An element implementation is complete when:

1. TypeScript compilation passes
2. Linting passes
3. All components are stateless (props-based)
4. All types use GraphQL types (no custom discriminated unions)
5. All translations in place (AR + EN)
6. All Storybook stories working
7. Both create and update forms functional
8. Reusable components properly used
9. All validators follow naming convention

## Notes

This master plan reflects the refined architecture established in the TEXT element implementation. All custom discriminated unions have been replaced with direct GraphQL type usage, and the OneOf pattern is handled at the form level.