<!-- 19c53f0b-b7db-4712-a157-f34c376f88ef 2eb208e2-0ffc-4a63-8fc5-c64d700613d9 -->
# Update Date Element Pothos GraphQL Definitions

## Overview

Refactor `date.element.pothos.ts` to align with the new table-per-type architecture where date-specific fields are exposed directly (not nested in a `config` object).

## Key Changes

### 1. Remove Config Objects

**Lines to Remove:** ~199-254 in `server/graphql/pothos/element/date.element.pothos.ts`

Remove the following objects as they reference non-existent types:

- `DateElementConfigObject` (references `Types.DateElementConfig` which doesn't exist)
- `DateElementConfigInputObject` (references `Types.DateElementConfigInputGraphql` which doesn't exist)
- `DateElementConfigUpdateInputObject` (references `Types.DateElementConfigUpdateInputGraphql` which doesn't exist)

### 2. Keep Data Source Objects

**Keep:** All data source enums, objects, and unions (~17-197)

Unlike COUNTRY elements, DATE elements have multiple data source types that need to be exposed in the GraphQL schema:

- `DateDataSourceTypePothosEnum`
- `StudentDateFieldPothosEnum`
- `CertificateDateFieldPothosEnum`
- All data source objects (Static, StudentField, CertificateField, TemplateVariable)
- `DateDataSourceUnion`
- All data source input objects and `DateDataSourceInputObject`

### 3. Keep Additional Enums

**Keep:** Calendar and transformation enums

- `CalendarTypePothosEnum`
- `DateTransformationTypePothosEnum`

### 4. Update Create Input Object

**File:** `server/graphql/pothos/element/date.element.pothos.ts`

Change from:

```typescript
fields: t => ({
  ...createBaseElementInputFields(t),
  config: t.field({ type: DateElementConfigInputObject, required: true }),
})
```

To:

```typescript
fields: t => ({
  ...createBaseElementInputFields(t),
  textProps: t.field({ type: TextPropsInputObject, required: true }),
  calendarType: t.field({ type: CalendarTypePothosEnum, required: true }),
  offsetDays: t.int({ required: true }),
  format: t.string({ required: true }),
  transformation: t.field({ type: DateTransformationTypePothosEnum, required: false }),
  dataSource: t.field({ type: DateDataSourceInputObject, required: true }),
})
```

This matches `DateElementCreateInputGraphql` type.

### 5. Update Update Input Object

**File:** `server/graphql/pothos/element/date.element.pothos.ts`

Change from:

```typescript
fields: t => ({
  ...createBaseElementUpdateInputFields(t),
  config: t.field({ type: DateElementConfigUpdateInputObject, required: false }),
})
```

To:

```typescript
fields: t => ({
  ...createBaseElementUpdateInputFields(t),
  textProps: t.field({ type: TextPropsUpdateInputObject, required: false }),
  calendarType: t.field({ type: CalendarTypePothosEnum, required: false }),
  offsetDays: t.int({ required: false }),
  format: t.string({ required: false }),
  transformation: t.field({ type: DateTransformationTypePothosEnum, required: false }),
  dataSource: t.field({ type: DateDataSourceInputObject, required: false }),
})
```

This matches `DateElementUpdateInputGraphql` type.

### 6. Update Element Object Fields

**File:** `server/graphql/pothos/element/date.element.pothos.ts`

Change from:

```typescript
fields: t => ({
  config: t.expose("config", { type: DateElementConfigObject }),
})
```

To:

```typescript
fields: t => ({
  textProps: t.expose("textProps", { type: TextPropsObject }),
  calendarType: t.expose("calendarType", { type: CalendarTypePothosEnum }),
  offsetDays: t.exposeInt("offsetDays"),
  format: t.exposeString("format"),
  transformation: t.expose("transformation", { 
    type: DateTransformationTypePothosEnum,
    nullable: true,
  }),
  dataSource: t.expose("dataSource", { type: DateDataSourceUnion }),
})
```

This exposes the direct fields from `DateElementOutput`.

### 7. Add Missing Pothos Definition Type

**File:** `server/types/element/output/date.element.types.ts`

Add at the end:

```typescript
export type DateElementPothosDefinition = DateElementOutput;
```

## Final Structure

After refactoring, the file should have:

1. **Enums**: All date-related enums (DataSourceType, StudentField, CertificateField, CalendarType, TransformationType)
2. **Data Source Objects**: All 4 data source output objects + union
3. **Data Source Inputs**: All 4 data source input objects + isOneOf input
4. **Create Input**: `DateElementCreateInputObject` with direct fields
5. **Update Input**: `DateElementUpdateInputObject` with optional direct fields
6. **Element Object**: `DateElementObject` exposing direct fields

## Files to Modify

- `server/graphql/pothos/element/date.element.pothos.ts` - Main refactor
- `server/types/element/output/date.element.types.ts` - Add PothosDefinition type

## Testing

After implementation:

1. Run `~/.bun/bin/bun tsc --noEmit` to verify TypeScript compilation
2. Run `~/.bun/bin/bun lint` to check for linting issues
3. Verify GraphQL schema generation works
4. Test create/update date element mutations

### To-dos

- [ ] Add DateElementPothosDefinition type to date.element.types.ts
- [ ] Remove DateElementConfigObject, DateElementConfigInputObject, and DateElementConfigUpdateInputObject
- [ ] Update DateElementCreateInputObject to have direct fields (textProps, calendarType, offsetDays, format, transformation, dataSource)
- [ ] Update DateElementUpdateInputObject to have optional direct fields
- [ ] Update DateElementObject to expose direct fields instead of config