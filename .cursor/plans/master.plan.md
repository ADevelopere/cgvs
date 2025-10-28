<!-- 066c30c9-08ba-4410-b39f-696ce9a76cb3 af2812ad-9651-4774-8b49-0e68fa74b874 -->
# Element Repository Structure

## Overview

Create repository layer for certificate elements with master orchestrator and type-specific repositories, mirroring the type organization.

## Directory Structure

```
server/db/repo/element/
├── index.ts                          # Master repository (exports all)
├── element.repository.ts             # Base element operations ✅ DONE
├── text.element.repository.ts        # TEXT-specific operations ✅ DONE
├── date.element.repository.ts        # DATE-specific operations
├── number.element.repository.ts      # NUMBER-specific operations
├── country.element.repository.ts     # COUNTRY-specific operations
├── gender.element.repository.ts      # GENDER-specific operations
├── image.element.repository.ts       # IMAGE-specific operations
└── qrcode.element.repository.ts      # QR_CODE-specific operations
```

## Repository Responsibilities

### element.repository.ts (Master) ✅ COMPLETED

**Generic operations that work across all element types:**

```typescript
export namespace ElementRepository {
  // Read operations
  export const findById(id: number): Promise<CertificateElementEntity | null>
  export const findByIdOrThrow(id: number): Promise<CertificateElementEntity>
  export const findByTemplateId(templateId: number): Promise<CertificateElementEntity[]>
  export const loadByIds(ids: number[]): Promise<CertificateElementEntity[]>  // For dataloader

  // Delete operations
  export const deleteById(id: number): Promise<void>
  export const deleteByIds(ids: number[]): Promise<void>

  // Batch operations
  export const updateRenderOrder(updates: ElementOrderUpdateInput[]): Promise<void>

  // Validation
  export const existsById(id: number): Promise<boolean>
  export const validateTemplateId(templateId: number): Promise<void>
  export const validateFontId(fontId: number): Promise<void>
  export const validateTemplateVariableId(variableId: number): Promise<void>
  export const validateStorageFileId(fileId: number): Promise<void>
  export const validateConfigReferences(config: ElementConfig): Promise<void>
}
```

### Type-Specific Repositories

Each element type gets its own repository for create/update operations:

**Pattern (all follow this structure):**

```typescript
export namespace {Type}ElementRepository {
  export const create(input: {Type}ElementCreateInput): Promise<CertificateElementEntity>
  export const update(input: {Type}ElementUpdateInput): Promise<CertificateElementEntity>
  export const validateConfig(config: {Type}ElementConfigInput): Promise<void>
  const validateCreateInput(input: {Type}ElementCreateInput): Promise<void>
  const validateUpdateInput(input: {Type}ElementUpdateInput): Promise<void>
}
```

## Implementation Status

### ✅ COMPLETED

- **element.repository.ts** - Base repository with generic operations
- **text.element.repository.ts** - TEXT element operations
- **index.ts** - Exports element and text repositories

### 🔲 REMAINING (6 repositories)

1. **date.element.repository.ts** - DATE element

   - Similar to TEXT
   - Has textProps
   - Date-specific data sources (STUDENT_DOB, CERTIFICATE_RELEASE_DATE, TEMPLATE_DATE_VARIABLE)
   - Calendar type validation
   - Date format validation

2. **number.element.repository.ts** - NUMBER element

   - Similar to TEXT
   - Has textProps
   - Always uses TEMPLATE_NUMBER_VARIABLE
   - Mapping validation (breakpoint rules)

3. **country.element.repository.ts** - COUNTRY element

   - Simpler than TEXT
   - Has textProps
   - Only STUDENT_NATIONALITY data source
   - No variable FK validation needed

4. **gender.element.repository.ts** - GENDER element

   - Simpler than TEXT
   - Has textProps
   - Only STUDENT_GENDER data source
   - No variable FK validation needed

5. **image.element.repository.ts** - IMAGE element

   - Different from TEXT
   - NO textProps
   - Validates storageFileId
   - Image fit validation

6. **qrcode.element.repository.ts** - QR_CODE element

   - Simplest of all
   - NO textProps
   - NO FKs at all
   - QR-specific config (verification URL, size, error correction)

## Key Features (Applied to All)

### 1. FK Synchronization (Automatic)

All create/update operations automatically sync FK columns using `ElementUtils`:

```typescript
const fontId = ElementUtils.extractFontId(config);
const templateVariableId = ElementUtils.extractTemplateVariableId(config);
const storageFileId = ElementUtils.extractStorageFileId(config);
```

### 2. Type-Safe Operations

Each repository knows its element type and enforces it:

```typescript
if (existing.type !== ElementType.{TYPE}) {
  throw new Error(`Element is ${existing.type}, not {TYPE}. Use correct repository.`)
}
```

### 3. Validation

Each repository validates:

- Template exists
- Name, dimensions, position, render order
- Type-specific config
- FK references (fonts, variables, files)

### 4. Partial Updates

All update functions support partial updates:

- Only provided fields are updated
- Config merging with existing
- FK re-extraction only when needed

## Organization Benefits

1. **Same as Types** - Repository structure mirrors type structure
2. **Single Responsibility** - Master handles generic, type repos handle specific
3. **No Duplication** - FK extraction in utils, reused by all
4. **Type Safety** - TypeScript ensures correct config for each type
5. **Testable** - Each repository independently testable

## Next Steps

### Immediate (Remaining 6 Repositories)

1. Implement DATE repository (similar to TEXT)
2. Implement NUMBER repository (similar to TEXT)
3. Implement COUNTRY repository (simpler)
4. Implement GENDER repository (simpler)
5. Implement IMAGE repository (different pattern)
6. Implement QR_CODE repository (simplest)
7. Update index.ts to export all
8. Update main repo index (server/db/repo/index.ts)

### File Size Estimates

- DATE: ~200 lines (similar to TEXT)
- NUMBER: ~200 lines (similar to TEXT)
- COUNTRY: ~180 lines (simpler, no variable validation)
- GENDER: ~180 lines (simpler, no variable validation)
- IMAGE: ~180 lines (different, no textProps)
- QR_CODE: ~150 lines (simplest, no FKs)

## Usage Examples

### In GraphQL Mutations

```typescript
import { TextElementRepository } from "@/server/db/repo/element";

const createElement = async (input: TextElementCreateInput) => {
  return TextElementRepository.create(input);
};
```

### In GraphQL Queries

```typescript
import { ElementRepository } from "@/server/db/repo/element";

const getTemplateElements = async (templateId: number) => {
  return ElementRepository.findByTemplateId(templateId);
};
```

### Pattern Consistency

All type-specific repositories follow the TEXT pattern:

- Same function names (create, update, validateConfig)
- Same validation approach
- Same FK extraction
- Same error handling
- Only differences are in type-specific validations

### To-dos

- [ ] Implement date.element.repository.ts with create/update/validate for DATE elements (similar to TEXT)
- [ ] Implement number.element.repository.ts with create/update/validate for NUMBER elements (similar to TEXT)
- [ ] Implement country.element.repository.ts with create/update/validate for COUNTRY elements (simpler than TEXT)
- [ ] Implement gender.element.repository.ts with create/update/validate for GENDER elements (simpler than TEXT)
- [ ] Implement image.element.repository.ts with create/update/validate for IMAGE elements (different - no textProps)
- [ ] Implement qrcode.element.repository.ts with create/update/validate for QR_CODE elements (simplest)
- [ ] Update server/db/repo/element/index.ts to export all 6 new repositories
- [ ] Update server/db/repo/index.ts to export element repositories
- [ ] Run TypeScript compiler and linter to verify all repositories