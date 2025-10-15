Step 1: Enhance the Zustand Store
First, we'll move the remaining state managed by React.useState in your context provider into the Zustand store.

currentCategory: Graphql.TemplateCategoryWithParentTree | null

onNewTemplateCancel: (() => void) | undefined

File: 3-categories.store.ts

TypeScript

// ... imports

interface CategoryUIState {
  // ... existing state
  currentCategoryId: number | null;
  currentTemplateId: number | null;
  // ...

  // Add the new state from the context
  currentCategory: Graphql.TemplateCategoryWithParentTree | null;
  onNewTemplateCancel?: () => void; // Note: Storing functions is not ideal for persistence, but we'll mirror the current logic.

  // Actions
  // ... existing actions
  setCurrentCategoryId: (id: number | null) => void;
  // ...

  // Add setters for the new state
  setCurrentCategory: (category: Graphql.TemplateCategoryWithParentTree | null) => void;
  setOnNewTemplateCancel: (callback?: () => void) => void;
}

const initialState = {
  // ... existing initial state
  currentCategoryId: null,
  currentTemplateId: null,
  // ...

  // Add new initial state
  currentCategory: null,
  onNewTemplateCancel: undefined,
};

export const useTemplateCategoryUIStore = create<CategoryUIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ... existing actions
      setCurrentCategoryId: (id) =>
        set({
          currentCategoryId: id,
          currentTemplateId: null, // Reset template when category changes
        }),
      // ...

      // Add new actions
      setCurrentCategory: (category) => set({ currentCategory: category }),

      setOnNewTemplateCancel: (callback) => set({ onNewTemplateCancel: callback }),

      // Modify confirmSwitch to use the callback from the store
      confirmSwitch: () => {
        const { pendingCategoryId, onNewTemplateCancel } = get();
        if (onNewTemplateCancel) {
          onNewTemplateCancel();
        }
        set({
          isAddingTemplate: false,
          currentCategoryId: pendingCategoryId,
          currentTemplateId: null,
          isSwitchWarningOpen: false,
          pendingCategoryId: null,
        });
      },

      // ... rest of the store
    }),
    {
      name: "template-category-ui-store",
      // ... persistence config
      // Exclude non-serializable function from persistence
      partialize: (state) => {
        const { onNewTemplateCancel, ...rest } = state;
        return {
            ...rest,
            expandedCategoryIds: Array.from(state.expandedCategoryIds),
            fetchedCategoryIds: Array.from(state.fetchedCategoryIds),
            templateQueryVariables: Array.from(state.templateQueryVariables.entries()),
        };
      },
      // ... merge function
    },
  ),
);
Step 2: Refactor the GraphQL Service (useTemplateCategoryService)
Now, let's modify the service hook. It will no longer return data from mutations. Instead, it will import the Zustand store and call the appropriate state setters upon a successful API call. This makes the service a true "command" hook.

File: 2-category.gqlService.tsx

TypeScript

"use client";

import { useCallback, useMemo } from "react";
// ... other imports
import { useTemplateCategoryUIStore } from "./3-categories.store"; // 👈 Import the store

export const useTemplateCategoryService = () => {
  const apollo = useTemplateCategoryGraphQL();
  const notifications = useNotifications();
  const strings = useAppTranslation("templateCategoryTranslations");

  // Get the state and setters from the store
  const { 
    currentCategoryId,
    currentTemplateId,
    setCurrentCategoryId, 
    setCurrentTemplateId 
  } = useTemplateCategoryUIStore();

  /**
   * Create a new template category.
   * Updates the store directly on success.
   */
  const createCategory = useCallback(
    async (input: Graphql.TemplateCategoryCreateInput): Promise<void> => {
      try {
        const result = await apollo.createTemplateCategoryMutation({ variables: { input } });

        if (result.data) {
          notifications.show(strings.categoryAddedSuccessfully, { severity: "success" });
          // Directly update the store instead of returning a value
          setCurrentCategoryId(result.data.createTemplateCategory.id); 
        } else {
          logger.error("Error creating template category:", result.error);
          notifications.show(strings.categoryAddFailed, { severity: "error" });
        }
      } catch (error) {
        logger.error("Error creating template category:", error);
        notifications.show(strings.categoryAddFailed, { severity: "error" });
      }
    },
    [apollo, notifications, strings, setCurrentCategoryId],
  );

  /**
   * Delete a template category.
   * Updates the store directly on success.
   */
  const deleteCategory = useCallback(
    async (id: number): Promise<void> => {
      try {
        const result = await apollo.deleteTemplateCategoryMutation({ variables: { id } });

        if (result.data) {
          notifications.show(strings.categoryDeletedSuccessfully, { severity: "success" });
          // If the deleted category was the active one, clear it from the store
          if (currentCategoryId === id) {
            setCurrentCategoryId(null);
          }
        } else {
          // ... error handling
        }
      } catch (error) {
        // ... error handling
      }
    },
    [apollo, notifications, strings, currentCategoryId, setCurrentCategoryId],
  );

  /**
   * Create a new template.
   * Updates the store directly on success.
   */
  const createTemplate = useCallback(
    async (input: Graphql.CreateTemplateMutationVariables["input"]): Promise<void> => {
      try {
        const result = await apollo.createTemplateMutation({ variables: { input } });

        if (result.data?.createTemplate) {
          notifications.show(strings.templateAddedSuccessfully, { severity: "success" });
          // Directly update the store
          setCurrentTemplateId(result.data.createTemplate.id);
        } else {
          // ... error handling
        }
      } catch (error) {
        // ... error handling
      }
    },
    [apollo, notifications, strings, setCurrentTemplateId],
  );

  // ... Apply the same pattern to ALL other functions in this file ...
  // (updateCategory, updateTemplate, suspendTemplate, unsuspendTemplate)
  // 1. Change the return type to Promise<void> or Promise<boolean>
  // 2. On success, call the appropriate store setter (e.g., setCurrentTemplateId)
  // 3. Remove the `return result.data.someValue` statements.

  return useMemo(
    () => ({
      createCategory,
      // ... all other functions
    }),
    [
      createCategory,
      // ... all other function dependencies
    ],
  );
};
Step 3: Create a Standalone Dialog Component
Extract the Dialog JSX from the context provider into its own clean, reusable component. This component will be self-contained, getting all its state and logic from the Zustand store.

New File: CategorySwitchWarningDialog.tsx

TypeScript

"use client";

import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { useTemplateCategoryUIStore } from "./3-categories.store";

export const CategorySwitchWarningDialog = () => {
  const messages = useAppTranslation("templateCategoryTranslations");
  
  // Get all necessary state and actions directly from the store
  const { isSwitchWarningOpen, closeSwitchWarning, confirmSwitch } = useTemplateCategoryUIStore();

  return (
    <Dialog open={isSwitchWarningOpen} onClose={closeSwitchWarning}>
      <DialogTitle>{messages.confirmSwitchCategory}</DialogTitle>
      <DialogContent>
        {messages.switchCategoryWhileAddingTemplate}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeSwitchWarning}>{messages.cancel}</Button>
        <Button onClick={confirmSwitch} color="primary">
          {messages.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
Step 4: Update Your Application
Now you can remove the context provider and update the components that were using it.

1. Render the New Dialog
Place the new <CategorySwitchWarningDialog /> in your main layout component (e.g., DashboardLayout.tsx or similar) so it's available globally.

JavaScript

// In your main layout file...
import { CategorySwitchWarningDialog } from '@/path/to/CategorySwitchWarningDialog';

export default function DashboardLayout({ children }) {
  return (
    <>
      {/* ... your other layout components ... */}
      {children}
      <CategorySwitchWarningDialog />
    </>
  );
}


3. Update Component Logic
In any component that used useTemplateCategoryManagement, replace it with direct calls to useTemplateCategoryUIStore and useTemplateCategoryService.

Before:

JavaScript

const { createCategory, currentCategoryId, setOnNewTemplateCancel } = useTemplateCategoryManagement();
After: 🚀

JavaScript

// For state and UI values
const { currentCategoryId, setOnNewTemplateCancel } = useTemplateCategoryUIStore();

// For actions/mutations
const { createCategory } = useTemplateCategoryService();
Step 5: Final Cleanup 🧹
Delete: You can now safely delete the 4-categories.context.tsx file.

Verify: Check the useTemplateCategoryManagement hook in 4-categories.context.tsx. It combined the context and store. Since you're now using the store and service hooks directly, you can also delete the useTemplateCategoryManagement hook itself.

By following these steps, you'll successfully refactor your application to a cleaner, more direct state management architecture without the need for the React Context layer.
