# File Manager UI Implementation Plan (Revision 4)

This document outlines a comprehensive plan for the file manager UI. The architecture is centered around a clear separation of concerns between core data operations, UI interaction state, and presentational components.

---

## 1. High-Level Architecture: A Multi-Context Approach

The system will be governed by four distinct contexts working together:

1.  **`StorageManagementContext` (Core):** The headless, core context responsible for all backend data operations. It fetches the file list and provides the core API for mutations (`rename`, `delete`, etc.). It contains no UI state.
2.  **`StorageUIManagerContext` (UI State):** A new UI-centric context that manages all user interaction state, including item selection, clipboard (cut/copy), and drag-and-drop states. It consumes the Core context to execute actions.
3.  **`MenuManagerContext` (Menus):** A specialized context for managing the visibility, position, and content of all context menus.
4.  **`StorageUploadContext` (Uploads):** A specialized context for handling file uploads from the user's computer.

---

## 2. Core Data (`StorageManagementContext`)

This context is the single source of truth for the file list and the bridge to the backend.

-   **Existing Responsibilities:** `fetchList`, `rename`, `remove`, `navigateTo`.
-   **New Functions to be Added:**
    -   `move(sourcePaths: string[], destinationPath: string): Promise<boolean>`
    -   `copy(sourcePaths: string[], destinationPath: string): Promise<boolean>`
    -   `createFolder(path: string, name: string): Promise<boolean>`
    -   `search(query: string, path?: string): Promise<StorageItem[]>` - Search for files and folders

---

## 3. UI State & Interaction (`StorageUIManagerContext`)

This new context will manage the complex interactive state of the file browser.

### State to Manage:
-   `selectedItems`: An array of the paths of all currently selected items.
-   `lastSelectedItem`: The path of the item that was last clicked, crucial for Shift-click range selections.
-   `clipboard`: An object `{ operation: 'copy' | 'cut', items: StorageItem[] }` to track clipboard state.
-   `viewMode`: Current view mode (`'grid'` or `'list'`).
-   `searchMode`: Boolean indicating if currently in search mode.
-   `searchResults`: Array of search results when in search mode.

### Interaction Logic to Implement:

1.  **Advanced Selection (No Checkboxes):**
    -   The selection state will be visually represented by styling the item rows/cards (e.g., a different background color).
    -   **Single Click:** Deselects all other items and selects the clicked item.
    -   **Ctrl + Click:** Toggles the selection state of the clicked item without affecting others.
    -   **Shift + Click:** Selects all items between the `lastSelectedItem` and the currently clicked item.
    -   **Spacebar:** Toggles the selection of the currently focused item.

2.  **Drag-to-Move:**
    -   All `StorageItem` components will be draggable.
    -   `FolderItem` components will be drop targets.
    -   The `onDrop` handler will call the `move()` function from the Core context.
    -   **Validation:** The UI will prevent dropping a folder onto itself, one of its own children, or a non-folder item.

3.  **Copy/Cut/Paste:**
    -   **Copy:** Copies the `selectedItems` to the internal `clipboard` with `operation: 'copy'`.
    -   **Cut:** Copies the `selectedItems` to the `clipboard` with `operation: 'cut'`. The UI will visually change the cut items (e.g., make them semi-transparent).
    -   **Paste:** When in a folder, this action will read the `clipboard`. If the operation was `cut`, it calls the Core `move()` function. If it was `copy`, it calls the Core `copy()` function. The clipboard is cleared after a successful paste.

### 3.4 Keyboard Navigation
To ensure accessibility and provide power-user capabilities, the file manager will be fully navigable via the keyboard. The `StorageUIManagerContext` will manage the focused state.

-   **State to Manage:**
    -   `focusedItem`: The path of the item that currently has keyboard focus, distinct from selection.

-   **Focus Movement:**
    -   **Arrow Keys (Up/Down/Left/Right):** Change the `focusedItem`. The logic will adapt to the current view (list or grid) to move focus intuitively.
    -   **Home/End:** Move focus to the first/last item in the list.

-   **Item Interaction:**
    -   **Enter:**
        -   On a folder: Navigates into it (calls `navigateTo`).
        -   On a file: Triggers the primary action (e.g., opens a preview or downloads).
    -   **Menu Key / Shift+F10:** Opens the context menu for the `focusedItem`.
    -   **F2:** Initiates the rename process for the `focusedItem`.
    -   **Delete:** Triggers the delete action for all `selectedItems`.

-   **Selection via Keyboard:**
    -   **Shift + Arrow Keys:** Extends the selection from the `lastSelectedItem` to the newly focused item.
    -   **Ctrl + Spacebar:** Toggles the selection state of the `focusedItem` without deselecting other items.
    -   **Ctrl + A:** Selects all items in the current view.

-   **Clipboard Shortcuts:**
    -   **Ctrl + C:** Copies the `selectedItems` to the clipboard.
    -   **Ctrl + X:** Cuts the `selectedItems` to the clipboard.
    -   **Ctrl + V:** Pastes from the clipboard into the current directory.

---

## 4. Menu System & Uploads Architecture

This section details the architecture for handling context menus and file uploads.

### Menu Architecture
A flexible system for displaying context menus, decoupled from the trigger mechanism (works for both right-click and left-click).
- **`MenuManagerContext`:** A central context will hold the state of the currently active menu (its type, target data, and position).
- **`MenuManager` Component:** A single `MenuManager`, placed high in the app layout, will read from this context and render the appropriate menu component (`FileMenu`, `FolderMenu`, etc.) at the correct position.
- **Triggering:** Any component can trigger a menu by calling the `openMenu` function from the `MenuManagerContext`.

### Upload Architecture
- **`UploadDropzone` Component:** A specialized component to handle file uploads via drag-and-drop. It will use the `StorageUploadContext` to access the `uploadFiles` function.
- **`uploadPath` Prop:** The component will be configured with an `uploadPath` prop to specify the destination directory, making it adaptable for dropping files on the main view or directly onto folders.

---

## 5. Menu Actions & Content (Updated)

This section defines the content of each menu.

### `FileMenu`
-   **Cut**
-   **Copy**
-   **Download:** Create a link (`<a>`) with its `href` set to the file's `mediaLink` property.
-   **Rename:** Trigger a modal and call the context's `rename()` function.
-   **Delete:** Show a confirmation dialog and call the context's `remove()` function.
-   **Get Info:** Open a details panel showing `name`, `size`, `contentType`, `lastModified`, `created`, and `path`.

### `FolderMenu`
-   **Open:** Call the context's `navigateTo()` function.
-   **Cut**
-   **Copy**
-   **Paste:** (Disabled if clipboard is empty).
-   **Rename**
-   **Delete**
-   **Get Info:** Open a details panel showing `name`, `path`, `fileCount`, `folderCount`, `totalSize`, etc.

### `ViewAreaMenu`
-   **Paste:** (Disabled if clipboard is empty).
-   **Upload Files:** Call `startUpload()` from `StorageUploadContext`.
-   **New Folder:** Call `createFolder()` from `StorageManagementContext`.
-   **Refresh:** Call the context's `refresh()` function.
-   **Select All**

---

## 6. Views: Grid and List Rendering (Updated & Merged)

This section details the components responsible for rendering the file browser, now driven by the new `StorageUIManagerContext`. The implementation will use standard HTML elements (`div`, `table`, etc.) and will not rely on a UI library like MUI for its core structure.

### `StorageBrowserView.tsx` (New)
-   **Responsibilities:**
    -   Acts as the main container for the file browser UI.
    -   Will be wrapped by all necessary contexts (`StorageManagementProvider`, `StorageUIManagerProvider`, etc.).
    -   Consumes `StorageManagementContext` to get the current path.
    -   Renders the `StorageSearch` component at the top.
    -   Renders the `StorageBreadcrumb` component below the search.
    -   Renders the `StorageItemsView` component below the breadcrumb.

### `StorageSearch.tsx` (New)
-   **Props:** None (consumes context directly).
-   **State to Manage:**
    -   `searchQuery`: Current search input value.
    -   `searchHistory`: Array of previous search queries (persisted in localStorage).
    -   `showHistory`: Boolean to control the visibility of the search history dropdown.
    -   `isSearching`: Boolean to show loading state during search.
-   **Logic:**
    -   Renders a search input field with a search icon.
    -   Maintains search history in localStorage (key: `storage-search-history`).
    -   Shows a dropdown with search history when the input is focused and has history.
    -   Clicking on a history item populates the search field and triggers the search.
    -   On search submission (Enter key or search button):
        - Calls `search()` from `StorageManagementContext`.
        - Adds the query to search history (avoiding duplicates).
        - Updates the UI to show search results instead of current directory listing.
    -   Provides a "Clear" or "X" button to exit search mode and return to directory browsing.
    -   Search history management:
        - Stores up to 10 recent searches.
        - Removes duplicates by moving existing queries to the top.
        - Provides option to clear individual history items or entire history.

### `StorageItemsView.tsx`
-   **Responsibilities:**
    -   Consumes `StorageManagementContext` to get the list of items (either directory listing or search results).
    -   Detects whether the current view is showing search results or directory contents.
    -   Contains the logic for switching between grid and list views.
    -   Displays a toolbar with a segmented control for switching between grid and list views, as seen in the design.
    -   For search results: Shows the number of results found and the search query.
    -   Renders the appropriate container (`div` for grid, `table` for list) and maps over the items, rendering a `StorageItem` for each.
    -   Displays headers for the list view (Name, Size, Last Modified, Path - for search results).

### `StorageBreadcrumb.tsx` (New)
-   **Props:** `path` (string), `onNavigateToPath` (function).
-   **Logic:**
    -   Renders the breadcrumb navigation based on the current path, as seen in the design.
    -   Each part of the path should be a clickable link to navigate to that directory.
    -   For paths that are too long to fit the container, it should intelligently truncate the path, showing the beginning and the end, with an ellipsis in the middle (e.g., `My Drive > ... > very > long > path`).

### `StorageItem.tsx`
-   **Responsibilities:**
    -   Acts as a router for an individual item, deciding whether to render the grid or list version.
    -   Consumes `StorageUIManagerContext` to determine if it is `isSelected` or `isCut` and applies styles accordingly.
    -   Its `onClick` handler will call the advanced selection logic from the UI context (handling ctrl/shift keys).
    -   Handles the double-click action to navigate into a folder.
    -   It will be a **draggable source** for the drag-to-move functionality.
    -   If the item is a folder, it will also be a **drop target**.
    -   Decides whether to render a `StorageItemGrid` or `StorageItemListRow` component.

### `StorageItemGrid.tsx`
-   **Props:** `item`, `isSelected`.
-   **Logic:**
    -   Renders a single "card" in the grid view using a `div`.
    -   If the item is a folder, it displays a large `FileTypeIcon`.
    -   If the item is a file, it renders the `FilePreview` component.
    -   Displays the `item.name` below the icon/preview with text truncation.
    -   The `onClick` and drag/drop logic is handled by the parent `StorageItem`.

### `StorageItemListRow.tsx`
-   **Props:** `item`, `isSelected`.
-   **Logic:**
    -   Renders a single row in the list view using a `<tr>` (table row) element.
    -   Uses `<td>` cells for columns:
        -   The `FileTypeIcon` component.
        -   The `item.name`.
        -   The formatted `item.size`.
        -   The formatted `item.lastModified` date.
    -   For folders, the size and date columns will display a dash (—).

### `FilePreview.tsx`
-   **Props:** `file` (FileInfo).
-   **Logic:**
    -   Renders the large preview area within the `StorageItemGrid` card.
    -   Initially, it will use the `FileTypeIcon` to show a large, centered icon.
    -   **Future Enhancement:** Can be enhanced to check `file.contentType`. If it's an image, render an `<img>` tag. For other types, fall back to the icon.

### `FileTypeIcon.tsx`
-   **Props:** `item` (StorageItem).
-   **Logic:** A small, reusable helper component to centralize the logic for choosing an icon. It inspects the item's type to return the appropriate icon (e.g., Folder, Image, Article). This ensures consistency between views.

---

## 7. Final File List

-   **Contexts:**
    -   `nextjs/contexts/StorageUIManagerContext.tsx` (New)
    -   `nextjs/contexts/MenuManagerContext.tsx`
-   **Components:**
    -   `nextjs/components/storage/dropzone/...`
    -   `nextjs/components/storage/menu/...`
-   **Views:**
    -   `nextjs/views/storage/browser/StorageBrowserView.tsx` (New)
    -   `nextjs/views/storage/browser/StorageSearch.tsx` (New)
    -   `nextjs/views/storage/browser/StorageItemsView.tsx`
    -   `nextjs/views/storage/browser/StorageBreadcrumb.tsx` (New)
    -   `nextjs/views/storage/browser/StorageItem.tsx`
    -   `nextjs/views/storage/browser/StorageItemGrid.tsx`
    -   `nextjs/views/storage/browser/StorageItemListRow.tsx`
    -   `nextjs/views/storage/browser/FilePreview.tsx`
    -   `nextjs/views/storage/browser/FileTypeIcon.tsx`
