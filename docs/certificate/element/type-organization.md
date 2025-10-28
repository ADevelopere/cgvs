# Type Organization

## Directory Structure

```
server/types/element/
├── index.ts                      # Re-exports all types
├── enum.element.types.ts         # General enums only
├── config.element.types.ts       # Shared configurations
├── base.element.types.ts         # Base types for extension
├── union.element.types.ts        # All unions & responses
├── text.element.types.ts         # TEXT element
├── date.element.types.ts         # DATE element
├── number.element.types.ts       # NUMBER element
├── country.element.types.ts      # COUNTRY element
├── gender.element.types.ts       # GENDER element
├── image.element.types.ts        # IMAGE element
└── qrcode.element.types.ts       # QR_CODE element
```

## File Purposes

### 1. enum.element.types.ts
**General enums used across multiple element types**

```typescript
export enum ElementType { TEXT, NUMBER, DATE, IMAGE, GENDER, COUNTRY, QR_CODE }
export enum ElementAlignment { START, END, TOP, BOTTOM, CENTER, BASELINE }
export enum FontSource { GOOGLE, SELF_HOSTED }
```

**What belongs here**: Enums that are generic and used by multiple elements

**What doesn't**: Element-specific enums (go in element files)

### 2. config.element.types.ts
**Shared configuration types**

```typescript
export enum ElementOverflow { RESIZE_DOWN, TRUNCATE, ELLIPSE, WRAP }
export type FontReference = ...
export type TextProps = { fontRef, fontSize, color, overflow }
```

**What belongs here**: Types and enums shared by multiple elements (TextProps used by 5 elements)

### 3. base.element.types.ts
**Base types meant to be extended**

```typescript
export type CertificateElementEntity = typeof certificateElement.$inferSelect
export type CertificateElementBaseUpdateInput = { id, name?, positionX?, ... }
export type ElementOrderUpdateInput = ...
```

**What belongs here**: Entity types, base update inputs, batch operations

**What doesn't**: Unions (circular dependency issue) - those go in union file

### 4. Element-Specific Files (7 files)

Each element type gets its own file with:

```typescript
// Element-specific enums
export enum TextDataSourceType { ... }
export enum StudentTextField { ... }

// Data source types
export type TextDataSource = ...
export type TextDataSourceInput = ...

// Element config
export interface TextElementConfig { ... }
export type TextElementConfigInput = { ... }

// Mutation inputs
export type TextElementCreateInput = { ... }
export type TextElementUpdateInput = { ... }

// Pothos definition
export type TextElementPothosDefinition = { ... }
```

**Pattern**: Everything related to that element type in one file

### 5. union.element.types.ts
**All discriminated unions**

```typescript
export type ElementConfig = TextElementConfig | DateElementConfig | ...
export type ElementConfigInput = TextElementConfigInput | ...
export type CertificateElementPothosUnion = ...
export type CertificateElementPothosDefinition = ...
export type CertificateElementsResponse = ...
```

**Why separate**: Prevents circular dependencies (imports from all element files)

### 6. index.ts
**Re-export everything**

```typescript
export * from "./enum.element.types"
export * from "./config.element.types"
// ... all files
```

**Purpose**: Single import point for consumers

## Import Patterns

### Element files import from:
```typescript
import { ElementType, ElementAlignment } from "./enum.element.types"
import { TextProps, TextPropsInput } from "./config.element.types"
import { CertificateElementBaseUpdateInput } from "./base.element.types"
import type { CertificateElementPothosDefinition } from "./union.element.types"
```

### Union file imports from:
```typescript
import { CertificateElementEntity } from "./base.element.types"
import { TemplatePothosDefintion } from "../template.types"
import { TextElementConfig, TextElementConfigInput, ... } from "./text.element.types"
// ... all element files
```

### External code imports from:
```typescript
import { ElementType, TextElementCreateInput, ElementConfig } from "@/server/types/element"
```

## Naming Conventions

### File Naming
- `*.element.types.ts` - Makes it clear these are element types
- Lowercase, kebab-case (e.g., `qrcode.element.types.ts`)

### Type Naming

| Pattern | Example | Usage |
|---------|---------|-------|
| `{Element}Config` | `TextElementConfig` | JSONB config (runtime) |
| `{Element}ConfigInput` | `TextElementConfigInput` | GraphQL mutation input |
| `{Element}CreateInput` | `TextElementCreateInput` | Create mutation |
| `{Element}UpdateInput` | `TextElementUpdateInput` | Update mutation |
| `{Element}PothosDefinition` | `TextElementPothosDefinition` | GraphQL output |
| `{Type}DataSource` | `TextDataSource` | Runtime data source config |
| `{Type}DataSourceInput` | `TextDataSourceInput` | GraphQL data source input |

### Enum Naming
- Element-specific: `{Type}DataSourceType`, `{Type}Field`
- General: `ElementType`, `ElementAlignment`

## Organization Benefits

### 1. Easy Navigation
Finding text element types? Look in `text.element.types.ts` - everything is there.

### 2. No Circular Dependencies
```
enum → config → base → elements → union
```
Clear dependency flow, unions at the end.

### 3. Co-located Concerns
Element-specific enums live with their element, not scattered across files.

### 4. Scalable
Adding new element types? Create one new file, add to union.

### 5. Type Safety
TypeScript discriminated unions ensure correctness throughout the codebase.

## Adding New Element Types

1. **Create file**: `{type}.element.types.ts`
2. **Add enums**: Element-specific enums
3. **Define types**: DataSource, Config, ConfigInput, Inputs, Pothos
4. **Export from index**: Add `export * from "./{type}.element.types"`
5. **Add to unions**: Update `union.element.types.ts`

Example for hypothetical SIGNATURE element:

```typescript
// signature.element.types.ts
export enum SignatureDataSourceType {
  STUDENT_SIGNATURE = "STUDENT_SIGNATURE",
  STATIC_IMAGE = "STATIC_IMAGE",
}

export type SignatureDataSource = 
  | { type: SignatureDataSourceType.STUDENT_SIGNATURE }
  | { type: SignatureDataSourceType.STATIC_IMAGE; storageFileId: number }

export interface SignatureElementConfig {
  type: ElementType.SIGNATURE
  dataSource: SignatureDataSource
  strokeColor: string
}

// ... rest of types
```

Then add to `ElementConfig` union in `union.element.types.ts`.

