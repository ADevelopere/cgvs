<!-- 4cc89b7f-5d73-4c4f-b7d4-47fe66e911d3 edc79b02-e220-42ce-8f2e-03161616116d -->
# Font Management System - Master Plan

## Overview

Implement a complete font management system with server-side GraphQL API and client-side split-view UI. Fonts will store references to storage files, support multiple locales, and prevent deletion when in use by certificate elements.

## Architecture Decisions

### Server Architecture

- **Database**: Use existing `font` schema (`/workspaces/cgvs/server/db/schema/font.ts`)
- **File Storage**: Font files managed through existing storage system (reference by `storageFileId`)
- **Deletion**: Hard delete with usage validation (check certificate element references)
- **Locale**: Multi-select support with "all" option for universal fonts

### Client Architecture

- **Layout**: Split view (list left, details/preview right) similar to template management
- **File Upload**: File picker from existing storage browser
- **State**: Zustand store with session persistence
- **Cache**: Apollo cache management with optimistic updates

## Implementation Sub-Plans

This master plan spawns **3 focused sub-plans** to be created and executed sequentially:

---

## Sub-Plan 1: Server Foundation

**File**: `.cursor/plan/01-font-server-foundation.md`

### Scope

Complete server-side GraphQL API implementation

### Components to Create

#### 1. Types (`server/types/font.types.ts`)

```typescript
// Based on existing patterns in templateCategory.types.ts
- FontEntity (inferred from schema)
- FontInsertInput
- FontSelectType
- FontCreateInput { name, locale[], storageFileId }
- FontUpdateInput { id, name, locale[], storageFileId }
- FontUsageCheckResult { isInUse, usedBy[] }
- FontWithStorageFile (joined type)
```

#### 2. Repository (`server/db/repo/font.repository.ts`)

```typescript
// Pattern: templateCategory.repository.ts, storage.repository.ts
- findById(id): FontSelectType | null
- findAll(): FontSelectType[]
- searchByName(term, limit): FontSelectType[]
- create(input): FontSelectType
- update(input): FontSelectType
- deleteById(id): FontSelectType // with usage check
- checkUsage(id): FontUsageCheckResult
- findByStorageFileId(fileId): FontSelectType[]
```

**Key Logic**:

- `deleteById`: Query certificate elements table for font usage before deletion
- `searchByName`: Paginated search with ILIKE pattern
- Validate `storageFileId` exists in storage_files table before insert/update

#### 3. Pothos Schema (`server/graphql/pothos/font.pothos.ts`)

```typescript
// Pattern: templateCategory.pothos.ts
- FontPothosObject (with loadable pattern)
- FontCreateInputPothosObject
- FontUpdateInputPothosObject
- FontUsageCheckResultPothosObject
- FontWithStorageFilePothosObject
- Relation: storageFile field (loadable from storage)
```

#### 4. Mutations (`server/graphql/mutation/font.mutation.ts`)

```typescript
// Pattern: templateCategory.mutation.ts
- createFont(input: FontCreateInput): Font
- updateFont(input: FontUpdateInput): Font
- deleteFont(id: Int!): Font // throws if in use
```

#### 5. Queries (`server/graphql/query/font.query.ts`)

```typescript
// Pattern: templateCategory.query.ts
- font(id: Int!): Font
- fonts: [Font!]! // all fonts
- searchFonts(name: String!, limit: Int): [Font!]!
- checkFontUsage(id: Int!): FontUsageCheckResult
```

#### 6. Export Updates

- Add to `server/types/index.ts`
- Add to `server/db/repo/index.ts`
- Add to `server/graphql/pothos/index.ts`
- Add to `server/graphql/mutation/index.ts`
- Add to `server/graphql/query/index.ts`

### Validation

Run after implementation:

```bash
~/.bun/bin/bun tsc
~/.bun/bin/bun lint
```

---

## Sub-Plan 2: Client Foundation

**File**: `.cursor/plan/02-font-client-foundation.md`

### Scope

GraphQL documents, Zustand store, Apollo hooks, and operation hooks

### Components to Create

#### 1. GraphQL Documents (`client/views/font/hooks/font.documents.ts`)

```typescript
// Pattern: client/views/student/hook/student.documents.ts
- fontQueryDocument: Query single font by ID
- fontsQueryDocument: Query all fonts
- searchFontsQueryDocument: Search with pagination
- checkFontUsageQueryDocument: Check usage before delete
- createFontMutationDocument
- updateFontMutationDocument
- deleteFontMutationDocument
```

**Fields to include**: id, name, locale (as array), storageFileId, createdAt, updatedAt, storageFile { path, name, url, contentType, size }

#### 2. Zustand Store (`client/views/font/stores/useFontStore.ts`)

```typescript
// Pattern: client/views/student/stores/useStudentStore.ts
State:
- selectedFontId: number | null
- searchTerm: string
- fonts: Font[] // for list view
- currentFont: Font | null // for detail view
- isFilePickerOpen: boolean

Actions:
- setSelectedFont(id)
- setSearchTerm(term)
- setFonts(fonts)
- setCurrentFont(font)
- openFilePicker() / closeFilePicker()
- reset()

Persistence: sessionStorage with partialize
```

#### 3. Apollo Mutations (`client/views/font/hooks/useFontApolloMutations.ts`)

```typescript
// Pattern: useStudentApolloMutations.ts
- createFontMutation with cache eviction
- updateFontMutation with optimistic response
- deleteFontMutation with cache eviction
- evictFontsCache helper

Optimistic updates for instant UI feedback
```

#### 4. Operations Hook (`client/views/font/hooks/useFontOperations.ts`)

```typescript
// Pattern: useStudentOperations.tsx
Functions:
- loadFonts(): fetch all fonts
- searchFonts(term): search by name
- selectFont(id): load font details
- createFont(input): create with loading state
- updateFont(input): update with loading state
- deleteFont(id): delete with usage check
- checkUsage(id): validate before delete

State management: Integrates Apollo mutations with Zustand store
Error handling with toast notifications
```

#### 5. Type Definitions

Create `client/views/font/types.ts`:

```typescript
- FontFormData
- FontListItem
- FontDetailView
- FilePickerResult
```

### Validation

Run after implementation:

```bash
~/.bun/bin/bun tsc
~/.bun/bin/bun lint
```

---

## Sub-Plan 3: Client UI Components

**File**: `.cursor/plan/03-font-client-ui.md`

### Scope

React components, split-view layout, file picker integration, and Next.js page

### Components to Create

#### 1. Font List Component (`client/views/font/FontList.tsx`)

```typescript
// Left side of split view
- Search input (real-time filtering)
- Font list items (name, locale badges, thumbnail)
- Selected state highlighting
- Empty state
- Loading skeleton
- Create new font button

UI: Scrollable list, compact items with preview
```

#### 2. Font Detail Component (`client/views/font/FontDetail.tsx`)

```typescript
// Right side of split view
- Font preview (render with actual font file)
- Editable fields: name, locale (multi-select), file
- File picker button (opens storage browser)
- Font metadata display (size, format, uploaded date)
- Save/Cancel actions
- Delete button with confirmation

UI: Form-based with font preview at top
```

#### 3. Font Form Component (`client/views/font/components/FontForm.tsx`)

```typescript
// Reusable form for create/edit
- Name input (text field)
- Locale selector (multi-select with chips: "all", "en", "ar", "fr", etc.)
- File picker integration (shows current file, allows change)
- Font preview panel
- Validation: name required, at least one locale, valid file
```

#### 4. Locale Selector (`client/views/font/components/LocaleSelector.tsx`)

```typescript
// Multi-select component with predefined options
Options: ["all", "ar", "en", "fr", "de", "es", "zh", "ja", "ru"]
UI: Chip-based selection, "all" disables others
Visual: Language flags/codes as icons
```

#### 5. Font Preview (`client/views/font/components/FontPreview.tsx`)

```typescript
// Display sample text in selected font
- Loads font from storage URL
- Shows character set preview
- Handles loading/error states
- Preview text: "The quick brown fox..." + Arabic equivalent
```

#### 6. File Picker Integration (`client/views/font/components/FontFilePicker.tsx`)

```typescript
// Wrapper around existing storage browser
- Opens storage browser in dialog
- Filters: only font files (.ttf, .otf, .woff, .woff2)
- Returns selected file ID and metadata
- Shows current selection with preview
```

#### 7. Delete Confirmation (`client/views/font/dialogs/DeleteFontDialog.tsx`)

```typescript
// Usage check before deletion
- Shows usage information if in use
- Blocks deletion if used in certificate elements
- Lists where font is used
- Confirm/Cancel actions
```

#### 8. Main View (`client/views/font/FontManagementView.tsx`)

```typescript
// Split view container
Layout:
- Left: FontList (30% width)
- Right: FontDetail (70% width)
- Responsive: stacks on mobile

Manages:
- Font selection state
- Create/edit mode switching
- File picker dialog state
```

#### 9. Next.js Page (`app/(root)/(auth)/admin/fonts/page.tsx`)

```typescript
// Pattern: app/(root)/(auth)/admin/students/page.tsx
import FontManagementView from "@/client/views/font/FontManagementView"

export default function FontsPage() {
  return <FontManagementView />
}
```

#### 10. Styling

Create `client/views/font/styles/` directory:

- Use existing UI components from shadcn
- Match template management aesthetics
- Responsive design with Tailwind CSS

### File Structure

```
client/views/font/
├── FontManagementView.tsx (main)
├── FontList.tsx
├── FontDetail.tsx
├── components/
│   ├── FontForm.tsx
│   ├── LocaleSelector.tsx
│   ├── FontPreview.tsx
│   └── FontFilePicker.tsx
├── dialogs/
│   └── DeleteFontDialog.tsx
├── hooks/
│   ├── font.documents.ts
│   ├── useFontApolloMutations.ts
│   └── useFontOperations.ts
├── stores/
│   └── useFontStore.ts
└── types.ts
```

### Validation

Run after implementation:

```bash
~/.bun/bin/bun tsc
~/.bun/bin/bun lint
```

---

## Dependencies & Integration Points

### Server Dependencies

- Existing: `storage.repository.ts` (validate storageFileId)
- Existing: `certificateElement` schema (check font usage)
- New: Font usage tracking in certificate elements

### Client Dependencies

- Existing: Storage browser file picker
- Existing: UI components (shadcn)
- Existing: Apollo client setup
- New: Font loading utilities (@font-face dynamic loading)

### Database Relations

```sql
-- font.storageFileId → storage_files.id (FK)
-- certificate_element.fontId → font.id (FK, nullable)
```

### Validation Queries Needed

```typescript
// In deleteById, check usage:
const usage = await db
  .select()
  .from(certificateElements)
  .where(eq(certificateElements.fontId, id))
  .limit(1);

if (usage.length > 0) {
  throw new Error("Cannot delete font: in use by certificate elements");
}
```

## Testing Strategy (Post-Implementation)

### Server Tests

1. Create font with valid storage file ID
2. Create font with invalid storage file ID (should fail)
3. Update font locale array
4. Delete font (unused)
5. Delete font (in use) - should fail
6. Search fonts by name

### Client Tests

1. Load fonts list
2. Select font and view details
3. Create new font with file picker
4. Update font name and locales
5. Delete unused font
6. Attempt delete of used font (should show error)
7. Font preview rendering

## Success Criteria

- ✅ All server types, repository, pothos, mutations, and queries created
- ✅ All client hooks, stores, and components created
- ✅ Split-view UI functional with font list and detail panel
- ✅ File picker integration working (filters font files only)
- ✅ Multi-locale selector with "all" option
- ✅ Font preview displays selected font
- ✅ Delete prevention when font is in use
- ✅ No TypeScript errors (`bun tsc`)
- ✅ No linting errors (`bun lint`)
- ✅ GraphQL schema regenerated with new types
- ✅ Page accessible at `/admin/fonts`

## Execution Order

1. **Create** `.cursor/plan/01-font-server-foundation.md` (detailed sub-plan)
2. **Execute** Sub-Plan 1
3. **Validate** server implementation
4. **Create** `.cursor/plan/02-font-client-foundation.md` (detailed sub-plan)
5. **Execute** Sub-Plan 2
6. **Validate** client foundation
7. **Create** `.cursor/plan/03-font-client-ui.md` (detailed sub-plan)
8. **Execute** Sub-Plan 3
9. **Validate** full integration
10. **Test** end-to-end workflows

---

## Notes

- This master plan will NOT be implemented directly
- Each sub-plan will be a detailed, actionable plan with specific file contents
- Sub-plans should reference this master plan for context
- Font file types: .ttf, .otf, .woff, .woff2
- Locale codes: ISO 639-1 (2-letter) + "all" for universal
- Font preview may require @font-face dynamic loading via CSS

### To-dos

- [ ] Create detailed sub-plan 01-font-server-foundation.md with complete server implementation details
- [ ] Create detailed sub-plan 02-font-client-foundation.md with GraphQL documents, stores, and hooks
- [ ] Create detailed sub-plan 03-font-client-ui.md with all React components and page