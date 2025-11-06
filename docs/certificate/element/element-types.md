# Element Types Reference

Complete reference for all 7 certificate element types.

## Overview

| Element | Purpose                 | Data Sources                           | Font Support | File:                      |
| ------- | ----------------------- | -------------------------------------- | ------------ | -------------------------- |
| TEXT    | Display text            | Student, Certificate, Variable, Static | Yes          | `text.element.types.ts`    |
| DATE    | Display dates           | Student, Certificate, Variable, Static | Yes          | `date.element.types.ts`    |
| NUMBER  | Display numbers as text | Template Variable                      | Yes          | `number.element.types.ts`  |
| COUNTRY | Display nationality     | Student Nationality                    | Yes          | `country.element.types.ts` |
| GENDER  | Display gender          | Student Gender                         | Yes          | `gender.element.types.ts`  |
| IMAGE   | Display images          | Storage File                           | No           | `image.element.types.ts`   |
| QR_CODE | Display QR codes        | Verification URL/Code                  | No           | `qrcode.element.types.ts`  |

---

## TEXT Element

**Purpose**: Display text content with various data sources

**Config**:

```typescript
interface TextElementConfig {
  type: ElementType.TEXT;
  textProps: TextProps; // Font, size, color, overflow
  dataSource: TextDataSource;
}
```

**Data Sources**:

- `STATIC` - Hardcoded text value
- `STUDENT_TEXT_FIELD` - `STUDENT_NAME` or `STUDENT_EMAIL`
- `CERTIFICATE_TEXT_FIELD` - `VERIFICATION_CODE`
- `TEMPLATE_TEXT_VARIABLE` - Custom text variable
- `TEMPLATE_SELECT_VARIABLE` - Selection variable

**Use Cases**:

- Student names
- Certificate titles
- Custom fields from template variables
- Static labels ("Certificate of Achievement")

**FK Columns**:

- `fontId` - When using self-hosted font
- `templateVariableId` - When using template variable

---

## DATE Element

**Purpose**: Display formatted dates with calendar support

**Config**:

```typescript
interface DateElementConfig {
  type: ElementType.DATE;
  textProps: TextProps;
  calendarType: CalendarType; // GREGORIAN | HIJRI
  offsetDays: number; // Add/subtract days
  format: string; // e.g., "YYYY-MM-DD"
  mapping?: Record<string, string>; // Custom month names
  dataSource: DateDataSource;
}
```

**Data Sources**:

- `STATIC` - Hardcoded date value
- `STUDENT_DATE_FIELD` - `DATE_OF_BIRTH`
- `CERTIFICATE_DATE_FIELD` - `RELEASE_DATE`
- `TEMPLATE_DATE_VARIABLE` - Custom date variable

**Calendar Types**:

- `GREGORIAN` - Standard calendar
- `HIJRI` - Islamic calendar

**Features**:

- Offset dates (e.g., +30 days from release)
- Custom formatting
- Month name localization via `mapping`

**FK Columns**:

- `fontId` - When using self-hosted font
- `templateVariableId` - When using template variable

---

## NUMBER Element

**Purpose**: Display numbers as text with breakpoint mapping

**Config**:

```typescript
interface NumberElementConfig {
  type: ElementType.NUMBER;
  textProps: TextProps;
  dataSource: NumberDataSource;
  mapping: Record<string, string>; // Breakpoint rules
}
```

**Data Source**:

- `TEMPLATE_NUMBER_VARIABLE` - Always from number variable

**Mapping Example**:

```typescript
mapping: {
  "0-59": "Fail",
  "60-79": "Pass",
  "80-89": "Good",
  "90-100": "Excellent"
}
```

**Use Cases**:

- GPA grades
- Scores with text labels
- Performance levels

**FK Columns**:

- `fontId` - When using self-hosted font
- `templateVariableId` - Always (references number variable)

---

## COUNTRY Element

**Purpose**: Display student's country/nationality

**Config**:

```typescript
interface CountryElementConfig {
  type: ElementType.COUNTRY;
  textProps: TextProps;
  representation: CountryRepresentation; // COUNTRY_NAME | NATIONALITY
  dataSource: CountryDataSource;
}
```

**Data Source**:

- `STUDENT_NATIONALITY` - Always from `student.nationality`

**Representation**:

- `COUNTRY_NAME` - "Egypt", "Saudi Arabia"
- `NATIONALITY` - "Egyptian", "Saudi"

**Localization**: Uses `TemplateConfig.locale` to map country code to localized name

**FK Columns**:

- `fontId` - When using self-hosted font

---

## GENDER Element

**Purpose**: Display student's gender

**Config**:

```typescript
interface GenderElementConfig {
  type: ElementType.GENDER;
  textProps: TextProps;
  dataSource: GenderDataSource;
}
```

**Data Source**:

- `STUDENT_GENDER` - Always from `student.gender`

**Localization**: Uses `TemplateConfig.locale` to map gender enum to text (e.g., "Male"/"Female" in Arabic/English)

**FK Columns**:

- `fontId` - When using self-hosted font

---

## IMAGE Element

**Purpose**: Display static images (logos, backgrounds, decorations)

**Config**:

```typescript
interface ImageElementConfig {
  type: ElementType.IMAGE;
  dataSource: ImageDataSource;
  fit: ElementImageFit; // COVER | CONTAIN | FILL
}
```

**Data Source**:

- `STORAGE_FILE` - Always from storage file

**Fit Modes**:

- `COVER` - Fill box, may crop
- `CONTAIN` - Fit within box, may have empty space
- `FILL` - Stretch to fill box

**Use Cases**:

- University logos
- Decorative borders
- Background patterns
- Signatures (static)

**FK Columns**:

- `storageFileId` - Always (references storage file)

---

## QR_CODE Element

**Purpose**: Display QR codes for verification

**Config**:

```typescript
interface QRCodeElementConfig {
  type: ElementType.QR_CODE;
  dataSource: QRCodeDataSource;
  errorCorrection: QRCodeErrorCorrection; // L | M | Q | H
  foregroundColor: string; // e.g., "#000000"
  backgroundColor: string; // e.g., "#FFFFFF"
}
```

**Data Sources**:

- `VERIFICATION_URL` - Full URL to verification page
- `VERIFICATION_CODE` - Just the code

**Error Correction Levels**:

- `L` - Low (~7% recovery)
- `M` - Medium (~15% recovery)
- `Q` - Quartile (~25% recovery)
- `H` - High (~30% recovery)

**Colors**: Hex color codes for customization

**FK Columns**: None

---

## Common Properties

All elements share these base properties:

```typescript
{
  id: number;
  name: string;
  description: string;
  templateId: number;
  type: ElementType;

  // Layout
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  zIndex: number; // Lower renders first

  // Config (type-specific)
  config: ElementConfig;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

## Text-Based Elements

Five elements use `TextProps` for styling:

- TEXT, DATE, NUMBER, COUNTRY, GENDER

```typescript
interface TextProps {
  fontRef: FontReference; // Google or self-hosted
  fontSize: number;
  color: string;
  overflow: ElementOverflow; // RESIZE_DOWN | TRUNCATE | ELLIPSE | WRAP
}
```

### Font Reference

```typescript
type FontReference = { type: FontSource.GOOGLE; identifier: string } | { type: FontSource.SELF_HOSTED; fontId: number };
```

**Google Fonts**: Use font identifier (e.g., "Roboto", "Cairo")
**Self-Hosted**: Reference font in database

### Overflow Handling

- `RESIZE_DOWN` - Shrink font to fit
- `TRUNCATE` - Cut off overflow
- `ELLIPSE` - Add "..." at end
- `WRAP` - Wrap to multiple lines
