<!-- 0658f254-ddda-4a52-a3d3-c59ffac77392 6ac9bb08-18ac-4267-8c5f-3cd95316aa9e -->
# Repository Layer Refactoring - Table-Per-Type Architecture

## Overview

Refactor the repository layer to work with the new normalized database structure. Create a new TextProps repository for the `element_text_props` table, and update all element repositories to handle table-per-type architecture with flattened inputs (no `config` field).

## Key Requirements

### **What Changed:**

1. ❌ **NO config field** - all fields are flattened
2. ❌ **NO config merging** - direct field-level updates
3. ❌ **NO FK extraction utilities** - inline field access
4. ✅ **Table-per-type** - insert/update across multiple tables
5. ✅ **TextProps repository** - dedicated CRUD for `element_text_props`
6. ✅ **Deep partial semantics** - `null` = update to null, `undefined` = preserve
7. ✅ **Proper joins** - load data from multiple tables

---

## 1. New Repository: TextProps Repository

### File: `server/db/repo/element/textProps.element.repository.ts`

Handle CRUD operations for the `element_text_props` table.

```typescript
export namespace TextPropsRepository {
  /**
   * Create new TextProps row
   * Converts TextPropsCreateInput → ElementTextPropsInsert
   * Always creates new row (no deduplication)
   */
  export const create = async (
    textProps: TextPropsCreateInput
  ): Promise<ElementTextPropsEntity> => {
    // Extract fontId from fontRef
    const fontId = textProps.fontRef.type === FontSource.SELF_HOSTED 
      ? textProps.fontRef.fontId 
      : null;
    
    const googleFontIdentifier = textProps.fontRef.type === FontSource.GOOGLE 
      ? textProps.fontRef.identifier 
      : null;
    
    // Insert
    const [created] = await db.insert(elementTextProps).values({
      fontSource: textProps.fontRef.type,
      fontId,
      googleFontIdentifier,
      fontSize: textProps.fontSize,
      color: textProps.color,
      overflow: textProps.overflow,
    }).returning();
    
    return created;
  };
  
  /**
   * Update TextProps row
   * Supports deep partial - null updates to null, undefined preserves
   */
  export const update = async (
    id: number,
    textProps: TextPropsUpdateInput
  ): Promise<ElementTextPropsEntity> => {
    const existing = await findByIdOrThrow(id);
    
    // Build update object
    const updates: Partial<ElementTextPropsInsert> = {};
    
    // Handle fontRef update
    if (textProps.fontRef !== undefined) {
      if (textProps.fontRef === null) {
        // Should not happen - fontRef is required
        throw new Error("fontRef cannot be null");
      }
      updates.fontSource = textProps.fontRef.type;
      updates.fontId = textProps.fontRef.type === FontSource.SELF_HOSTED 
        ? textProps.fontRef.fontId 
        : null;
      updates.googleFontIdentifier = textProps.fontRef.type === FontSource.GOOGLE 
        ? textProps.fontRef.identifier 
        : null;
    }
    
    // Handle other fields (fontSize, color, overflow)
    if (textProps.fontSize !== undefined) {
      updates.fontSize = textProps.fontSize;
    }
    if (textProps.color !== undefined) {
      updates.color = textProps.color; // null or string
    }
    if (textProps.overflow !== undefined) {
      updates.overflow = textProps.overflow;
    }
    
    // Update
    const [updated] = await db
      .update(elementTextProps)
      .set(updates)
      .where(eq(elementTextProps.id, id))
      .returning();
    
    return updated;
  };
  
  /**
   * Convert DB entity to TextProps output type
   * Reconstructs FontReference from fontSource + fontId/googleFontIdentifier
   */
  export const toTextProps = (entity: ElementTextPropsEntity): TextProps => {
    const fontRef: FontReference = entity.fontSource === FontSource.SELF_HOSTED
      ? { type: FontSource.SELF_HOSTED, fontId: entity.fontId! }
      : { type: FontSource.GOOGLE, identifier: entity.googleFontIdentifier! };
    
    return {
      fontRef,
      fontSize: entity.fontSize,
      color: entity.color,
      overflow: entity.overflow,
    };
  };
  
  // Standard CRUD helpers
  export const findById = async (id: number): Promise<ElementTextPropsEntity | null>;
  export const findByIdOrThrow = async (id: number): Promise<ElementTextPropsEntity>;
  export const deleteById = async (id: number): Promise<void>;
}
```

---

## 2. Update Element Repository (Base)

### File: `server/db/repo/element/element.repository.ts`

Remove FK extraction helpers, update queries to use joins.

#### **Changes:**

1. **DELETE** FK extraction utilities:

                                                - `extractFontIdFromConfigTextProps`
                                                - `extractTemplateVariableIdFromConfigDataSource`
                                                - `extractStorageFileIdFromConfigTextProps`

2. **UPDATE** query methods to use proper joins for new architecture:

                                                - Will need to join with type-specific tables
                                                - Will need to join with `element_text_props` where applicable

3. **KEEP** validation helpers:

                                                - `validateTemplateId`
                                                - `validateFontId`
                                                - `validateTemplateVariableId`
                                                - `validateStorageFileId`

---

## 3. Update TEXT Element Repository

### File: `server/db/repo/element/text.element.repository.ts`

Completely rewrite to work with `certificate_element` + `text_element` + `element_text_props` tables.

#### **Pattern for CREATE:**

```typescript
export const create = async (
  input: TextElementCreateInput
): Promise<TextElementOutput> => {
  // 1. Validate input
  await TextElementUtils.validateCreateInput(input);
  
  // 2. Create TextProps
  const textPropsEntity = await TextPropsRepository.create(input.textProps);
  
  // 3. Extract variable_id from dataSource (inline)
  const variableId = extractVariableIdFromDataSource(input.dataSource);
  
  // 4. Insert into certificate_element (base table)
  const [baseElement] = await db.insert(certificateElement).values({
    name: input.name,
    description: input.description,
    templateId: input.templateId,
    positionX: input.positionX,
    positionY: input.positionY,
    width: input.width,
    height: input.height,
    alignment: input.alignment,
    renderOrder: input.renderOrder,
    type: ElementType.TEXT,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  
  // 5. Insert into text_element (type-specific table)
  await db.insert(textElement).values({
    elementId: baseElement.id,
    textPropsId: textPropsEntity.id,
    dataSource: input.dataSource, // JSONB
    variableId, // mirrored FK
  });
  
  // 6. Load and return full output
  return loadById(baseElement.id);
};
```

#### **Pattern for UPDATE:**

```typescript
export const update = async (
  input: TextElementUpdateInput
): Promise<TextElementOutput> => {
  // 1. Get existing element
  const existing = await loadByIdOrThrow(input.id);
  
  // 2. Validate type and input
  if (existing.type !== ElementType.TEXT) {
    throw new Error(`Element ${input.id} is ${existing.type}, not TEXT`);
  }
  await TextElementUtils.validateUpdateInput(input, existing);
  
  // 3. Build base updates (only provided fields)
  const baseUpdates: Partial<CertificateElementInsert> = {};
  if (input.name !== undefined) baseUpdates.name = input.name;
  if (input.description !== undefined) baseUpdates.description = input.description;
  // ... all base fields
  
  // 4. Update certificate_element if base fields changed
  if (Object.keys(baseUpdates).length > 0) {
    baseUpdates.updatedAt = new Date();
    await db.update(certificateElement)
      .set(baseUpdates)
      .where(eq(certificateElement.id, input.id));
  }
  
  // 5. Build text_element updates
  const textUpdates: Partial<TextElementInsert> = {};
  
  // 5a. Handle textProps update
  if (input.textProps !== undefined) {
    if (input.textProps === null) {
      // Should not happen - textProps required
      throw new Error("textProps cannot be null");
    }
    // Update existing TextProps row
    await TextPropsRepository.update(existing.textPropsId, input.textProps);
  }
  
  // 5b. Handle dataSource update
  if (input.dataSource !== undefined) {
    if (input.dataSource === null) {
      throw new Error("dataSource cannot be null");
    }
    textUpdates.dataSource = input.dataSource;
    textUpdates.variableId = extractVariableIdFromDataSource(input.dataSource);
  }
  
  // 6. Update text_element if type fields changed
  if (Object.keys(textUpdates).length > 0) {
    await db.update(textElement)
      .set(textUpdates)
      .where(eq(textElement.elementId, input.id));
  }
  
  // 7. Load and return updated element
  return loadByIdOrThrow(input.id);
};
```

#### **Pattern for LOAD:**

```typescript
export const loadById = async (id: number): Promise<TextElementOutput | null> => {
  // Join all three tables
  const result = await db
    .select()
    .from(certificateElement)
    .innerJoin(textElement, eq(textElement.elementId, certificateElement.id))
    .innerJoin(elementTextProps, eq(elementTextProps.id, textElement.textPropsId))
    .where(eq(certificateElement.id, id))
    .limit(1);
  
  if (result.length === 0) return null;
  
  const { certificate_element, text_element, element_text_props } = result[0];
  
  // Reconstruct output
  return {
    ...certificate_element,
    textProps: TextPropsRepository.toTextProps(element_text_props),
    dataSource: text_element.dataSource,
    variableId: text_element.variableId,
  };
};
```

#### **Inline Helper:**

```typescript
/**
 * Extract variable_id from text data source (inline in repository)
 * Maps to correct TypeScript field name based on type
 */
const extractVariableIdFromDataSource = (
  dataSource: TextDataSource
): number | null => {
  switch (dataSource.type) {
    case TextDataSourceType.TEMPLATE_TEXT_VARIABLE:
    case TextDataSourceType.TEMPLATE_SELECT_VARIABLE:
      return dataSource.variableId;
    default:
      return null;
  }
};
```

---

## 4. Update DATE Element Repository

Similar pattern to TEXT, with date-specific fields.

#### **Key Differences:**

- Same TextProps handling
- Additional fields: `calendarType`, `offsetDays`, `format`, `transformation`
- Similar variable_id extraction from `DateDataSource`
```typescript
export const create = async (input: DateElementCreateInput): Promise<DateElementOutput> => {
  // 1. Validate
  await DateElementUtils.validateCreateInput(input);
  
  // 2. Create TextProps
  const textPropsEntity = await TextPropsRepository.create(input.textProps);
  
  // 3. Extract variable_id
  const variableId = input.dataSource.type === DateDataSourceType.TEMPLATE_DATE_VARIABLE
    ? input.dataSource.variableId
    : null;
  
  // 4. Insert base element
  const [baseElement] = await db.insert(certificateElement).values({
    ...baseFields(input),
    type: ElementType.DATE,
  }).returning();
  
  // 5. Insert date_element
  await db.insert(dateElement).values({
    elementId: baseElement.id,
    textPropsId: textPropsEntity.id,
    calendarType: input.calendarType,
    offsetDays: input.offsetDays,
    format: input.format,
    transformation: input.transformation,
    dataSource: input.dataSource,
    variableId,
  });
  
  // 6. Load and return
  return loadByIdOrThrow(baseElement.id);
};
```


---

## 5. Update NUMBER Element Repository

Similar to TEXT/DATE, with mapping field.

#### **Key Differences:**

- Has `mapping` field (Record<string, string>)
- NUMBER always has variable (TEMPLATE_NUMBER_VARIABLE)
```typescript
const extractVariableIdFromDataSource = (
  dataSource: NumberDataSource
): number => {
  // NUMBER always has a variable
  return dataSource.variableId;
};
```


---

## 6. Update COUNTRY Element Repository

Uses TextProps, has `representation` field, fixed data source.

#### **Key Differences:**

- No variable_id (COUNTRY uses STUDENT_NATIONALITY - no variable)
- Has `representation` field
- Simpler - no data source variation
```typescript
export const create = async (input: CountryElementCreateInput): Promise<CountryElementOutput> => {
  // 1. Validate
  await CountryElementUtils.validateCreateInput(input);
  
  // 2. Create TextProps
  const textPropsEntity = await TextPropsRepository.create(input.textProps);
  
  // 3. Insert base element
  const [baseElement] = await db.insert(certificateElement).values({
    ...baseFields(input),
    type: ElementType.COUNTRY,
  }).returning();
  
  // 4. Insert country_element
  await db.insert(countryElement).values({
    elementId: baseElement.id,
    textPropsId: textPropsEntity.id,
    representation: input.representation,
    // No dataSource, no variableId
  });
  
  // 5. Load and return
  return loadByIdOrThrow(baseElement.id);
};
```


---

## 7. Update GENDER Element Repository

Simplest - just TextProps, no other fields.

#### **Key Differences:**

- Only has TextProps (no other type-specific fields)
- Fixed data source (STUDENT_GENDER)
```typescript
export const create = async (input: GenderElementCreateInput): Promise<GenderElementOutput> => {
  // 1. Validate
  await GenderElementUtils.validateCreateInput(input);
  
  // 2. Create TextProps
  const textPropsEntity = await TextPropsRepository.create(input.textProps);
  
  // 3. Insert base element
  const [baseElement] = await db.insert(certificateElement).values({
    ...baseFields(input),
    type: ElementType.GENDER,
  }).returning();
  
  // 4. Insert gender_element
  await db.insert(genderElement).values({
    elementId: baseElement.id,
    textPropsId: textPropsEntity.id,
    // No other fields
  });
  
  // 5. Load and return
  return loadByIdOrThrow(baseElement.id);
};
```


---

## 8. Update IMAGE Element Repository

No TextProps, has `fit` and `dataSource` (storageFileId).

#### **Key Differences:**

- NO TextProps
- Has `fit` field (ElementImageFit)
- Has `storageFileId` mirrored from dataSource
```typescript
const extractStorageFileIdFromDataSource = (
  dataSource: ImageDataSource
): number => {
  // IMAGE always has storageFile
  return dataSource.storageFileId;
};

export const create = async (input: ImageElementCreateInput): Promise<ImageElementOutput> => {
  // 1. Validate
  await ImageElementUtils.validateCreateInput(input);
  
  // 2. Extract storageFileId
  const storageFileId = extractStorageFileIdFromDataSource(input.dataSource);
  
  // 3. Insert base element
  const [baseElement] = await db.insert(certificateElement).values({
    ...baseFields(input),
    type: ElementType.IMAGE,
  }).returning();
  
  // 4. Insert image_element
  await db.insert(imageElement).values({
    elementId: baseElement.id,
    fit: input.fit,
    dataSource: input.dataSource,
    storageFileId, // mirrored FK
  });
  
  // 5. Load and return
  return loadByIdOrThrow(baseElement.id);
};
```


---

## 9. Update QR_CODE Element Repository

No TextProps, has color fields.

#### **Key Differences:**

- NO TextProps
- Has `errorCorrection`, `foregroundColor`, `backgroundColor`
- Data source is simple (no FK to mirror)
```typescript
export const create = async (input: QRCodeElementCreateInput): Promise<QRCodeElementOutput> => {
  // 1. Validate
  await QRCodeElementUtils.validateCreateInput(input);
  
  // 2. Insert base element
  const [baseElement] = await db.insert(certificateElement).values({
    ...baseFields(input),
    type: ElementType.QR_CODE,
  }).returning();
  
  // 3. Insert qrcode_element
  await db.insert(qrCodeElement).values({
    elementId: baseElement.id,
    errorCorrection: input.errorCorrection,
    foregroundColor: input.foregroundColor,
    backgroundColor: input.backgroundColor,
    // No dataSource, no FK mirroring
  });
  
  // 5. Load and return
  return loadByIdOrThrow(baseElement.id);
};
```


---

## Deep Partial Update Semantics

**CRITICAL:** All update inputs support deep partial with these semantics:

```typescript
// null = update field to null
input.color = null; // Sets color to NULL in DB

// undefined = preserve existing value (don't update)
input.color = undefined; // Keeps existing color value

// value = update to value
input.color = "#FF0000"; // Sets color to "#FF0000"
```

### Implementation Pattern:

```typescript
const updates: Partial<InsertType> = {};

// For each field:
if (input.field !== undefined) {
  updates.field = input.field; // Can be null or a value
}

// Only update if there are changes
if (Object.keys(updates).length > 0) {
  await db.update(table).set(updates).where(...);
}
```

---

## Files to Create/Modify

### **New Files (1):**

1. `server/db/repo/element/textProps.element.repository.ts` - TextProps CRUD

### **Modified Files (9):**

2. `server/db/repo/element/element.repository.ts` - Remove FK extraction, update queries
3. `server/db/repo/element/text.element.repository.ts` - Complete rewrite
4. `server/db/repo/element/date.element.repository.ts` - Complete rewrite
5. `server/db/repo/element/number.element.repository.ts` - Complete rewrite
6. `server/db/repo/element/country.element.repository.ts` - Complete rewrite
7. `server/db/repo/element/gender.element.repository.ts` - Complete rewrite
8. `server/db/repo/element/image.element.repository.ts` - Complete rewrite
9. `server/db/repo/element/qrcode.element.repository.ts` - Complete rewrite
10. `server/db/repo/element/index.ts` - Export TextPropsRepository

---

## Key Patterns Summary

### **CREATE Pattern:**

1. Validate input
2. Create TextProps (if applicable) → get `textPropsId`
3. Extract mirrored FK (variableId/storageFileId) from dataSource inline
4. Insert into `certificate_element` → get `elementId`
5. Insert into type-specific table with `elementId`, `textPropsId`, fields, dataSource, mirrored FKs
6. Load full element with joins and return

### **UPDATE Pattern:**

1. Load existing element
2. Validate type and input
3. Build base updates (only defined fields)
4. Update `certificate_element` if base fields changed
5. Handle TextProps update (if provided) - update existing row
6. Build type-specific updates (only defined fields)
7. Extract new mirrored FK if dataSource changed
8. Update type-specific table if fields changed
9. Load and return updated element

### **LOAD Pattern:**

1. Join `certificate_element` + type-specific table
2. Join `element_text_props` (if applicable)
3. Reconstruct output type with:

                                                - Base fields from `certificate_element`
                                                - Type-specific fields from type table
                                                - `textProps` from joined `element_text_props` (reconstructed)
                                                - `dataSource` from type table (JSONB)
                                                - Mirrored FKs from type table

### **DELETE Pattern:**

1. Validate element exists and is correct type
2. Delete from type-specific table (CASCADE will delete base)
3. TextProps row will remain (not deleted - may be shared, though currently not deduplicated)

---

## Implementation Order

1. **Create TextPropsRepository** - foundation for 5 element types
2. **Update TEXT repository** - most complex, serves as template
3. **Update DATE repository** - similar to TEXT
4. **Update NUMBER repository** - similar pattern
5. **Update COUNTRY & GENDER** - simpler (fixed data sources)
6. **Update IMAGE repository** - different (no TextProps, has storageFile)
7. **Update QR_CODE repository** - simplest (no TextProps, no mirrored FKs)
8. **Update base ElementRepository** - remove old helpers, update shared queries

---

## Notes

- **No config merging** - field-level updates only
- **No FK extraction utilities** - inline access in each repository
- **TextProps always creates new row** - no deduplication for simplicity
- **Mirrored FKs** - `variable_id` and `storage_file_id` columns mirror JSONB for DB integrity and queries
- **Deep partial semantics** - null vs undefined must be handled carefully
- **Type safety** - Each repository returns proper `{Type}ElementOutput` type

### To-dos

- [ ] Create TextPropsRepository with create/update/load/delete operations and toTextProps mapper
- [ ] Rewrite TEXT element repository for table-per-type: create/update/load with joins and inline FK extraction
- [ ] Rewrite DATE element repository for table-per-type with date-specific fields
- [ ] Rewrite NUMBER element repository for table-per-type with mapping field
- [ ] Rewrite COUNTRY element repository for table-per-type with representation field
- [ ] Rewrite GENDER element repository for table-per-type (simplest case)
- [ ] Rewrite IMAGE element repository for table-per-type with fit and storageFileId
- [ ] Rewrite QR_CODE element repository for table-per-type with color fields
- [ ] Update ElementRepository: remove FK extraction utilities, update shared query methods