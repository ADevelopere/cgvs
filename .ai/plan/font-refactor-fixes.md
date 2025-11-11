# Font Refactor TypeScript Fixes Plan

## Overview

After implementing the font reference variant refactor (backend changes completed), TypeScript errors need to be fixed across template editor components and font management files. The backend has been updated to support:

1. **FontFamily/FontVariant structure** for self-hosted fonts
2. **Google Font variants** in FontReferenceGoogle
3. **New GraphQL schema** with FontFamilyName enum and updated FontReference types

## Key Changes Implemented (Backend)

From the GraphQL schema analysis:

### FontReference Types (New Structure)

```typescript
// Google Font Reference
type FontReferenceGoogle = {
  family?: FontFamilyName | null; // Now uses enum instead of string
  type?: FontSource | null;
  variant?: string | null; // NEW: variant support
};

// Self-Hosted Font Reference
type FontReferenceSelfHosted = {
  fontVariantId?: number | null; // Renamed from fontId
  type?: FontSource | null;
};

// Input Types
type FontReferenceGoogleInput = {
  family: FontFamilyName; // Uses enum
  variant: string; // Required variant
};

type FontReferenceSelfHostedInput = {
  fontVariantId: number; // Renamed from fontId
};
```

### Font Management Types (New Structure)

```typescript
// FontFamily (replaces old Font type)
type FontFamily = {
  id: number;
  name: string;
  category?: string | null;
  locale: Array<string>;
  createdAt: any;
  updatedAt: any;
  variants: Array<FontVariant>; // Relation to variants
};

// FontVariant (new type)
type FontVariant = {
  id: number;
  familyId: number;
  variant: string;
  file?: FileInfo | null;
  url?: string | null;
  createdAt: any;
  updatedAt: any;
};
```

## Error Categories

### 1. Missing Export: `fontsQueryDocument` (10 errors)

**Files affected:**

- `app/(root)/(auth)/test/page.tsx`
- `client/views/template/manage/editor/addNewNodePanel/wrappers/CreateCountryElementWrapper.tsx`
- `client/views/template/manage/editor/addNewNodePanel/wrappers/CreateDateElementWrapper.tsx`
- `client/views/template/manage/editor/addNewNodePanel/wrappers/CreateGenderElementWrapper.tsx`
- `client/views/template/manage/editor/addNewNodePanel/wrappers/CreateNumberElementWrapper.tsx`
- `client/views/template/manage/editor/addNewNodePanel/wrappers/CreateTextElementWrapper.tsx`
- `client/views/template/manage/editor/configPanel/currentElement/CurrentTextElement.tsx`

**Issue:** Components import `fontsQueryDocument` which no longer exists

**Solution:** Use existing `fontFamiliesQueryDocument` from font.documents.ts (already implemented)

### 2. Missing Type: `Font` (8 errors)

**Files affected:**

- `client/views/template/manage/editor/form/element/country/CountryElementForm.tsx`
- `client/views/template/manage/editor/form/element/date/DateElementForm.tsx`
- `client/views/template/manage/editor/form/element/gender/GenderElementForm.tsx`
- `client/views/template/manage/editor/form/element/number/NumberElementForm.tsx`
- `client/views/template/manage/editor/form/element/story.util.ts`
- `client/views/template/manage/editor/form/element/text/TextElementForm.tsx`
- `client/views/template/manage/editor/form/element/textProps/FontReferenceSelector.tsx`
- `client/views/template/manage/editor/form/element/textProps/TextPropsForm.tsx`

**Issue:** `Font` type no longer exists in generated GraphQL types

**Solution:** Replace with `FontFamily` type (for font selector) and update FontReferenceSelector to work with families + variants

### 3. Missing Type: `FontCreateInput` (1 error)

**File:** `client/views/font/components/FontForm.tsx`

**Issue:** `FontCreateInput` type no longer exists

**Solution:** This component is no longer used (replaced by dialogs), can be removed or updated

### 4. Missing Property: `fonts` query (12 errors)

**Files affected:** Same as category 1

**Issue:** GraphQL query result expects `data.fonts` but new structure uses `fontFamilies`

**Solution:** Update query usage to access `fontFamilies` data

### 5. Missing Method: `deleteFont` (1 error)

**File:** `client/views/font/dialogs/DeleteFontDialog.tsx`

**Issue:** `useFontOperations` no longer exports `deleteFont`

**Solution:** Update to use `deleteFontVariantMutation` directly or remove this dialog (replaced by DeleteVariantDialog)

### 6. Wrong Query Property: `checkFontUsage` (2 errors)

**File:** `client/views/font/dialogs/DeleteFontDialog.tsx`

**Issue:** Query returns `checkFontVariantUsage` not `checkFontUsage`

**Solution:** Update property access to use correct name

### 7. FontReference Input Changes (New Category)

**Files affected:** All components using FontReferenceInput

**Issue:** FontReferenceInput structure changed:

- Google fonts now require `family` (FontFamilyName enum) + `variant` (string)
- Self-hosted fonts now use `fontVariantId` instead of `fontId`

**Solution:** Update all FontReferenceInput usage to match new structure

## Available GraphQL Types (Implemented)

### FontFamily Type

```typescript
type FontFamily = {
  id: number;
  name: string;
  category?: string | null;
  locale: Array<string>;
  createdAt: any;
  updatedAt: any;
  variants: Array<FontVariant>; // Always available
};
```

### FontVariant Type

```typescript
type FontVariant = {
  id: number;
  familyId: number;
  variant: string;
  file?: FileInfo | null; // Optional
  url?: string | null; // Optional
  createdAt: any;
  updatedAt: any;
};
```

### FontFamilyName Enum

```typescript
// Large enum with all Google Font families
enum FontFamilyName {
  Roboto = "ROBOTO",
  OpenSans = "OPEN_SANS",
  // ... hundreds of Google Font families
}
```

### FontReference Types (Updated)

```typescript
// Union type
type FontReference = FontReferenceGoogle | FontReferenceSelfHosted;

// Google Font Reference (updated)
type FontReferenceGoogle = {
  family?: FontFamilyName | null; // Now enum
  type?: FontSource | null;
  variant?: string | null; // NEW: variant support
};

// Self-Hosted Font Reference (updated)
type FontReferenceSelfHosted = {
  fontVariantId?: number | null; // Renamed from fontId
  type?: FontSource | null;
};
```

### Input Types

```typescript
// Font Reference Input (updated structure)
type FontReferenceInput =
  | { google: FontReferenceGoogleInput; selfHosted?: never }
  | { google?: never; selfHosted: FontReferenceSelfHostedInput };

// Google Font Input (updated)
type FontReferenceGoogleInput = {
  family: FontFamilyName; // Required enum
  variant: string; // Required variant
};

// Self-Hosted Font Input (updated)
type FontReferenceSelfHostedInput = {
  fontVariantId: number; // Renamed from fontId
};

// Font Management Input Types
type FontFamilyCreateInput = {
  name: string;
  category?: string;
  locale: Array<string>;
};

type FontFamilyUpdateInput = {
  id: number;
  name: string;
  category?: string;
  locale: Array<string>;
};

type FontVariantCreateInput = {
  familyId: number;
  variant: string;
  storageFilePath: string;
};

type FontVariantUpdateInput = {
  id: number;
  variant: string;
  storageFilePath: string;
};
```

## Existing GraphQL Queries (Already Implemented)

### Font Families

```graphql
# Get all font families
query fontFamilies {
  fontFamilies {
    id
    name
    category
    locale
    createdAt
    updatedAt
  }
}

# Get single font family
query fontFamily($id: Int!) {
  fontFamily(id: $id) {
    id
    name
    category
    locale
    createdAt
    updatedAt
  }
}
```

### Font Variants

```graphql
# Get font variants with optional filtering and pagination
query fontVariants(
  $paginationArgs: PaginationArgs
  $orderBy: [FontVariantsOrderByClause!]
  $filterArgs: FontVariantFilterArgs
) {
  fontVariants(paginationArgs: $paginationArgs, orderBy: $orderBy, filterArgs: $filterArgs) {
    data {
      id
      familyId
      variant
      file {
        path
        url
        name
        size
      }
      url
      createdAt
      updatedAt
    }
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasMorePages
    }
  }
}

# Get single font variant
query fontVariant($id: Int!) {
  fontVariant(id: $id) {
    id
    familyId
    variant
    file {
      path
      url
      name
      size
    }
    url
    createdAt
    updatedAt
  }
}

# Check if font variant is in use
query checkFontVariantUsage($id: Int!) {
  checkFontVariantUsage(id: $id) {
    isInUse
    usageCount
    usedBy {
      elementId
      elementType
      templateId
      templateName
    }
    canDelete
    deleteBlockReason
  }
}
```

**Note:** All these queries are already implemented in `server/graphql/query/font.query.ts`. No backend changes needed.

## Existing GraphQL Mutations (Already Implemented)

### Font Family Mutations

```graphql
mutation createFontFamily($input: FontFamilyCreateInput!) {
  createFontFamily(input: $input) {
    id
    name
    category
    locale
    createdAt
    updatedAt
  }
}

mutation updateFontFamily($input: FontFamilyUpdateInput!) {
  updateFontFamily(input: $input) {
    id
    name
    category
    locale
    createdAt
    updatedAt
  }
}

mutation deleteFontFamily($id: Int!) {
  deleteFontFamily(id: $id) {
    id
    name
    category
    locale
    createdAt
    updatedAt
  }
}
```

### Font Variant Mutations

```graphql
mutation createFontVariant($input: FontVariantCreateInput!) {
  createFontVariant(input: $input) {
    id
    familyId
    variant
    file {
      path
      url
      name
      size
    }
    url
    createdAt
    updatedAt
  }
}

mutation updateFontVariant($input: FontVariantUpdateInput!) {
  updateFontVariant(input: $input) {
    id
    familyId
    variant
    file {
      path
      url
      name
      size
    }
    url
    createdAt
    updatedAt
  }
}

mutation deleteFontVariant($id: Int!) {
  deleteFontVariant(id: $id) {
    id
    familyId
    variant
    file {
      path
      url
      name
      size
    }
    url
    createdAt
    updatedAt
  }
}

mutation createFontWithFamily(
  $familyName: String!
  $category: String
  $locale: [String!]!
  $variant: String!
  $storageFilePath: String!
) {
  createFontWithFamily(
    familyName: $familyName
    category: $category
    locale: $locale
    variant: $variant
    storageFilePath: $storageFilePath
  ) {
    id
    familyId
    variant
    file {
      path
      url
      name
      size
    }
    url
    createdAt
    updatedAt
  }
}
```

## Implementation Steps

### Step 1: Update Template Editor Wrappers

**Files:** All `Create*ElementWrapper.tsx` files

Replace:

- Import: `fontsQueryDocument` → `fontFamiliesQueryDocument` (already exists)
- Query access: `data?.fonts?.data` → `data?.fontFamilies`
- Type: `Font` → `FontFamily`

### Step 2: Update Element Forms

**Files:** All element form files

Replace:

- Type import: `Font` → `FontFamily`
- Update prop types and component logic

### Step 3: Update FontReferenceSelector (Major Refactor Required)

**File:** `client/views/template/manage/editor/form/element/textProps/FontReferenceSelector.tsx`

**Major Changes:**

- Replace `Font[]` prop with `FontFamily[]`
- Add two-step selection for both Google and self-hosted fonts
- **BREAKING**: Google fonts now require variant selection
- Self-hosted fonts use new fontVariantId structure

**New Interface:**

```typescript
interface FontReferenceSelectorProps {
  fontRef: FontReferenceInput;
  language: AppLanguage;
  fontFamilies: FontFamily[]; // Changed from selfHostedFonts: Font[]
  onFontRefChange: UpdateFontRefFn;
  error?: string;
  disabled?: boolean;
}
```

**Implementation Changes:**

**Google Fonts Handling (UPDATED):**
From the GraphQL types, `FontReferenceGoogleInput` now has:

- `family: FontFamilyName` (required enum)
- `variant: string` (required)

This means:

- Google fonts now require both family AND variant selection
- Two-step selection: family (enum) → variant (string)
- Need to provide variant options for each Google font family
- Store both family and variant in FontReferenceInput

**Self-Hosted Fonts Handling (UPDATED):**

- `FontReferenceSelfHostedInput` now uses `fontVariantId: number`
- Two-step selection: family → variant → store variant.id in fontVariantId
- Use `fontVariantsQuery` with `filterArgs: { familyId }` to get variants
- Backward compatibility: existing fontId values now point to variant IDs

**New FontReferenceInput Structure:**

```typescript
// For Google fonts
const googleFontRef: FontReferenceInput = {
  google: {
    family: FontFamilyName.Roboto, // Enum value
    variant: "400", // String variant
  },
};

// For self-hosted fonts
const selfHostedFontRef: FontReferenceInput = {
  selfHosted: {
    fontVariantId: 123, // Variant ID, not family ID
  },
};
```

### Step 5: Fix DeleteFontDialog

**File:** `client/views/font/dialogs/DeleteFontDialog.tsx`

Option A: Remove file (replaced by DeleteVariantDialog)
Option B: Update to work with variants:

- Use `deleteFontVariantMutation` from `useFontApolloMutations`
- Update query property: `checkFontUsage` → `checkFontVariantUsage`

### Step 6: Fix FontForm Component

**File:** `client/views/font/components/FontForm.tsx`

Option A: Remove file (no longer used)
Option B: Update to use new input types

### Step 7: Fix Server Import

**File:** `server/graphql/mutation/fontFamily.mutation.ts`

Add import:

```typescript
import { FontVariantPothosObject } from "../pothos/font.pothos";
```

### Step 8: Update Test Page

**File:** `app/(root)/(auth)/test/page.tsx`

Update to use new query structure

## Migration Notes

### Breaking Changes

1. `Font` type replaced with `FontFamily` (for selection) and `FontVariant` (for storage)
2. `fonts` query replaced with `fontFamilies` query
3. **Google fonts now require variant selection** (breaking change)
4. Font selector now shows families first, then variants for BOTH Google and self-hosted fonts
5. FontReferenceInput structure completely changed:
   - Google: `{ google: { family: FontFamilyName, variant: string } }`
   - Self-hosted: `{ selfHosted: { fontVariantId: number } }`
6. FontReferenceSelector interface changed to accept FontFamily[] instead of Font[]
7. Self-hosted fonts now use `fontVariantId` instead of `fontId`

### Backward Compatibility

- Database migration already handled
- Existing font references in templates will work (fontId now points to variant)
- **Google fonts**: Existing references without variants will need migration or default variant assignment
- No data loss

### UI Changes

- Font selector shows two dropdowns for BOTH font types:
  1. Font Family dropdown (Roboto, Arial, etc.)
  2. Font Variant dropdown (Regular, Bold, Italic, etc.) - appears after family selection
- **Google fonts**: Both family AND variant selection required (breaking change)
- **Self-hosted fonts**: Both family and variant selection required
- Font management shows families with expandable variants
- Need Google Font variant data/mapping for variant selection

## Testing Checklist

- [ ] Template editor can select font families
- [ ] Font family selector shows all available families
- [ ] Font variant selector shows variants for selected family (both Google and self-hosted)
- [ ] **Google fonts work with family + variant selection** (updated requirement)
- [ ] Self-hosted fonts work with family + variant selection
- [ ] Creating text elements works with new font structure
- [ ] Editing text elements works with new font structure
- [ ] Font preview works in template editor with variants
- [ ] All element types (text, date, number, country, gender) work
- [ ] Font management CRUD operations work
- [ ] FontReferenceInput validation works for new structure
- [ ] Google font variant validation works
- [ ] Self-hosted font variant validation works
- [ ] Migration of existing Google font references works
- [ ] No TypeScript errors
- [ ] No runtime errors

## Files to Modify (Summary)

### Client Files (20 files)

1. `client/views/font/hooks/font.documents.ts` - Add new query
2. `client/views/font/dialogs/DeleteFontDialog.tsx` - Fix or remove
3. `client/views/font/components/FontForm.tsx` - Fix or remove
4. `client/views/template/manage/editor/addNewNodePanel/wrappers/CreateCountryElementWrapper.tsx`
5. `client/views/template/manage/editor/addNewNodePanel/wrappers/CreateDateElementWrapper.tsx`
6. `client/views/template/manage/editor/addNewNodePanel/wrappers/CreateGenderElementWrapper.tsx`
7. `client/views/template/manage/editor/addNewNodePanel/wrappers/CreateNumberElementWrapper.tsx`
8. `client/views/template/manage/editor/addNewNodePanel/wrappers/CreateTextElementWrapper.tsx`
9. `client/views/template/manage/editor/configPanel/currentElement/CurrentTextElement.tsx`
10. `client/views/template/manage/editor/form/element/country/CountryElementForm.tsx`
11. `client/views/template/manage/editor/form/element/date/DateElementForm.tsx`
12. `client/views/template/manage/editor/form/element/gender/GenderElementForm.tsx`
13. `client/views/template/manage/editor/form/element/number/NumberElementForm.tsx`
14. `client/views/template/manage/editor/form/element/story.util.ts`
15. `client/views/template/manage/editor/form/element/text/TextElementForm.tsx`
16. `client/views/template/manage/editor/form/element/textProps/FontReferenceSelector.tsx`
17. `client/views/template/manage/editor/form/element/textProps/TextPropsForm.tsx`
18. `app/(root)/(auth)/test/page.tsx`

### Server Files (1 file)

1. `server/graphql/mutation/fontFamily.mutation.ts` - Add import

## Estimated Effort

- Template editor wrappers: 30 minutes (5 files × 6 minutes)
- Element forms: 45 minutes (6 files × 7.5 minutes)
- FontReferenceSelector major refactor: 60 minutes (two-step selection, variant fetching)
- Cleanup/fixes: 20 minutes
- Testing: 45 minutes (more complex UI to test)

**Total: ~4.5 hours** (increased due to Google font variant requirement)
