# Config-Column Synchronization

⚠️ **CRITICAL**: This document explains how to keep JSONB config and FK columns synchronized. Failure to follow these rules will cause database constraint violations.

## The Problem

The `certificate_element` table has both:

1. **config (JSONB)** - Complete element configuration (source of truth)
2. **FK columns** - Nullable integers/bigints for database integrity

**Why both?**

- **Config**: Portable, versioned, complete configuration
- **Columns**: Database FK constraints, relations, cascade protection

**The challenge**: Application layer MUST keep them in sync.

## FK Columns

Three foreign key columns exist:

```sql
font_id              INTEGER REFERENCES font(id) ON DELETE RESTRICT
template_variable_id INTEGER REFERENCES template_variable_base(id) ON DELETE RESTRICT
storage_file_id      BIGINT  REFERENCES storage_files(id) ON DELETE RESTRICT
```

All are **nullable** because not every element uses them.

## Synchronization Rules

### By Element Type

| Element | fontId           | templateVariableId  | storageFileId |
| ------- | ---------------- | ------------------- | ------------- |
| TEXT    | ✓ if SELF_HOSTED | ✓ if using variable | NULL          |
| DATE    | ✓ if SELF_HOSTED | ✓ if using variable | NULL          |
| NUMBER  | ✓ if SELF_HOSTED | ✓ ALWAYS            | NULL          |
| COUNTRY | ✓ if SELF_HOSTED | NULL                | NULL          |
| GENDER  | ✓ if SELF_HOSTED | NULL                | NULL          |
| IMAGE   | NULL             | NULL                | ✓ ALWAYS      |
| QR_CODE | NULL             | NULL                | NULL          |

### Detailed Rules

#### fontId Column

**Source**: `config.textProps.fontRef`

**When to populate**:

```typescript
if (config.textProps?.fontRef.type === FontSource.SELF_HOSTED) {
  fontId = config.textProps.fontRef.fontId;
} else {
  fontId = null; // Google font or no font
}
```

**Applies to**: TEXT, DATE, NUMBER, COUNTRY, GENDER

**Example**:

```typescript
// Self-hosted font
config: {
  type: ElementType.TEXT,
  textProps: {
    fontRef: { type: FontSource.SELF_HOSTED, fontId: 42 },
    // ...
  }
}
// → fontId column = 42

// Google font
config: {
  type: ElementType.TEXT,
  textProps: {
    fontRef: { type: FontSource.GOOGLE, identifier: "Roboto" },
    // ...
  }
}
// → fontId column = NULL
```

#### templateVariableId Column

**Source**: `config.dataSource.variableId`

**When to populate**:

```typescript
if (
  config.dataSource.type === TextDataSourceType.TEMPLATE_TEXT_VARIABLE ||
  config.dataSource.type === TextDataSourceType.TEMPLATE_SELECT_VARIABLE ||
  config.dataSource.type === DateDataSourceType.TEMPLATE_DATE_VARIABLE ||
  config.dataSource.type === NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE
) {
  templateVariableId = config.dataSource.variableId;
} else {
  templateVariableId = null;
}
```

**Applies to**: TEXT, DATE, NUMBER

**Examples**:

```typescript
// TEXT using template variable
config: {
  type: ElementType.TEXT,
  dataSource: {
    type: TextDataSourceType.TEMPLATE_TEXT_VARIABLE,
    variableId: 123
  }
}
// → templateVariableId column = 123

// TEXT using student field (no variable)
config: {
  type: ElementType.TEXT,
  dataSource: {
    type: TextDataSourceType.STUDENT_TEXT_FIELD,
    field: StudentTextField.STUDENT_NAME
  }
}
// → templateVariableId column = NULL

// NUMBER always uses variable
config: {
  type: ElementType.NUMBER,
  dataSource: {
    type: NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE,
    variableId: 456
  }
}
// → templateVariableId column = 456 (ALWAYS populated for NUMBER)
```

#### storageFileId Column

**Source**: `config.dataSource.storageFileId`

**When to populate**:

```typescript
if (config.type === ElementType.IMAGE) {
  storageFileId = config.dataSource.storageFileId;
} else {
  storageFileId = null;
}
```

**Applies to**: IMAGE only

**Example**:

```typescript
// IMAGE element
config: {
  type: ElementType.IMAGE,
  dataSource: {
    type: ImageDataSourceType.STORAGE_FILE,
    storageFileId: 789
  }
}
// → storageFileId column = 789
```

## Implementation

### Create Element

```typescript
async function createElement(input: TextElementCreateInput) {
  const { config, ...baseProps } = input;

  // Extract FK IDs from config
  const fontId = extractFontId(config);
  const templateVariableId = extractTemplateVariableId(config);
  const storageFileId = extractStorageFileId(config);

  // Insert with both config and FK columns
  return await db.insert(certificateElement).values({
    ...baseProps,
    config, // Complete config
    fontId, // Extracted FK
    templateVariableId, // Extracted FK
    storageFileId, // Extracted FK
  });
}
```

### Update Element

For partial updates, only extract FKs if config is being updated:

```typescript
async function updateElement(input: TextElementUpdateInput) {
  const { id, config, ...baseProps } = input;

  const updates: Partial<CertificateElementEntityInput> = {
    ...baseProps,
  };

  // If config is being updated, re-extract FKs
  if (config) {
    updates.config = config;
    updates.fontId = extractFontId(config);
    updates.templateVariableId = extractTemplateVariableId(config);
    updates.storageFileId = extractStorageFileId(config);
  }

  return await db.update(certificateElement).set(updates).where(eq(certificateElement.id, id));
}
```

### Helper Functions

```typescript
function extractFontId(config: ElementConfig): number | null {
  // Only text-based elements have fontId
  if (!("textProps" in config)) return null;

  const { textProps } = config;
  if (textProps.fontRef.type === FontSource.SELF_HOSTED) {
    return textProps.fontRef.fontId;
  }
  return null;
}

function extractTemplateVariableId(config: ElementConfig): number | null {
  if (!("dataSource" in config)) return null;

  const { dataSource } = config;

  // Check if dataSource has variableId
  if ("variableId" in dataSource) {
    return dataSource.variableId;
  }
  return null;
}

function extractStorageFileId(config: ElementConfig): number | null {
  if (config.type !== ElementType.IMAGE) return null;

  return config.dataSource.storageFileId;
}
```

## Validation

### On Create/Update

Before saving, validate:

1. **Config is valid** - TypeScript types ensure this
2. **FK IDs exist** - Database constraints enforce this
3. **Sync is correct** - Helper functions ensure this

### Database Constraints

Foreign keys with `ON DELETE RESTRICT` prevent:

- Deleting a font that's used by elements
- Deleting a variable that's used by elements
- Deleting a file that's used by elements

This protects data integrity!

### On Delete

Before deleting font/variable/file, check if used:

```typescript
async function deleteFontSafely(fontId: number) {
  // Check if any elements use this font
  const usedBy = await db.select().from(certificateElement).where(eq(certificateElement.fontId, fontId));

  if (usedBy.length > 0) {
    throw new Error(`Font is used by ${usedBy.length} element(s)`);
  }

  // Safe to delete
  return await db.delete(font).where(eq(font.id, fontId));
}
```

Or rely on database `RESTRICT` to throw error.

## Common Mistakes

### ❌ Mistake 1: Forgetting to Sync

```typescript
// BAD - Only updating config, forgetting FK columns
await db.update(certificateElement).set({
  config: newConfig, // FK columns not updated!
});
```

**Fix**: Always re-extract FKs when config changes.

### ❌ Mistake 2: Wrong FK for Element Type

```typescript
// BAD - Setting templateVariableId for COUNTRY element
const element: CountryElementConfig = { ... }
templateVariableId = 123  // COUNTRY doesn't use variables!
```

**Fix**: Follow the sync rules table above.

### ❌ Mistake 3: Not Handling Null

```typescript
// BAD - Assuming fontId always exists
const fontId = config.textProps.fontRef.fontId; // Type error if GOOGLE
```

**Fix**: Check font type before accessing fontId.

### ❌ Mistake 4: Hardcoding Instead of Extracting

```typescript
// BAD - Hardcoding instead of extracting from config
fontId = 42; // What if config has different fontId?
```

**Fix**: Always extract from config to maintain single source of truth.

## Testing

### Test Cases

1. **Create with self-hosted font** → fontId populated
2. **Create with Google font** → fontId = null
3. **Create TEXT with variable** → templateVariableId populated
4. **Create TEXT with student field** → templateVariableId = null
5. **Create IMAGE** → storageFileId populated
6. **Update config** → FKs re-extracted
7. **Partial update (no config)** → FKs unchanged
8. **Try to delete referenced font** → Error thrown

### Example Test

```typescript
test("sync fontId when using self-hosted font", async () => {
  const input: TextElementCreateInput = {
    templateId: 1,
    // ... other fields
    config: {
      type: ElementType.TEXT,
      textProps: {
        fontRef: { type: FontSource.SELF_HOSTED, fontId: 42 },
        fontSize: 16,
        color: "#000",
        overflow: ElementOverflow.WRAP,
      },
      dataSource: {
        type: TextDataSourceType.STATIC,
        value: "Test",
      },
    },
  };

  const element = await createElement(input);

  expect(element.fontId).toBe(42); // ✓ Synced correctly
  expect(element.config.textProps.fontRef.fontId).toBe(42); // ✓ In config too
});
```

## Summary

**Golden Rule**: Config is source of truth, columns mirror it.

**On Every Create/Update**:

1. Save complete config to JSONB
2. Extract FK IDs using helper functions
3. Populate FK columns
4. Let database validate references exist

**Benefits**:

- Data integrity guaranteed
- Can't orphan elements
- Can use Drizzle relations
- Can query by FK without parsing JSONB

**Remember**: Application layer responsibility - database only validates!
