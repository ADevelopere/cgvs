# Schema Reference

Complete database schema reference for certificate elements.

## Table: certificate_element

```sql
CREATE TABLE certificate_element (
  -- Primary Key
  id                    SERIAL PRIMARY KEY,

  -- Base Properties
  name                  VARCHAR(255) NOT NULL,
  description           TEXT NOT NULL,

  -- Template Relationship
  template_id           INTEGER NOT NULL,

  -- Layout Properties
  position_x            INTEGER NOT NULL,
  position_y            INTEGER NOT NULL,
  width                 INTEGER NOT NULL,
  height                INTEGER NOT NULL,
  alignment             element_alignment NOT NULL,
  render_order          INTEGER NOT NULL DEFAULT 0,

  -- Element Type & Config
  type                  element_type NOT NULL,
  config                JSONB NOT NULL,  -- Typed as ElementConfig

  -- Foreign Key Columns (mirrored from config)
  font_id               INTEGER REFERENCES font(id) ON DELETE RESTRICT,
  template_variable_id  INTEGER REFERENCES template_variable_base(id) ON DELETE RESTRICT,
  storage_file_id       BIGINT REFERENCES storage_files(id) ON DELETE RESTRICT,

  -- Timestamps
  created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

## Columns

### id

- **Type**: `SERIAL` (auto-increment integer)
- **Purpose**: Primary key

### name

- **Type**: `VARCHAR(255)`
- **Purpose**: Human-readable element name
- **Example**: "Student Name", "University Logo"

### description

- **Type**: `TEXT`
- **Purpose**: Element description for documentation
- **Example**: "Displays the student's full name in large font"

### template_id

- **Type**: `INTEGER`
- **Purpose**: Foreign key to templates table
- **Constraint**: `NOT NULL`
- **Relation**: Many elements belong to one template

### Layout Properties

#### position_x, position_y

- **Type**: `INTEGER`
- **Purpose**: Element position in pixels (top-left corner)
- **Constraint**: `NOT NULL`

#### width, height

- **Type**: `INTEGER`
- **Purpose**: Element dimensions in pixels
- **Constraint**: `NOT NULL`

#### alignment

- **Type**: `element_alignment` (enum)
- **Values**: `START`, `END`, `TOP`, `BOTTOM`, `CENTER`, `BASELINE`
- **Purpose**: Content alignment within element box

#### render_order

- **Type**: `INTEGER`
- **Default**: `0`
- **Purpose**: Rendering order (lower values render first, like z-index)

### type

- **Type**: `element_type` (enum)
- **Values**: `TEXT`, `NUMBER`, `DATE`, `IMAGE`, `GENDER`, `COUNTRY`, `QR_CODE`
- **Purpose**: Discriminator for element type

### config

- **Type**: `JSONB`
- **TypeScript Type**: `ElementConfig` (discriminated union)
- **Purpose**: Complete element configuration (source of truth)
- **Example**:

```json
{
  "type": "TEXT",
  "textProps": {
    "fontRef": { "type": "SELF_HOSTED", "fontId": 42 },
    "fontSize": 24,
    "color": "#000000",
    "overflow": "WRAP"
  },
  "dataSource": {
    "type": "STUDENT_TEXT_FIELD",
    "field": "STUDENT_NAME"
  }
}
```

### Foreign Key Columns

These columns mirror IDs from config for database integrity. See [Config-Column Sync](./config-column-sync.md).

#### font_id

- **Type**: `INTEGER`
- **References**: `font(id)`
- **On Delete**: `RESTRICT`
- **Nullable**: Yes
- **Populated When**: `config.textProps.fontRef.type === 'SELF_HOSTED'`
- **Elements**: TEXT, DATE, NUMBER, COUNTRY, GENDER

#### template_variable_id

- **Type**: `INTEGER`
- **References**: `template_variable_base(id)`
- **On Delete**: `RESTRICT`
- **Nullable**: Yes
- **Populated When**: dataSource uses template variable
- **Elements**: TEXT, DATE, NUMBER

#### storage_file_id

- **Type**: `BIGINT`
- **References**: `storage_files(id)`
- **On Delete**: `RESTRICT`
- **Nullable**: Yes
- **Populated When**: `type === 'IMAGE'`
- **Elements**: IMAGE only

### Timestamps

#### created_at

- **Type**: `TIMESTAMP WITH TIME ZONE`
- **Default**: `NOW()`

#### updated_at

- **Type**: `TIMESTAMP WITH TIME ZONE`
- **Default**: `NOW()`
- **Update**: Automatically updated on row change

## Enums

### element_type

```typescript
enum ElementType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DATE = "DATE",
  IMAGE = "IMAGE",
  GENDER = "GENDER",
  COUNTRY = "COUNTRY",
  QR_CODE = "QR_CODE",
}
```

### element_alignment

```typescript
enum ElementAlignment {
  START = "START", // Left for LTR, right for RTL
  END = "END", // Right for LTR, left for RTL
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  CENTER = "CENTER",
  BASELINE = "BASELINE",
}
```

## Relations

### Drizzle Relations

```typescript
// certificateElement relations
certificateElement: {
  template: one → templates
  font: one → font (nullable)
  templateVariable: one → template_variable_base (nullable)
  storageFile: one → storage_files (nullable)
}

// Inverse relations
templates: {
  elements: many ← certificateElement
}

font: {
  elements: many ← certificateElement
}

template_variable_base: {
  elements: many ← certificateElement
}

storage_files: {
  certificateElements: many ← certificateElement
}
```

### Relationship Diagram

```
┌─────────────┐
│  templates  │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼───────────────────┐
│  certificate_element     │
├──────────────────────────┤
│ id                       │
│ template_id (FK)         │◄────┐
│ type                     │     │
│ config (JSONB)           │     │ 1
│                          │     │
│ font_id (FK) ───────────┼─────┤
│ template_variable_id (FK)│     │ N
│ storage_file_id (FK) ────┼───┐ │
└──────────────────────────┘   │ │
       │                       │ │
       │ N                     │ │
       ▼                       │ │
┌──────────────┐      ┌────────▼─▼────────┐
│    font      │      │ template_variable │
└──────────────┘      │      _base        │
                      └───────────────────┘
       ▲
       │ N
       │
       │ 1
┌──────┴──────────┐
│  storage_files  │
└─────────────────┘
```

## Indexes

### Recommended Indexes

```sql
-- Template elements (common query)
CREATE INDEX idx_certificate_element_template_id
ON certificate_element(template_id);

-- Rendering order
CREATE INDEX idx_certificate_element_template_render
ON certificate_element(template_id, render_order);

-- Font lookup
CREATE INDEX idx_certificate_element_font_id
ON certificate_element(font_id)
WHERE font_id IS NOT NULL;

-- Variable lookup
CREATE INDEX idx_certificate_element_variable_id
ON certificate_element(template_variable_id)
WHERE template_variable_id IS NOT NULL;

-- JSONB config queries (if needed)
CREATE INDEX idx_certificate_element_config
ON certificate_element USING GIN (config);
```

## Constraints

### Primary Key

```sql
PRIMARY KEY (id)
```

### Foreign Keys

```sql
FOREIGN KEY (template_id) REFERENCES templates(id)
FOREIGN KEY (font_id) REFERENCES font(id) ON DELETE RESTRICT
FOREIGN KEY (template_variable_id) REFERENCES template_variable_base(id) ON DELETE RESTRICT
FOREIGN KEY (storage_file_id) REFERENCES storage_files(id) ON DELETE RESTRICT
```

### Check Constraints (Potential)

Could add for additional validation:

```sql
-- Ensure config.type matches type column
ALTER TABLE certificate_element
ADD CONSTRAINT check_config_type_match
CHECK (config->>'type' = type::text);

-- Ensure positive dimensions
ALTER TABLE certificate_element
ADD CONSTRAINT check_positive_dimensions
CHECK (width > 0 AND height > 0);

-- Ensure valid render order
ALTER TABLE certificate_element
ADD CONSTRAINT check_render_order
CHECK (render_order >= 0);
```

## Queries

### Common Queries

#### Get All Elements for Template

```sql
SELECT * FROM certificate_element
WHERE template_id = $1
ORDER BY render_order ASC;
```

#### Get Elements Using Font

```sql
SELECT * FROM certificate_element
WHERE font_id = $1;
```

#### Get Elements Using Variable

```sql
SELECT * FROM certificate_element
WHERE template_variable_id = $1;
```

#### Get Text Elements

```sql
SELECT * FROM certificate_element
WHERE type = 'TEXT';
```

#### Get Elements with Config Filter

```sql
SELECT * FROM certificate_element
WHERE config->>'type' = 'TEXT'
  AND config->'dataSource'->>'type' = 'STUDENT_TEXT_FIELD';
```

### With Drizzle

```typescript
// Get template elements
const elements = await db
  .select()
  .from(certificateElement)
  .where(eq(certificateElement.templateId, templateId))
  .orderBy(asc(certificateElement.zIndex));

// With font relation
const elementsWithFont = await db
  .select()
  .from(certificateElement)
  .leftJoin(font, eq(certificateElement.fontId, font.id))
  .where(eq(certificateElement.templateId, templateId));

// Check font usage
const fontUsage = await db
  .select({ count: count() })
  .from(certificateElement)
  .where(eq(certificateElement.fontId, fontId));
```

## Data Types

### TypeScript → Database Mapping

| TypeScript      | Database                   | Example                  |
| --------------- | -------------------------- | ------------------------ |
| `number`        | `INTEGER`                  | `42`                     |
| `string`        | `VARCHAR/TEXT`             | `"Hello"`                |
| `ElementType`   | `element_type` (enum)      | `'TEXT'`                 |
| `ElementConfig` | `JSONB`                    | `{"type":"TEXT",...}`    |
| `Date`          | `TIMESTAMP WITH TIME ZONE` | `2025-01-01 00:00:00+00` |
| `bigint`        | `BIGINT`                   | `9007199254740991`       |

## Performance Considerations

### JSONB Indexing

- GIN index on `config` for complex queries
- Usually not needed - FK columns handle most queries

### Query Patterns

- Filter by `template_id` + `render_order` (most common)
- Filter by FK columns (font, variable, file)
- Avoid complex JSONB queries when possible

### FK Column Benefits

- Direct integer comparison (faster than JSONB)
- Database validates references
- Can use JOIN efficiently
- Proper index usage

## Migration

See `server/drizzle/` for migration files.

Example migration to add FK columns:

```sql
ALTER TABLE certificate_element
ADD COLUMN font_id INTEGER REFERENCES font(id) ON DELETE RESTRICT;

ALTER TABLE certificate_element
ADD COLUMN template_variable_id INTEGER REFERENCES template_variable_base(id) ON DELETE RESTRICT;

ALTER TABLE certificate_element
ADD COLUMN storage_file_id BIGINT REFERENCES storage_files(id) ON DELETE RESTRICT;
```
