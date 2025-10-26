# Sub-Plan 2: Font Management - Client Foundation

**Parent Plan**: Font Management Master Plan

**Status**: Ready for Implementation

**Dependencies**: Sub-Plan 1 (Server Foundation) must be completed

**Scope**: GraphQL documents, Zustand store, Apollo mutations, and operation hooks

---

## Overview

Implement client-side foundation for font management including TypedDocuments for GraphQL queries/mutations, Zustand store for state management, Apollo mutation hooks with cache management, and operation hooks that integrate everything.

---

## Implementation Steps

### Step 1: Create Type Definitions

**File**: `/workspaces/cgvs/client/views/font/types.ts`

**Dependencies**: None (base types)

**Content**:

```typescript
// Form data for creating/updating fonts
export interface FontFormData {
  name: string;
  locale: string[];
  storageFileId: number | null;
}

// Font list item (for list view)
export interface FontListItem {
  id: number;
  name: string;
  locale: string[];
  storageFileId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Font with storage file details (for detail view)
export interface FontDetailView {
  id: number;
  name: string;
  locale: string[];
  storageFileId: number;
  createdAt: Date;
  updatedAt: Date;
  storageFile?: {
    path: string;
    name: string;
    url: string;
    contentType: string | null;
    size: number;
  } | null;
}

// File picker result
export interface FilePickerResult {
  fileId: number;
  path: string;
  name: string;
  url: string;
  contentType: string | null;
  size: number;
}

// Font usage information
export interface FontUsageInfo {
  elementId: number;
  elementType: string;
  templateId: number | null;
  templateName: string | null;
}

// Font usage check result
export interface FontUsageCheckResult {
  isInUse: boolean;
  usageCount: number;
  usedBy: FontUsageInfo[];
  canDelete: boolean;
  deleteBlockReason: string | null;
}

// Predefined locale options
export const LOCALE_OPTIONS = [
  { value: "all", label: "All Languages", flag: "🌐" },
  { value: "ar", label: "Arabic", flag: "🇸🇦" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "fr", label: "French", flag: "🇫🇷" },
  { value: "de", label: "German", flag: "🇩🇪" },
  { value: "es", label: "Spanish", flag: "🇪🇸" },
  { value: "zh", label: "Chinese", flag: "🇨🇳" },
  { value: "ja", label: "Japanese", flag: "🇯🇵" },
  { value: "ru", label: "Russian", flag: "🇷🇺" },
  { value: "pt", label: "Portuguese", flag: "🇵🇹" },
  { value: "it", label: "Italian", flag: "🇮🇹" },
  { value: "ko", label: "Korean", flag: "🇰🇷" },
  { value: "tr", label: "Turkish", flag: "🇹🇷" },
] as const;

// Font file extensions
export const FONT_FILE_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2"];
export const FONT_MIME_TYPES = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2",
  "application/font-ttf",
  "application/font-otf",
  "application/font-woff",
  "application/x-font-ttf",
  "application/x-font-otf",
  "application/x-font-woff",
];
```

**Key Features**:

- Separate types for list vs detail views
- Predefined locale options with flags
- Font file type constants for filtering

---

### Step 2: Create GraphQL Documents

**File**: `/workspaces/cgvs/client/views/font/hooks/font.documents.ts`

**Dependencies**:

- `@apollo/client`
- `client/graphql/generated/gql/graphql` (will be generated after server implementation)
- Pattern: `client/views/student/hook/student.documents.ts`

**Content**:

```typescript
import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

// Query: Get single font by ID
export const fontQueryDocument: TypedDocumentNode<
  Graphql.FontQuery,
  Graphql.FontQueryVariables
> = gql`
  query font($id: Int!) {
    font(id: $id) {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

// Query: Get all fonts
export const fontsQueryDocument: TypedDocumentNode<
  Graphql.FontsQuery,
  Graphql.FontsQueryVariables
> = gql`
  query fonts {
    fonts {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

// Query: Search fonts by name
export const searchFontsQueryDocument: TypedDocumentNode<
  Graphql.SearchFontsQuery,
  Graphql.SearchFontsQueryVariables
> = gql`
  query searchFonts($name: String!, $limit: Int) {
    searchFonts(name: $name, limit: $limit) {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

// Query: Check font usage before deletion
export const checkFontUsageQueryDocument: TypedDocumentNode<
  Graphql.CheckFontUsageQuery,
  Graphql.CheckFontUsageQueryVariables
> = gql`
  query checkFontUsage($id: Int!) {
    checkFontUsage(id: $id) {
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
`;

// Mutation: Create font
export const createFontMutationDocument: TypedDocumentNode<
  Graphql.CreateFontMutation,
  Graphql.CreateFontMutationVariables
> = gql`
  mutation createFont($input: FontCreateInput!) {
    createFont(input: $input) {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

// Mutation: Update font
export const updateFontMutationDocument: TypedDocumentNode<
  Graphql.UpdateFontMutation,
  Graphql.UpdateFontMutationVariables
> = gql`
  mutation updateFont($input: FontUpdateInput!) {
    updateFont(input: $input) {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

// Mutation: Delete font
export const deleteFontMutationDocument: TypedDocumentNode<
  Graphql.DeleteFontMutation,
  Graphql.DeleteFontMutationVariables
> = gql`
  mutation deleteFont($id: Int!) {
    deleteFont(id: $id) {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;
```

**Key Features**:

- Fully typed with generated GraphQL types
- Separate documents for each operation
- Consistent field selection across queries
- Usage check query for delete validation

---

### Step 3: Create Zustand Store

**File**: `/workspaces/cgvs/client/views/font/stores/useFontStore.ts`

**Dependencies**:

- `zustand`
- `zustand/middleware` (persist, createJSONStorage)
- `client/views/font/types`
- Pattern: `client/views/student/stores/useStudentStore.ts`

**Content**:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FontListItem, FontDetailView } from "../types";
import logger from "@/client/lib/logger";

/**
 * Font UI Store State
 * Manages font selection, search, and UI state
 */
type State = {
  // Font data
  fonts: FontListItem[];
  currentFont: FontDetailView | null;
  selectedFontId: number | null;

  // Search and filters
  searchTerm: string;

  // UI state
  isFilePickerOpen: boolean;
  isCreating: boolean;
  isEditing: boolean;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;
};

type Actions = {
  // Font data actions
  setFonts: (fonts: FontListItem[]) => void;
  setCurrentFont: (font: FontDetailView | null) => void;
  setSelectedFontId: (id: number | null) => void;

  // Search actions
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;

  // UI actions
  openFilePicker: () => void;
  closeFilePicker: () => void;
  startCreating: () => void;
  cancelCreating: () => void;
  startEditing: () => void;
  cancelEditing: () => void;

  // Loading actions
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;

  // Utility actions
  reset: () => void;
};

type FontStoreState = State & Actions;

const initialState: State = {
  fonts: [],
  currentFont: null,
  selectedFontId: null,
  searchTerm: "",
  isFilePickerOpen: false,
  isCreating: false,
  isEditing: false,
  isLoading: false,
  isSaving: false,
};

/**
 * Zustand store for font UI state
 * Persists selection and search to sessionStorage
 */
export const useFontStore = create<FontStoreState>()(
  persist(
    set => ({
      ...initialState,

      // Font data actions
      setFonts: fonts => {
        logger.info("Setting fonts in store:", fonts.length);
        set({ fonts });
      },

      setCurrentFont: font => {
        logger.info("Setting current font:", font?.id);
        set({ currentFont: font });
      },

      setSelectedFontId: id => {
        logger.info("Setting selected font ID:", id);
        set({ selectedFontId: id });
      },

      // Search actions
      setSearchTerm: term => {
        logger.info("Setting search term:", term);
        set({ searchTerm: term });
      },

      clearSearch: () => {
        logger.info("Clearing search");
        set({ searchTerm: "" });
      },

      // UI actions
      openFilePicker: () => {
        logger.info("Opening file picker");
        set({ isFilePickerOpen: true });
      },

      closeFilePicker: () => {
        logger.info("Closing file picker");
        set({ isFilePickerOpen: false });
      },

      startCreating: () => {
        logger.info("Starting font creation");
        set({
          isCreating: true,
          isEditing: false,
          currentFont: null,
          selectedFontId: null,
        });
      },

      cancelCreating: () => {
        logger.info("Canceling font creation");
        set({ isCreating: false });
      },

      startEditing: () => {
        logger.info("Starting font editing");
        set({ isEditing: true });
      },

      cancelEditing: () => {
        logger.info("Canceling font editing");
        set({ isEditing: false });
      },

      // Loading actions
      setLoading: loading => set({ isLoading: loading }),
      setSaving: saving => set({ isSaving: saving }),

      // Utility
      reset: () => {
        logger.info("Resetting font store");
        set(initialState);
      },
    }),
    {
      name: "font-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      // Persist only essential state
      partialize: state => ({
        selectedFontId: state.selectedFontId,
        searchTerm: state.searchTerm,
      }),
      // Custom merge to handle restoration
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<State>;
        return {
          ...currentState,
          selectedFontId:
            typedPersistedState.selectedFontId ?? currentState.selectedFontId,
          searchTerm: typedPersistedState.searchTerm ?? currentState.searchTerm,
        };
      },
    }
  )
);
```

**Key Features**:

- Manages font list, current font, and selection
- Search term persistence
- File picker dialog state
- Create/edit mode management
- Loading states for async operations
- Session storage persistence for UX continuity

---

### Step 4: Create Apollo Mutation Hooks

**File**: `/workspaces/cgvs/client/views/font/hooks/useFontApolloMutations.ts`

**Dependencies**:

- `@apollo/client/react`
- `client/views/font/hooks/font.documents`
- `client/views/font/stores/useFontStore`
- Pattern: `client/views/student/hook/useStudentApolloMutations.ts`

**Content**:

```typescript
"use client";

import { useMutation, useApolloClient } from "@apollo/client/react";
import { gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "./font.documents";
import { useFontStore } from "../stores/useFontStore";
import logger from "@/client/lib/logger";

/**
 * Apollo mutations hook for font operations
 * Handles cache updates and optimistic responses
 */
export const useFontApolloMutations = () => {
  const store = useFontStore();
  const client = useApolloClient();

  /**
   * Evict fonts cache to force refetch
   */
  const evictFontsCache = () => {
    logger.info("Evicting fonts cache");

    // Evict fonts query
    client.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "fonts",
    });

    // Evict search results
    client.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "searchFonts",
    });

    // Run garbage collection
    client.cache.gc();
  };

  /**
   * Create font mutation
   */
  const [createMutation] = useMutation(Document.createFontMutationDocument, {
    update(cache, { data }) {
      if (!data?.createFont) return;

      logger.info("Font created, updating cache:", data.createFont);

      // Evict cache to force refetch
      evictFontsCache();
    },
    onError(error) {
      logger.error("Create font mutation error:", error);
    },
  });

  /**
   * Update font mutation with optimistic response
   */
  const [updateMutation] = useMutation(Document.updateFontMutationDocument, {
    optimisticResponse: vars => {
      logger.info("Optimistic update for font:", vars.input.id);

      try {
        // Read existing font from cache
        const existingFont = client.cache.readFragment<
          Graphql.FontQuery["font"]
        >({
          id: client.cache.identify({
            __typename: "Font",
            id: vars.input.id,
          }),
          fragment: gql`
            fragment FontFields on Font {
              id
              name
              locale
              storageFileId
              createdAt
              updatedAt
            }
          `,
        });

        // Return optimistic response
        return {
          __typename: "Mutation" as const,
          updateFont: {
            __typename: "Font" as const,
            id: vars.input.id,
            name: vars.input.name,
            locale: vars.input.locale,
            storageFileId: vars.input.storageFileId,
            createdAt: existingFont?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      } catch (error) {
        logger.error("Error creating optimistic response:", error);
        // Return partial data if cache read fails
        return {
          __typename: "Mutation" as const,
          updateFont: {
            __typename: "Font" as const,
            id: vars.input.id,
            name: vars.input.name,
            locale: vars.input.locale,
            storageFileId: vars.input.storageFileId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      }
    },
    update(cache, { data }) {
      if (!data?.updateFont) return;

      logger.info("Font updated, evicting cache:", data.updateFont);

      // Evict fonts list to refetch with updated data
      evictFontsCache();
    },
    onError(error) {
      logger.error("Update font mutation error:", error);
    },
  });

  /**
   * Delete font mutation
   */
  const [deleteMutation] = useMutation(Document.deleteFontMutationDocument, {
    update(cache, { data }) {
      if (!data?.deleteFont) return;

      logger.info("Font deleted, updating cache:", data.deleteFont);

      // Remove from cache
      cache.evict({
        id: cache.identify({
          __typename: "Font",
          id: data.deleteFont.id,
        }),
      });

      // Evict fonts list
      evictFontsCache();

      // Clear selection if deleted font was selected
      if (store.selectedFontId === data.deleteFont.id) {
        store.setSelectedFontId(null);
        store.setCurrentFont(null);
      }
    },
    onError(error) {
      logger.error("Delete font mutation error:", error);
    },
  });

  return {
    createFontMutation: createMutation,
    updateFontMutation: updateMutation,
    deleteFontMutation: deleteMutation,
    evictFontsCache,
  };
};
```

**Key Features**:

- Cache eviction after create/delete
- Optimistic updates for instant UI feedback
- Error logging for debugging
- Store integration for selection management
- Proper TypeScript typing

---

### Step 5: Create Operations Hook

**File**: `/workspaces/cgvs/client/views/font/hooks/useFontOperations.ts`

**Dependencies**:

- `@apollo/client/react` (useQuery, useLazyQuery)
- `client/views/font/hooks/font.documents`
- `client/views/font/hooks/useFontApolloMutations`
- `client/views/font/stores/useFontStore`
- Pattern: `client/views/student/hook/useStudentOperations.tsx`

**Content**:

```typescript
"use client";

import { useQuery, useLazyQuery } from "@apollo/client/react";
import { useFontApolloMutations } from "./useFontApolloMutations";
import { useFontStore } from "../stores/useFontStore";
import * as Document from "./font.documents";
import { FontFormData, FontUsageCheckResult } from "../types";
import logger from "@/client/lib/logger";
import { useToast } from "@/client/hooks/use-toast";

/**
 * Font operations hook
 * Integrates Apollo mutations with Zustand store
 * Provides high-level operations for font management
 */
export const useFontOperations = () => {
  const store = useFontStore();
  const { toast } = useToast();
  const { createFontMutation, updateFontMutation, deleteFontMutation } =
    useFontApolloMutations();

  // Load all fonts query
  const {
    data: fontsData,
    loading: fontsLoading,
    error: fontsError,
    refetch: refetchFonts,
  } = useQuery(Document.fontsQueryDocument, {
    onCompleted: data => {
      if (data.fonts) {
        store.setFonts(data.fonts);
        logger.info("Fonts loaded:", data.fonts.length);
      }
    },
    onError: error => {
      logger.error("Error loading fonts:", error);
      toast({
        title: "Error loading fonts",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Lazy query for single font
  const [loadFont, { loading: fontLoading }] = useLazyQuery(
    Document.fontQueryDocument,
    {
      onCompleted: data => {
        if (data.font) {
          store.setCurrentFont(data.font);
          logger.info("Font loaded:", data.font.id);
        }
      },
      onError: error => {
        logger.error("Error loading font:", error);
        toast({
          title: "Error loading font",
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );

  // Lazy query for search
  const [searchFonts, { loading: searchLoading }] = useLazyQuery(
    Document.searchFontsQueryDocument,
    {
      onCompleted: data => {
        if (data.searchFonts) {
          store.setFonts(data.searchFonts);
          logger.info("Search results:", data.searchFonts.length);
        }
      },
      onError: error => {
        logger.error("Error searching fonts:", error);
        toast({
          title: "Error searching fonts",
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );

  // Lazy query for usage check
  const [checkUsage] = useLazyQuery(Document.checkFontUsageQueryDocument);

  /**
   * Select a font by ID
   */
  const selectFont = async (id: number) => {
    logger.info("Selecting font:", id);
    store.setSelectedFontId(id);
    await loadFont({ variables: { id } });
  };

  /**
   * Search fonts by name
   */
  const handleSearch = async (term: string) => {
    logger.info("Searching fonts:", term);
    store.setSearchTerm(term);

    if (term.trim().length === 0) {
      // If search is empty, load all fonts
      await refetchFonts();
    } else {
      // Search with term
      await searchFonts({
        variables: {
          name: term,
          limit: 50,
        },
      });
    }
  };

  /**
   * Create a new font
   */
  const createFont = async (formData: FontFormData): Promise<boolean> => {
    if (!formData.storageFileId) {
      toast({
        title: "Validation Error",
        description: "Please select a font file",
        variant: "destructive",
      });
      return false;
    }

    if (formData.locale.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one locale",
        variant: "destructive",
      });
      return false;
    }

    try {
      store.setSaving(true);
      logger.info("Creating font:", formData);

      const result = await createFontMutation({
        variables: {
          input: {
            name: formData.name,
            locale: formData.locale,
            storageFileId: formData.storageFileId,
          },
        },
      });

      if (result.data?.createFont) {
        toast({
          title: "Font created",
          description: `${result.data.createFont.name} has been created successfully`,
        });

        // Select the new font
        await selectFont(result.data.createFont.id);
        store.cancelCreating();

        return true;
      }

      return false;
    } catch (error) {
      logger.error("Error creating font:", error);
      toast({
        title: "Error creating font",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    } finally {
      store.setSaving(false);
    }
  };

  /**
   * Update an existing font
   */
  const updateFont = async (
    id: number,
    formData: FontFormData
  ): Promise<boolean> => {
    if (!formData.storageFileId) {
      toast({
        title: "Validation Error",
        description: "Please select a font file",
        variant: "destructive",
      });
      return false;
    }

    if (formData.locale.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one locale",
        variant: "destructive",
      });
      return false;
    }

    try {
      store.setSaving(true);
      logger.info("Updating font:", id, formData);

      const result = await updateFontMutation({
        variables: {
          input: {
            id,
            name: formData.name,
            locale: formData.locale,
            storageFileId: formData.storageFileId,
          },
        },
      });

      if (result.data?.updateFont) {
        toast({
          title: "Font updated",
          description: `${result.data.updateFont.name} has been updated successfully`,
        });

        // Reload the updated font
        await selectFont(id);
        store.cancelEditing();

        return true;
      }

      return false;
    } catch (error) {
      logger.error("Error updating font:", error);
      toast({
        title: "Error updating font",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    } finally {
      store.setSaving(false);
    }
  };

  /**
   * Delete a font (with usage check)
   */
  const deleteFont = async (id: number): Promise<boolean> => {
    try {
      // First check usage
      logger.info("Checking font usage before delete:", id);
      const usageResult = await checkUsage({
        variables: { id },
      });

      const usageData = usageResult.data?.checkFontUsage;

      if (usageData && !usageData.canDelete) {
        toast({
          title: "Cannot delete font",
          description:
            usageData.deleteBlockReason || "Font is currently in use",
          variant: "destructive",
        });
        return false;
      }

      // Proceed with deletion
      store.setLoading(true);
      logger.info("Deleting font:", id);

      const result = await deleteFontMutation({
        variables: { id },
      });

      if (result.data?.deleteFont) {
        toast({
          title: "Font deleted",
          description: `${result.data.deleteFont.name} has been deleted successfully`,
        });

        return true;
      }

      return false;
    } catch (error) {
      logger.error("Error deleting font:", error);
      toast({
        title: "Error deleting font",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  /**
   * Check font usage
   */
  const checkFontUsage = async (
    id: number
  ): Promise<FontUsageCheckResult | null> => {
    try {
      logger.info("Checking font usage:", id);
      const result = await checkUsage({
        variables: { id },
      });

      return result.data?.checkFontUsage || null;
    } catch (error) {
      logger.error("Error checking font usage:", error);
      return null;
    }
  };

  return {
    // Data
    fonts: fontsData?.fonts || [],
    currentFont: store.currentFont,
    selectedFontId: store.selectedFontId,
    searchTerm: store.searchTerm,

    // Loading states
    isLoading: fontsLoading || fontLoading || store.isLoading,
    isSaving: store.isSaving,
    isSearching: searchLoading,

    // Operations
    selectFont,
    handleSearch,
    createFont,
    updateFont,
    deleteFont,
    checkFontUsage,
    refetchFonts,

    // Store actions
    ...store,
  };
};
```

**Key Features**:

- Integrates queries, mutations, and store
- Usage validation before delete
- Toast notifications for user feedback
- Loading state management
- Error handling with user-friendly messages
- Search with automatic fallback to all fonts

---

### Step 6: Create Hooks Index

**File**: `/workspaces/cgvs/client/views/font/hooks/index.ts`

**Content**:

```typescript
export * from "./font.documents";
export * from "./useFontApolloMutations";
export * from "./useFontOperations";
```

---

## Directory Structure

After implementation, the structure should be:

```
client/views/font/
├── types.ts
├── hooks/
│   ├── index.ts
│   ├── font.documents.ts
│   ├── useFontApolloMutations.ts
│   └── useFontOperations.ts
└── stores/
    └── useFontStore.ts
```

---

## Validation Checklist

After implementation, verify:

1. **TypeScript Compilation**

```bash
~/.bun/bin/bun tsc
```

Expected: No errors (may have errors about generated types until GraphQL schema is regenerated)

2. **Linting**

```bash
~/.bun/bin/bun lint
```

Expected: No errors

3. **Files Created**

- [ ] `/workspaces/cgvs/client/views/font/types.ts` created
- [ ] `/workspaces/cgvs/client/views/font/hooks/font.documents.ts` created
- [ ] `/workspaces/cgvs/client/views/font/hooks/useFontApolloMutations.ts` created
- [ ] `/workspaces/cgvs/client/views/font/hooks/useFontOperations.ts` created
- [ ] `/workspaces/cgvs/client/views/font/hooks/index.ts` created
- [ ] `/workspaces/cgvs/client/views/font/stores/useFontStore.ts` created

4. **Store Functionality**

- [ ] Store persists to sessionStorage
- [ ] Store manages font list and selection
- [ ] Store manages UI states (creating, editing, file picker)

5. **GraphQL Documents**

- [ ] All queries defined
- [ ] All mutations defined
- [ ] Proper TypeScript typing (once schema generated)

6. **Hooks**

- [ ] Apollo mutations handle cache updates
- [ ] Operations hook integrates everything
- [ ] Error handling with toast notifications
- [ ] Loading states managed correctly

---

## GraphQL Schema Generation

After completing server implementation:

```bash
# Generate GraphQL types (adjust command based on your setup)
~/.bun/bin/bun run graphql:codegen
```

This will generate the TypeScript types in `client/graphql/generated/gql/graphql.ts` that the documents reference.

---

## Next Steps

After successful validation:

1. Regenerate GraphQL schema
2. Verify TypeScript compilation with generated types
3. Proceed to Sub-Plan 3: Client UI Components
4. Update master plan progress

---

## Notes

- Font documents reference generated GraphQL types that will be created after schema generation
- Store uses sessionStorage for persistence (UX improvement)
- Operations hook provides high-level interface for components
- Usage check runs before delete to prevent errors
- All operations have loading states and error handling
- Toast notifications provide user feedback
