<!-- d2e99316-c9bc-484f-ac00-0aff9f5f1f2f 57e76e2f-5055-49dd-99b3-c7d92cfdc7ce -->
# Element Repository Master Implementation

## Overview

Create `server/db/repo/element/element.repository.ts` as the master orchestrator for certificate elements with generic operations, FK synchronization, and validation.

## File Structure

```
server/db/repo/element/
├── element.repository.ts     # Master repository (this plan)
└── index.ts                   # Export all repositories
```

## Core Responsibilities

### 1. Generic Read Operations

Operations that work across all element types:

- `findById(id)` - Find single element by ID (nullable)
- `findByIdOrThrow(id)` - Find or throw error
- `findByTemplateId(templateId)` - Get all elements for a template, ordered by renderOrder
- `loadByIds(ids)` - Batch load for dataloader pattern
- `loadByTemplateIds(templateIds)` - Batch load elements grouped by template

### 2. Validation Operations

**Existence Checks:**

- `existsById(id)` - Check if element exists
- `validateTemplateId(templateId)` - Ensure template exists before creating elements

**FK Reference Validation:**

- `validateFontId(fontId)` - Verify font exists (when using SELF_HOSTED)
- `validateTemplateVariableId(variableId)` - Verify template variable exists
- `validateStorageFileId(fileId)` - Verify storage file exists

**Element Property Validation:**

- `validateName(name)` - Validate name length (3-255 characters)
- `validateDimensions(width, height)` - Ensure dimensions > 0
- `validatePosition(x, y)` - Ensure position >= 0
- `validateRenderOrder(order)` - Ensure render order >= 0

**Config Validation:**

- `validateConfigReferences(config)` - Validate all FK references in config exist

### 3. Delete Operations

- `deleteById(id)` - Delete single element
- `deleteByIds(ids)` - Batch delete (for template deletion)

### 4. Batch Operations

- `updateRenderOrder(updates)` - Update multiple element render orders in single transaction

### 5. FK Extraction Helpers (Internal)

Critical for config-column synchronization:

```typescript
// Extract fontId from config (if element has textProps and uses SELF_HOSTED)
extractFontId(config: ElementConfig): number | null

// Extract templateVariableId from config.dataSource.variableId
extractTemplateVariableId(config: ElementConfig): number | null

// Extract storageFileId from config (IMAGE elements only)
extractStorageFileId(config: ElementConfig): number | null
```

## Key Implementation Details

### FK Synchronization Rules

Per `docs/certificate/element/config-column-sync.md`:

**fontId**: From `config.textProps.fontRef.fontId` when `type === SELF_HOSTED`

- Applies to: TEXT, DATE, NUMBER, COUNTRY, GENDER

**templateVariableId**: From `config.dataSource.variableId`

- TEXT: when using TEMPLATE_TEXT_VARIABLE or TEMPLATE_SELECT_VARIABLE
- DATE: when using TEMPLATE_DATE_VARIABLE  
- NUMBER: ALWAYS (always uses TEMPLATE_NUMBER_VARIABLE)

**storageFileId**: From `config.dataSource.storageFileId`

- IMAGE: ALWAYS (only element type that uses it)

### Pattern to Follow

Based on `font.repository.ts` and `template.repository.ts`:

1. Use namespace export: `export namespace ElementRepository`
2. Import from `@/server/db/drizzleDb` for database
3. Import types from `@/server/types/element`
4. Use Drizzle operators: `eq`, `inArray`, `asc`, `sql`
5. Return proper types or null/Error for dataloaders
6. Log important operations with `logger` from `@/server/lib/logger`

### Dataloader Support

Follow the pattern from `font.repository.ts` line 381-395:

```typescript
export const loadByIds = async (
  ids: number[]
): Promise<(CertificateElementEntity | Error)[]> => {
  if (ids.length === 0) return [];
  
  const elements = await db
    .select()
    .from(certificateElement)
    .where(inArray(certificateElement.id, ids));
  
  // Map to maintain order, return Error for missing
  return ids.map(id => {
    const found = elements.find(e => e.id === id);
    return found || new Error(`Element with ID ${id} not found`);
  });
};
```

Similar pattern for `loadByTemplateIds` but group by templateId.

### Validation Example

```typescript
export const validateTemplateId = async (templateId: number): Promise<void> => {
  const exists = await TemplateRepository.existsById(templateId);
  if (!exists) {
    throw new Error(`Template with ID ${templateId} does not exist.`);
  }
};
```

### FK Extraction Logic

Must handle TypeScript discriminated unions properly:

```typescript
const extractFontId = (config: ElementConfig): number | null => {
  // Only TEXT, DATE, NUMBER, COUNTRY, GENDER have textProps
  if (!('textProps' in config)) return null;
  
  const { textProps } = config;
  if (textProps.fontRef.type === FontSource.SELF_HOSTED) {
    return textProps.fontRef.fontId;
  }
  return null;
};

const extractTemplateVariableId = (config: ElementConfig): number | null => {
  if (!('dataSource' in config)) return null;
  
  const { dataSource } = config;
  // Check if dataSource has variableId property
  if ('variableId' in dataSource) {
    return dataSource.variableId;
  }
  return null;
};

const extractStorageFileId = (config: ElementConfig): number | null => {
  // Only IMAGE elements have storageFileId
  if (config.type !== ElementType.IMAGE) return null;
  
  return config.dataSource.storageFileId;
};
```

## File Location & Imports

**Path**: `server/db/repo/element/element.repository.ts`

**Imports needed**:

```typescript
import { db } from "@/server/db/drizzleDb";
import { eq, inArray, asc } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import {
  CertificateElementEntity,
  ElementConfig,
  ElementType,
  FontSource,
  ElementOrderUpdateInput,
} from "@/server/types/element";
import logger from "@/server/lib/logger";
import { TemplateRepository } from "../template.repository";
```

**Index export**: Create `server/db/repo/element/index.ts`:

```typescript
export * from "./element.repository";
```

## Expected File Size

Approximately 250-300 lines:

- Generic CRUD: ~100 lines
- FK extractors: ~60 lines  
- Validation: ~40 lines
- Dataloader support: ~60 lines
- Imports, types, comments: ~40 lines

## Function Signatures

All exports under `ElementRepository` namespace:

```typescript
export namespace ElementRepository {
  // Read
  export const findById: (id: number) => Promise<CertificateElementEntity | null>
  export const findByIdOrThrow: (id: number) => Promise<CertificateElementEntity>
  export const findByTemplateId: (templateId: number) => Promise<CertificateElementEntity[]>
  
  // Batch read (dataloaders)
  export const loadByIds: (ids: number[]) => Promise<(CertificateElementEntity | Error)[]>
  export const loadByTemplateIds: (templateIds: number[]) => Promise<CertificateElementEntity[][]>
  
  // Validation
  export const existsById: (id: number) => Promise<boolean>
  export const validateTemplateId: (templateId: number) => Promise<void>
  
  // Delete
  export const deleteById: (id: number) => Promise<void>
  export const deleteByIds: (ids: number[]) => Promise<void>
  
  // Batch operations
  export const updateRenderOrder: (updates: ElementOrderUpdateInput[]) => Promise<void>
  
  // FK helpers (internal - not exported outside namespace)
  const extractFontId: (config: ElementConfig) => number | null
  const extractTemplateVariableId: (config: ElementConfig) => number | null
  const extractStorageFileId: (config: ElementConfig) => number | null
}
```

## Notes

- Type-specific create/update operations will be in separate files (text.element.repository.ts, etc.)
- Those type-specific repos will call the FK extractors from this master repo
- Follow the "config is source of truth" principle - FK columns mirror config
- All FK helpers are internal (const not export) - only type repos use them via internal access
- Return types match existing patterns: nullable for find, throw for findOrThrow, Error[] for dataloaders