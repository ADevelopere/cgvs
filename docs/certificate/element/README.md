# Certificate Elements Documentation

Complete documentation for the certificate elements system, covering architecture, implementation, and usage.

## Overview

Certificate elements are the building blocks of certificate templates. Each element represents a piece of content (text, date, image, QR code, etc.) positioned on the certificate with specific styling and data sources.

## Documentation Structure

### Core Concepts

1. **[Architecture](./architecture.md)** - Design decisions, schema structure, and why we chose typed JSONB
2. **[Type Organization](./type-organization.md)** - How types are organized across files
3. **[Element Types](./element-types.md)** - Overview of all 7 element types and their configurations
4. **[Data Sources](./data-sources.md)** - How elements pull data from students, variables, and other sources

### Implementation Details

5. **[Config-Column Sync](./config-column-sync.md)** - Critical: How JSONB config and FK columns stay synchronized
6. **[Schema Reference](./schema-reference.md)** - Database schema details and foreign key relationships

## Quick Start

### Element Type Summary

| Type        | Purpose                     | Key Features                                     |
| ----------- | --------------------------- | ------------------------------------------------ |
| **TEXT**    | Display text content        | Multiple data sources, text styling              |
| **DATE**    | Display formatted dates     | Calendar types (Gregorian/Hijri), custom formats |
| **NUMBER**  | Display numbers as text     | Breakpoint mapping, variable-based               |
| **COUNTRY** | Display student nationality | Country name or nationality format               |
| **GENDER**  | Display student gender      | Locale-based text mapping                        |
| **IMAGE**   | Display static images       | File storage, fit modes                          |
| **QR_CODE** | Display QR codes            | Verification URL/code, error correction          |

### Key Principles

1. **Config is source of truth** - Complete element configuration in JSONB
2. **Columns mirror critical FKs** - For database integrity and relations
3. **Explicit data sources** - Every element has a well-defined data source
4. **Type safety** - TypeScript discriminated unions ensure correctness

## File Locations

```
server/
├── types/element/                    # TypeScript types
│   ├── enum.element.types.ts        # General enums
│   ├── config.element.types.ts      # Shared configs
│   ├── base.element.types.ts        # Base types
│   ├── text.element.types.ts        # TEXT element
│   ├── date.element.types.ts        # DATE element
│   ├── number.element.types.ts      # NUMBER element
│   ├── country.element.types.ts     # COUNTRY element
│   ├── gender.element.types.ts      # GENDER element
│   ├── image.element.types.ts       # IMAGE element
│   ├── qrcode.element.types.ts      # QR_CODE element
│   ├── union.element.types.ts       # Unions & responses
│   └── index.ts                     # Exports
│
└── db/schema/certificateElements/
    ├── certificateElement.ts         # Main schema table
    └── templateElementEnums.ts       # Database enums
```

## Common Tasks

### Creating an Element

See [Config-Column Sync](./config-column-sync.md) for the critical synchronization requirements.

### Querying Elements

Elements are queried by `templateId` and returned ordered by `zIndex`:

```typescript
type CertificateElementsResponse = CertificateElementPothosUnion[];
```

### Using Relations

The schema includes relations for efficient data loading:

- `element.font` - Load self-hosted font
- `element.templateVariable` - Load template variable
- `element.storageFile` - Load image file

## Important Notes

⚠️ **Critical**: When creating or updating elements, you MUST synchronize the JSONB config with FK columns. See [Config-Column Sync](./config-column-sync.md) for detailed rules.

## Next Steps

- Start with [Architecture](./architecture.md) to understand design decisions
- Review [Element Types](./element-types.md) to understand each element
- Read [Config-Column Sync](./config-column-sync.md) before implementing mutations
