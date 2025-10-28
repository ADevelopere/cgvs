# Data Sources

How elements pull data from various sources to display on certificates.

## Overview

Data sources determine where an element gets its content from. Each element type supports different data sources based on its purpose.

## Data Source Types by Element

| Element | Student | Certificate | Template Variable | Static | Storage |
|---------|---------|-------------|-------------------|--------|---------|
| TEXT | ✓ (name, email) | ✓ (code) | ✓ (text, select) | ✓ | - |
| DATE | ✓ (DOB) | ✓ (release) | ✓ (date var) | ✓ | - |
| NUMBER | - | - | ✓ (number var) | - | - |
| COUNTRY | ✓ (nationality) | - | - | - | - |
| GENDER | ✓ (gender) | - | - | - | - |
| IMAGE | - | - | - | - | ✓ |
| QR_CODE | - | ✓ (implicit) | - | - | - |

## Student Data Sources

Pull data from the student record receiving the certificate.

### Student Text Fields
```typescript
enum StudentTextField {
  STUDENT_NAME = "STUDENT_NAME",
  STUDENT_EMAIL = "STUDENT_EMAIL",
}
```

**Used by**: TEXT

**Example**:
```typescript
dataSource: {
  type: TextDataSourceType.STUDENT_TEXT_FIELD,
  field: StudentTextField.STUDENT_NAME
}
```

### Student Date Fields
```typescript
enum StudentDateField {
  DATE_OF_BIRTH = "DATE_OF_BIRTH",
}
```

**Used by**: DATE

**Example**:
```typescript
dataSource: {
  type: DateDataSourceType.STUDENT_DATE_FIELD,
  field: StudentDateField.DATE_OF_BIRTH
}
```

### Student Nationality
```typescript
dataSource: {
  type: CountryDataSourceType.STUDENT_NATIONALITY
}
```

**Used by**: COUNTRY

**Source**: `student.nationality` (country code)
**Rendering**: Uses `TemplateConfig.locale` to map code → name/nationality

### Student Gender
```typescript
dataSource: {
  type: GenderDataSourceType.STUDENT_GENDER
}
```

**Used by**: GENDER

**Source**: `student.gender` (enum)
**Rendering**: Uses `TemplateConfig.locale` for localized text

---

## Certificate Data Sources

Pull data from the certificate itself.

### Certificate Text Fields
```typescript
enum CertificateTextField {
  VERIFICATION_CODE = "VERIFICATION_CODE",
}
```

**Used by**: TEXT

**Example**:
```typescript
dataSource: {
  type: TextDataSourceType.CERTIFICATE_TEXT_FIELD,
  field: CertificateTextField.VERIFICATION_CODE
}
```

### Certificate Date Fields
```typescript
enum CertificateDateField {
  RELEASE_DATE = "RELEASE_DATE",
}
```

**Used by**: DATE

**Example**:
```typescript
dataSource: {
  type: DateDataSourceType.CERTIFICATE_DATE_FIELD,
  field: CertificateDateField.RELEASE_DATE
}
```

### Certificate Verification (QR Code)
```typescript
enum QRCodeDataSourceType {
  VERIFICATION_URL = "VERIFICATION_URL",    // Full URL
  VERIFICATION_CODE = "VERIFICATION_CODE",  // Just code
}
```

**Used by**: QR_CODE

**Example**:
```typescript
dataSource: {
  type: QRCodeDataSourceType.VERIFICATION_URL
}
```

**Rendering**:
- `VERIFICATION_URL` → Generates full URL to verification page
- `VERIFICATION_CODE` → Encodes just the verification code

---

## Template Variable Data Sources

Pull data from custom variables defined on the template.

### Text Variables
```typescript
dataSource: {
  type: TextDataSourceType.TEMPLATE_TEXT_VARIABLE,
  variableId: 123
}
```

**Used by**: TEXT

**Purpose**: Custom text fields (course name, instructor name, etc.)

**FK Column**: `templateVariableId`

### Select Variables
```typescript
dataSource: {
  type: TextDataSourceType.TEMPLATE_SELECT_VARIABLE,
  variableId: 456
}
```

**Used by**: TEXT

**Purpose**: Dropdown selections (department, specialization, etc.)

**FK Column**: `templateVariableId`

### Date Variables
```typescript
dataSource: {
  type: DateDataSourceType.TEMPLATE_DATE_VARIABLE,
  variableId: 789
}
```

**Used by**: DATE

**Purpose**: Custom dates (course start, graduation date, etc.)

**FK Column**: `templateVariableId`

### Number Variables
```typescript
dataSource: {
  type: NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE,
  variableId: 101
}
```

**Used by**: NUMBER

**Purpose**: Scores, GPAs, grades with breakpoint mapping

**FK Column**: `templateVariableId` (always populated)

---

## Static Data Sources

Hardcoded values in the element configuration.

### Static Text
```typescript
dataSource: {
  type: TextDataSourceType.STATIC,
  value: "Certificate of Achievement"
}
```

**Used by**: TEXT

**Purpose**: Labels, titles, fixed text

### Static Date
```typescript
dataSource: {
  type: DateDataSourceType.STATIC,
  value: "2025-01-01"
}
```

**Used by**: DATE

**Purpose**: Fixed dates, rarely used (usually use certificate release date)

---

## Storage Data Sources

Pull files from the storage system.

### Storage File (Image)
```typescript
dataSource: {
  type: ImageDataSourceType.STORAGE_FILE,
  storageFileId: 555
}
```

**Used by**: IMAGE

**Purpose**: Static images (logos, decorations)

**FK Column**: `storageFileId` (always populated)

---

## Data Source Patterns

### Discriminated Unions

All data sources use TypeScript discriminated unions:

```typescript
type TextDataSource = 
  | { type: TextDataSourceType.STATIC; value: string }
  | { type: TextDataSourceType.STUDENT_TEXT_FIELD; field: StudentTextField }
  | ...
```

**Benefits**:
- Type-safe narrowing
- Exhaustive checking
- Clear intent

### Input vs Runtime

**Runtime types** (for JSONB storage):
```typescript
type TextDataSource = { type: ..., value: string }
```

**Input types** (for GraphQL mutations):
```typescript
type TextDataSourceInput = { type: ..., value: string }
```

Usually identical, but separate for clarity and future flexibility.

---

## Adding New Data Sources

### For Existing Element Type

1. Add enum value:
```typescript
enum TextDataSourceType {
  // ... existing
  NEW_SOURCE = "NEW_SOURCE",
}
```

2. Add to discriminated union:
```typescript
type TextDataSource = 
  | ... existing
  | { type: TextDataSourceType.NEW_SOURCE; newField: string }
```

3. Add input variant:
```typescript
type TextDataSourceInput = 
  | ... existing
  | { type: TextDataSourceType.NEW_SOURCE; newField: string }
```

4. Update application layer to handle it

5. TypeScript ensures exhaustiveness!

### For New Element Type

See [Type Organization](./type-organization.md) for creating new element files with data sources.

---

## Best Practices

### 1. Explicit Data Sources
Every element has an explicit `dataSource` field. Even for simple cases (GENDER, COUNTRY), we define the source explicitly for:
- Consistency
- Future extensibility
- Clear documentation

### 2. Type Safety
Always use enums and discriminated unions - never magic strings:
```typescript
// ✅ Good
dataSource: {
  type: TextDataSourceType.STUDENT_TEXT_FIELD,
  field: StudentTextField.STUDENT_NAME
}

// ❌ Bad
dataSource: {
  type: "student_text",
  field: "name"
}
```

### 3. FK Synchronization
When data source includes an ID, ensure it's synced to FK column:
- `variableId` → `templateVariableId` column
- `storageFileId` → `storageFileId` column
- `fontId` → `fontId` column

See [Config-Column Sync](./config-column-sync.md) for details.

