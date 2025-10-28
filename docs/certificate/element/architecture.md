# Architecture & Design Decisions

## Problem Statement

Certificate templates need flexible elements (text, dates, images, QR codes) with:

- Type-specific configurations
- Different data sources
- Database integrity
- Efficient querying
- Type safety in TypeScript

## Considered Approaches

### Option 1: Class Table Inheritance (Normalized)

```
certificate_element (base)
├── element_text
├── element_date
├── element_image
└── ...
```

**Pros**: Full normalization, clear schema, FK constraints
**Cons**: Complex JOINs, difficult union queries, many tables

### Option 2: Single Table Inheritance (STI)

All element types in one table with many nullable columns.

**Pros**: Simple queries
**Cons**: Wasted space, no DB validation, confusing schema

### Option 3: Typed JSONB (Pure)

Single table with all config in JSONB.

**Pros**: Clean schema, perfect for unions, flexible
**Cons**: No FK constraints, no DB validation

### ✅ Option 4: Hybrid (CHOSEN)

Single table with typed JSONB + FK columns for critical references.

**Pros**:

- Clean schema with type-safe JSONB
- FK constraints for data integrity
- Perfect for union queries
- Drizzle relations support
- Easy partial updates

**Cons**:

- Need to sync config and columns (acceptable trade-off)

## Final Architecture

```typescript
certificate_element {
  // Base properties
  id, name, description, templateId, type
  positionX, positionY, width, height
  alignment, renderOrder

  // Complete configuration (source of truth)
  config: JSONB<ElementConfig>

  // FK columns (mirrored from config)
  fontId → font.id
  templateVariableId → template_variable_base.id
  storageFileId → storage_files.id
}
```

## Why This Works

### 1. Config is Source of Truth

The JSONB config contains the complete, portable element configuration. It can be:

- Versioned
- Exported/imported
- Validated by TypeScript
- Partially updated

### 2. FK Columns for Integrity

Extract critical foreign keys to columns for:

- Database FK constraints (data must exist)
- Cascade protection (can't delete referenced entities)
- Drizzle relations (efficient batch loading)
- Query performance (filter without parsing JSONB)

### 3. TypeScript Discriminated Unions

```typescript
type ElementConfig =
  | TextElementConfig
  | DateElementConfig
  | ...
```

Each config type has `type` field for runtime discrimination, enabling:

- Type-safe access in TypeScript
- Pothos GraphQL union types
- Correct type narrowing

## Type Organization

Types are split into 11 files by concern:

1. **enum.element.types.ts** - General enums (ElementType, ElementAlignment, FontSource)
2. **config.element.types.ts** - Shared configs (FontReference, TextProps, ElementOverflow)
3. **base.element.types.ts** - Base types for extension
   4-10. **One file per element** - Element-specific enums, configs, inputs, Pothos types
4. **union.element.types.ts** - All unions and response types

**Benefits**:

- Easy to find element-specific types
- No circular dependencies
- Clear separation of concerns
- Element-specific enums co-located

## Data Model

### Element Hierarchy

```
CertificateElement (base)
├── config: ElementConfig (union)
│   ├── TextElementConfig
│   │   ├── textProps: TextProps
│   │   └── dataSource: TextDataSource
│   ├── DateElementConfig
│   │   ├── textProps: TextProps
│   │   ├── calendarType, format, mapping
│   │   └── dataSource: DateDataSource
│   └── ...
├── fontId (nullable)
├── templateVariableId (nullable)
└── storageFileId (nullable)
```

### Relations

```
font
└── elements[] ← certificateElement.fontId

templateVariableBases
└── elements[] ← certificateElement.templateVariableId

storageFiles
└── certificateElements[] ← certificateElement.storageFileId

templates
└── elements[] ← certificateElement.templateId
```

## Key Design Principles

1. **Explicit over Implicit** - All data sources are explicit
2. **Type Safety** - Discriminated unions prevent type errors
3. **Single Source of Truth** - Config contains everything
4. **Database Integrity** - FK constraints protect data
5. **Developer Experience** - Clear types, good documentation

## Future Extensibility

Adding new element types:

1. Create new file `{type}.element.types.ts`
2. Define enum, config, input, pothos types
3. Add to `ElementConfig` union
4. Update sync rules if needed
5. No schema changes required (config is flexible)

Adding new data sources:

1. Add enum value to element's data source enum
2. Add variant to data source discriminated union
3. Update application layer to handle it
4. Type safety ensures completeness

## Migration Strategy

Since no data exists yet:

- Add FK columns with `ALTER TABLE ADD COLUMN`
- All nullable initially
- Future inserts populate both config and columns
- Application layer ensures synchronization
